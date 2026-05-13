"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/PageHeader";
import {
  aiAssignmentGenerationResponseSchema,
  generateMockAssignmentDays,
  type AiAssignmentGenerationRequest,
} from "@/features/ai";
import { PdfPreviewPanel } from "@/features/pdf";
import { templateCategoryLabels } from "@/features/templates/templateForm";
import { addDaysToDateInputValue, calculateInclusiveDateCount, getJapaneseDayOfWeek } from "@/lib/dates";
import {
  findAssignmentPlanById,
  listAssignmentPlans,
  listBooks,
  listCustomers,
  listTemplates,
  saveAssignmentPlan,
} from "@/lib/storage";
import type {
  AssignmentLocation,
  AssignmentPlan,
  Book,
  Customer,
  PdfMode,
  Template,
  TemplateCategory,
} from "@/types";
import {
  assignmentLocationOptions,
  assignmentPlanFormSchema,
  assignmentPlanFormValuesToPlan,
  assignmentPlanToFormValues,
  createDefaultTitle,
  generateAssignmentDayFormValues,
  getDefaultAssignmentPlanFormValues,
  pdfModeOptions,
  type AssignmentPlanFormValues,
} from "./assignmentPlanForm";
import { assignStudyTasksToDays } from "./studyAssignment";

const locationLabelMap: Record<AssignmentLocation, string> = {
  home: "自宅",
  gym: "フィットネスジム",
  outdoor: "屋外",
  rest: "休養",
  other: "任意",
};

const pdfModeLabelMap: Record<PdfMode, string> = {
  single_page: "基本1枚",
  two_pages: "読みやすさ優先で2枚まで許可",
};

type TemplateTargetField =
  | "trainingTasksText"
  | "cardioTask"
  | "mobilityTask"
  | "mealTask"
  | "sleepTask"
  | "weightLogTask"
  | "waterTask"
  | "habitTask"
  | "studyTask"
  | "memo"
  | "checkItemsText";

type TemplateApplySelectProps = {
  categories: TemplateCategory[];
  label: string;
  templates: Template[];
  onApply: (template: Template) => void;
};

function TemplateApplySelect({ categories, label, templates, onApply }: TemplateApplySelectProps) {
  const filteredTemplates = templates.filter((template) => categories.includes(template.category));

  if (filteredTemplates.length === 0) {
    return null;
  }

  return (
    <select
      aria-label={`${label}にテンプレートを適用`}
      value=""
      onChange={(event) => {
        const template = filteredTemplates.find((currentTemplate) => currentTemplate.id === event.target.value);

        if (template) {
          onApply(template);
        }
      }}
      className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-bold text-blue-700 outline-none transition hover:bg-blue-50"
    >
      <option value="">テンプレート適用</option>
      {filteredTemplates.map((template) => (
        <option key={template.id} value={template.id}>
          {template.name}（{templateCategoryLabels[template.category]}）
        </option>
      ))}
    </select>
  );
}

export function AssignmentPlanManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [plans, setPlans] = useState<AssignmentPlan[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [studyBookId, setStudyBookId] = useState("");
  const [progressDays, setProgressDays] = useState("4");
  const [reviewDays, setReviewDays] = useState("2");
  const [skipRestDays, setSkipRestDays] = useState(true);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isGeneratingAiAssignments, setIsGeneratingAiAssignments] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentPlanFormValues>({
    resolver: zodResolver(assignmentPlanFormSchema),
    defaultValues: getDefaultAssignmentPlanFormValues(),
  });

  const currentFormValues = watch();
  const selectedCustomerId = watch("customerId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const dayCount = watch("dayCount");
  const days = watch("days");

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId),
    [customers, selectedCustomerId],
  );

  const customerNameMap = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer.name])),
    [customers],
  );

  const previewPlan = selectedCustomer
    ? assignmentPlanFormValuesToPlan(
        currentFormValues,
        editingPlanId ? plans.find((plan) => plan.id === editingPlanId) : undefined,
      )
    : null;

  useEffect(() => {
    const storedBooks = listBooks();

    setCustomers(listCustomers());
    setPlans(listAssignmentPlans());
    setBooks(storedBooks);
    setTemplates(listTemplates());
    setStudyBookId(storedBooks[0]?.id ?? "");
  }, []);

  useEffect(() => {
    const calculatedDayCount = calculateInclusiveDateCount(startDate, endDate);

    if (calculatedDayCount <= 0) {
      return;
    }

    const nextDayCount = String(calculatedDayCount);

    if (getValues("dayCount") !== nextDayCount) {
      setValue("dayCount", nextDayCount, { shouldDirty: true, shouldValidate: true });
    }

    setValue("days", generateAssignmentDayFormValues(startDate, calculatedDayCount, getValues("days")), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [endDate, getValues, setValue, startDate]);

  useEffect(() => {
    const parsedDayCount = Number(dayCount);

    if (!startDate || !Number.isInteger(parsedDayCount) || parsedDayCount < 1 || parsedDayCount > 31) {
      return;
    }

    const nextEndDate = addDaysToDateInputValue(startDate, parsedDayCount - 1);

    if (getValues("endDate") !== nextEndDate) {
      setValue("endDate", nextEndDate, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    setValue("days", generateAssignmentDayFormValues(startDate, parsedDayCount, getValues("days")), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [dayCount, getValues, setValue, startDate]);

  const refreshPlans = () => setPlans(listAssignmentPlans());

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find((currentCustomer) => currentCustomer.id === customerId);

    if (!customer) {
      return;
    }

    const currentTitle = getValues("title");

    if (currentTitle === "次回トレーニングまでの課題" || currentTitle.trim() === "") {
      setValue("title", createDefaultTitle(customer), { shouldDirty: true, shouldValidate: true });
    }
  };

  const handleRegenerateDays = () => {
    const parsedDayCount = Number(getValues("dayCount"));

    if (!Number.isInteger(parsedDayCount) || parsedDayCount < 1 || parsedDayCount > 31) {
      return;
    }

    setValue("days", generateAssignmentDayFormValues(getValues("startDate"), parsedDayCount, getValues("days")), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setStatusMessage("日付範囲から日別課題を再生成しました。");
  };

  const adjustDayCount = (difference: number) => {
    const currentDayCount = Number(getValues("dayCount"));
    const nextDayCount = Number.isInteger(currentDayCount) ? currentDayCount + difference : 1;
    const safeDayCount = Math.min(Math.max(nextDayCount, 1), 31);

    setValue("dayCount", String(safeDayCount), { shouldDirty: true, shouldValidate: true });
    setValue("endDate", addDaysToDateInputValue(getValues("startDate"), safeDayCount - 1), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("days", generateAssignmentDayFormValues(getValues("startDate"), safeDayCount, getValues("days")), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRestDayChange = (index: number, checked: boolean) => {
    setValue(`days.${index}.isRestDay`, checked, { shouldDirty: true, shouldValidate: true });

    if (checked) {
      setValue(`days.${index}.location`, "rest", { shouldDirty: true, shouldValidate: true });
    }
  };

  const applyTemplateToDay = (index: number, field: TemplateTargetField, template: Template) => {
    setValue(`days.${index}.${field}`, template.content, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setStatusMessage(`「${template.name}」を${index + 1}日目に反映しました。内容は手動で修正できます。`);
  };

  const handleGenerateMockAiAssignments = () => {
    const currentCustomer = customers.find((customer) => customer.id === getValues("customerId"));

    if (!currentCustomer) {
      setStatusMessage("先に顧客を選択してください。");
      return;
    }

    const currentDays = getValues("days");

    if (currentDays.length === 0) {
      setStatusMessage("先に課題期間から日別課題を生成してください。");
      return;
    }

    setValue("days", generateMockAssignmentDays({ customer: currentCustomer, days: currentDays }), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setStatusMessage("モックAIで課題案を作成しました。内容を確認し、必要に応じて手直ししてください。");
  };

  const handleGenerateAiAssignments = async () => {
    const currentCustomer = customers.find((customer) => customer.id === getValues("customerId"));

    if (!currentCustomer) {
      setStatusMessage("先に顧客を選択してください。");
      return;
    }

    const currentDays = getValues("days");

    if (currentDays.length === 0) {
      setStatusMessage("先に課題期間から日別課題を生成してください。");
      return;
    }

    const selectedBook = books.find((book) => book.id === studyBookId);
    const parsedProgressDays = Number(progressDays);
    const parsedReviewDays = Number(reviewDays);
    const studyRule: AiAssignmentGenerationRequest["studyRule"] =
      selectedBook &&
      selectedBook.chapters.length > 0 &&
      Number.isInteger(parsedProgressDays) &&
      parsedProgressDays > 0 &&
      Number.isInteger(parsedReviewDays) &&
      parsedReviewDays >= 0
        ? {
            bookTitle: selectedBook.title,
            progressDays: parsedProgressDays,
            reviewDays: parsedReviewDays,
            skipRestDays,
            sections: selectedBook.chapters.map((chapter) => ({
              chapter: chapter.chapter,
              label: chapter.label,
              pageRange: chapter.pageRange,
              order: chapter.order,
            })),
          }
        : null;

    const requestBody: AiAssignmentGenerationRequest = {
      customer: currentCustomer,
      assignmentPeriod: {
        startDate: getValues("startDate"),
        endDate: getValues("endDate"),
        dayCount: currentDays.length,
      },
      days: currentDays,
      studyRule,
    };

    setIsGeneratingAiAssignments(true);
    setStatusMessage("AIで課題案を生成中です...");

    try {
      const response = await fetch("/api/generate-assignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const responseBody = (await response.json().catch(() => null)) as unknown;

      if (!response.ok) {
        const message =
          typeof responseBody === "object" &&
          responseBody !== null &&
          "error" in responseBody &&
          typeof responseBody.error === "string"
            ? responseBody.error
            : "AI生成に失敗しました。もう一度再生成してください。";

        setStatusMessage(message);
        return;
      }

      const parsedResponse = aiAssignmentGenerationResponseSchema.safeParse(responseBody);

      if (!parsedResponse.success) {
        setStatusMessage("AI生成結果の形式が不正です。もう一度再生成してください。");
        return;
      }

      setValue("days", parsedResponse.data.days, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setStatusMessage(
        parsedResponse.data.source === "mock"
          ? "OPENAI_API_KEYが未設定のため、モックAIで課題案を作成しました。内容を確認し、必要に応じて手直ししてください。"
          : "OpenAI APIで課題案を作成しました。内容を確認し、必要に応じて手直ししてください。",
      );
    } catch (error) {
      console.error(error);
      setStatusMessage(
        "AI生成APIに接続できませんでした。入力内容や通信状態を確認して再生成するか、「モックで作成」を押してください。",
      );
    } finally {
      setIsGeneratingAiAssignments(false);
    }
  };

  const handleAssignStudyTasks = () => {
    const selectedBook = books.find((book) => book.id === studyBookId);

    if (!selectedBook) {
      setStatusMessage("先に書籍管理で書籍を登録し、割り当てる書籍を選択してください。");
      return;
    }

    if (selectedBook.chapters.length === 0) {
      setStatusMessage("選択した書籍に学習セクションがありません。書籍管理でセクションを登録してください。");
      return;
    }

    const parsedProgressDays = Number(progressDays);
    const parsedReviewDays = Number(reviewDays);

    if (!Number.isInteger(parsedProgressDays) || parsedProgressDays < 1) {
      setStatusMessage("進む日数は1以上の整数で入力してください。");
      return;
    }

    if (!Number.isInteger(parsedReviewDays) || parsedReviewDays < 0) {
      setStatusMessage("復習日数は0以上の整数で入力してください。");
      return;
    }

    setValue(
      "days",
      assignStudyTasksToDays(getValues("days"), selectedBook, {
        progressDays: parsedProgressDays,
        reviewDays: parsedReviewDays,
        skipRestDays,
      }),
      { shouldDirty: true, shouldValidate: true },
    );
    setStatusMessage("書籍学習課題を日別課題に自動割り当てしました。必要に応じて各日の学習課題を手動修正できます。");
  };

  const handleLoadPlan = (plan: AssignmentPlan) => {
    setEditingPlanId(plan.id);
    reset(assignmentPlanToFormValues(plan));
    setStatusMessage("保存済み課題プランを読み込みました。");
  };

  const handleNewPlan = () => {
    setEditingPlanId(null);
    reset(getDefaultAssignmentPlanFormValues());
    setStatusMessage(null);
  };

  const onSubmit = (values: AssignmentPlanFormValues) => {
    const currentPlan = editingPlanId ? findAssignmentPlanById(editingPlanId) : undefined;
    const plan = assignmentPlanFormValuesToPlan(values, currentPlan);

    saveAssignmentPlan(plan);
    setEditingPlanId(plan.id);
    refreshPlans();
    setStatusMessage("課題プランをlocalStorageに保存しました。");
  };

  return (
    <>
      <PageHeader
        title="課題作成"
        description="顧客を選び、課題期間と日別課題の土台を作成します。日付範囲から曜日付きの日別課題を自動生成し、localStorageに保存します。"
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">課題プラン基本情報</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  {editingPlanId ? "課題プランを編集中" : "新しい課題プランを作成"}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleNewPlan}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                新規作成に戻す
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">
                  顧客<span className="ml-1 text-rose-500">*</span>
                </span>
                <select
                  {...register("customerId", {
                    onChange: (event) => handleCustomerChange(event.target.value),
                  })}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">顧客を選択してください</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} / 目標: {customer.goal}
                    </option>
                  ))}
                </select>
                {errors.customerId?.message ? (
                  <span className="text-sm font-medium text-rose-600">{errors.customerId.message}</span>
                ) : null}
                {customers.length === 0 ? (
                  <span className="text-sm text-amber-700">先に顧客管理で顧客を登録してください。</span>
                ) : null}
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">
                  PDFタイトル<span className="ml-1 text-rose-500">*</span>
                </span>
                <input
                  {...register("title")}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
                {errors.title?.message ? (
                  <span className="text-sm font-medium text-rose-600">{errors.title.message}</span>
                ) : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">課題開始日*</span>
                <input
                  type="date"
                  {...register("startDate")}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
                {errors.startDate?.message ? (
                  <span className="text-sm font-medium text-rose-600">{errors.startDate.message}</span>
                ) : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">課題終了日*</span>
                <input
                  type="date"
                  {...register("endDate")}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
                {errors.endDate?.message ? (
                  <span className="text-sm font-medium text-rose-600">{errors.endDate.message}</span>
                ) : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">パーソナルトレーニング実施日</span>
                <input
                  type="date"
                  {...register("personalTrainingDate")}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">次回パーソナルトレーニング日</span>
                <input
                  type="date"
                  {...register("nextTrainingDate")}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">課題日数</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => adjustDayCount(-1)}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    −
                  </button>
                  <input
                    inputMode="numeric"
                    {...register("dayCount")}
                    className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => adjustDayCount(1)}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    ＋
                  </button>
                  <button
                    type="button"
                    onClick={handleRegenerateDays}
                    className="rounded-2xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                  >
                    生成
                  </button>
                </div>
                <span className="text-xs text-slate-500">日付範囲から自動計算されます。必要に応じて手動変更できます。</span>
                {errors.dayCount?.message ? (
                  <span className="text-sm font-medium text-rose-600">{errors.dayCount.message}</span>
                ) : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">PDF出力モード</span>
                <select
                  {...register("pdfMode")}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  {pdfModeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">トレーナーからのメッセージ</span>
                <textarea
                  rows={4}
                  {...register("trainerMessage")}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>
          </div>

          <section className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-700">AI課題提案</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">顧客情報から課題案を作成</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  サーバー側のAPI RouteでOpenAI APIへ接続し、OPENAI_API_KEY未設定時は既存のモック生成にフォールバックします。失敗時は再生成またはモック作成を選べます。
                </p>
                <p className="mt-2 text-xs font-semibold text-indigo-900">
                  安全のため、痛みが出たら中止し、不安があればトレーナーに相談する注意文を自動で入れます。
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                <button
                  type="button"
                  onClick={handleGenerateAiAssignments}
                  disabled={!selectedCustomerId || days.length === 0 || isGeneratingAiAssignments}
                  className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                >
                  {isGeneratingAiAssignments ? "生成中..." : "AIで課題案を作成"}
                </button>
                <button
                  type="button"
                  onClick={handleGenerateMockAiAssignments}
                  disabled={!selectedCustomerId || days.length === 0 || isGeneratingAiAssignments}
                  className="rounded-full border border-indigo-200 bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:text-indigo-300"
                >
                  モックで作成
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">書籍学習課題の自動割り当て</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">4日進む・2日復習に対応</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  書籍本文は扱わず、書籍名・章・読む範囲・ページ範囲だけを日別の学習課題へ入れます。
                </p>
              </div>
              <button
                type="button"
                onClick={handleAssignStudyTasks}
                className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                disabled={books.length === 0}
              >
                学習課題を自動割り当て
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">割り当てる書籍</span>
                <select
                  value={studyBookId}
                  onChange={(event) => setStudyBookId(event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">書籍を選択してください</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} / {book.chapters.length}セクション
                    </option>
                  ))}
                </select>
                {books.length === 0 ? (
                  <span className="text-sm text-amber-700">先に書籍管理で書籍と学習セクションを登録してください。</span>
                ) : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">進む日数</span>
                <input
                  inputMode="numeric"
                  value={progressDays}
                  onChange={(event) => setProgressDays(event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">復習日数</span>
                <input
                  inputMode="numeric"
                  value={reviewDays}
                  onChange={(event) => setReviewDays(event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>

            <label className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={skipRestDays}
                onChange={(event) => setSkipRestDays(event.target.checked)}
              />
              休養日は学習を飛ばす
            </label>
          </section>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">日別課題編集</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">1日ごとに課題を編集</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  各日のトレーニング、有酸素、ストレッチ・ケア、食事、睡眠、記録、学習課題をカード形式で編集できます。
                </p>
              </div>
              <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                {days.length}日分
              </p>
            </div>

            {errors.days?.message ? (
              <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {errors.days.message}
              </p>
            ) : null}

            <div className="mt-6 grid gap-5">
              {days.map((day, index) => {
                const isRestDay = day.isRestDay || day.location === "rest";

                return (
                  <article
                    key={day.id}
                    className={`rounded-3xl border p-5 shadow-sm transition ${
                      isRestDay ? "border-amber-200 bg-amber-50/80" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <input type="hidden" {...register(`days.${index}.id`)} />

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-600">{index + 1}日目</p>
                        <h3 className="mt-1 text-xl font-bold text-slate-950">
                          {day.date || "日付未入力"}（{day.dayOfWeek || "曜日"}）
                        </h3>
                        {isRestDay ? (
                          <p className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                            休養日モード
                          </p>
                        ) : null}
                      </div>

                      <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          {...register(`days.${index}.isRestDay`, {
                            onChange: (event) => handleRestDayChange(index, event.target.checked),
                          })}
                        />
                        休養日にする
                      </label>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-4">
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-slate-700">日付</span>
                        <input
                          type="date"
                          {...register(`days.${index}.date`, {
                            onChange: (event) => {
                              setValue(`days.${index}.dayOfWeek`, getJapaneseDayOfWeek(event.target.value), {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            },
                          })}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        />
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-slate-700">曜日</span>
                        <input
                          placeholder="例: 月"
                          {...register(`days.${index}.dayOfWeek`)}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        />
                      </label>

                      <label className="flex flex-col gap-2 md:col-span-2">
                        <span className="text-sm font-semibold text-slate-700">実施場所</span>
                        <select
                          {...register(`days.${index}.location`, {
                            onChange: (event) => {
                              if (event.target.value === "rest") {
                                setValue(`days.${index}.isRestDay`, true, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });
                              }
                            },
                          })}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        >
                          {assignmentLocationOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                      <label className={`flex flex-col gap-2 ${isRestDay ? "opacity-60" : ""}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-700">トレーニング課題（複数行）</span>
                          <TemplateApplySelect
                            label="トレーニング課題"
                            templates={templates}
                            categories={["home_training", "gym_training"]}
                            onApply={(template) => applyTemplateToDay(index, "trainingTasksText", template)}
                          />
                        </div>
                        <textarea
                          rows={7}
                          placeholder={[
                            "スクワット 10回 × 3セット",
                            "プッシュアップ 8回 × 3セット",
                            "ヒップリフト 15回 × 3セット",
                          ].join("\n")}
                          {...register(`days.${index}.trainingTasksText`)}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        />
                        {isRestDay ? (
                          <span className="text-xs font-semibold text-amber-700">
                            休養日はトレーニングを空欄にするか、軽い散歩・ケアだけにしてください。
                          </span>
                        ) : null}
                      </label>

                      <div className="grid gap-4">
                        <label className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-slate-700">有酸素課題</span>
                            <TemplateApplySelect
                              label="有酸素課題"
                              templates={templates}
                              categories={["cardio"]}
                              onApply={(template) => applyTemplateToDay(index, "cardioTask", template)}
                            />
                          </div>
                          <input
                            placeholder="例: 20分ウォーキング"
                            {...register(`days.${index}.cardioTask`)}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-slate-700">ストレッチ・ケア課題</span>
                            <TemplateApplySelect
                              label="ストレッチ・ケア課題"
                              templates={templates}
                              categories={["mobility"]}
                              onApply={(template) => applyTemplateToDay(index, "mobilityTask", template)}
                            />
                          </div>
                          <input
                            placeholder="例: 股関節ストレッチ 5分"
                            {...register(`days.${index}.mobilityTask`)}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-slate-700">チェック項目（複数行）</span>
                            <TemplateApplySelect
                              label="チェック項目"
                              templates={templates}
                              categories={["habit", "other"]}
                              onApply={(template) => applyTemplateToDay(index, "checkItemsText", template)}
                            />
                          </div>
                          <textarea
                            rows={3}
                            placeholder={["トレーニング完了", "水分1.5L", "体重記録"].join("\n")}
                            {...register(`days.${index}.checkItemsText`)}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <label className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-700">食事課題</span>
                          <TemplateApplySelect
                            label="食事課題"
                            templates={templates}
                            categories={["meal"]}
                            onApply={(template) => applyTemplateToDay(index, "mealTask", template)}
                          />
                        </div>
                        <input
                          placeholder="例: 毎食たんぱく質を1品入れる"
                          {...register(`days.${index}.mealTask`)}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-700">睡眠課題</span>
                          <TemplateApplySelect
                            label="睡眠課題"
                            templates={templates}
                            categories={["sleep"]}
                            onApply={(template) => applyTemplateToDay(index, "sleepTask", template)}
                          />
                        </div>
                        <input
                          placeholder="例: 23:30までに布団に入る"
                          {...register(`days.${index}.sleepTask`)}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-700">体重記録課題</span>
                          <TemplateApplySelect
                            label="体重記録課題"
                            templates={templates}
                            categories={["weight_log"]}
                            onApply={(template) => applyTemplateToDay(index, "weightLogTask", template)}
                          />
                        </div>
                        <input
                          placeholder="例: 起床後トイレ後に体重を測る"
                          {...register(`days.${index}.weightLogTask`)}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-700">水分摂取課題</span>
                          <TemplateApplySelect
                            label="水分摂取課題"
                            templates={templates}
                            categories={["water"]}
                            onApply={(template) => applyTemplateToDay(index, "waterTask", template)}
                          />
                        </div>
                        <input
                          placeholder="例: 水を1.5L飲む"
                          {...register(`days.${index}.waterTask`)}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-700">習慣課題</span>
                          <TemplateApplySelect
                            label="習慣課題"
                            templates={templates}
                            categories={["habit"]}
                            onApply={(template) => applyTemplateToDay(index, "habitTask", template)}
                          />
                        </div>
                        <input
                          placeholder="例: 就寝前に明日の予定を確認する"
                          {...register(`days.${index}.habitTask`)}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-700">学習課題</span>
                          <TemplateApplySelect
                            label="学習課題"
                            templates={templates}
                            categories={["study"]}
                            onApply={(template) => applyTemplateToDay(index, "studyTask", template)}
                          />
                        </div>
                        <input
                          placeholder="例: 指定ページを10分読む"
                          {...register(`days.${index}.studyTask`)}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        />
                      </label>
                    </div>

                    <label className="mt-5 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-700">メモ</span>
                        <TemplateApplySelect
                          label="メモ"
                          templates={templates}
                          categories={["message", "other"]}
                          onApply={(template) => applyTemplateToDay(index, "memo", template)}
                        />
                      </div>
                      <textarea
                        rows={3}
                        placeholder="例: 移動が多い日なのでストレッチ中心"
                        {...register(`days.${index}.memo`)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      />
                    </label>
                  </article>
                );
              })}
            </div>
          </div>

          {previewPlan && selectedCustomer ? (
            <PdfPreviewPanel plan={previewPlan} customer={selectedCustomer} />
          ) : (
            <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center">
              <h2 className="text-xl font-bold text-slate-950">PDFプレビュー</h2>
              <p className="mt-2 text-sm text-slate-500">顧客を選択すると、課題プランのPDFプレビューとダウンロードが使えます。</p>
            </section>
          )}

          {statusMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {statusMessage}
            </div>
          ) : null}

          <div className="sticky bottom-4 flex justify-end rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <button
              type="submit"
              disabled={isSubmitting || customers.length === 0}
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              課題プランを保存
            </button>
          </div>
        </form>

        <aside className="flex flex-col gap-6">
          <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6 text-sm leading-7 text-blue-950">
            <h2 className="text-lg font-bold">作成中の概要</h2>
            <dl className="mt-4 grid gap-3">
              <div>
                <dt className="font-semibold">顧客</dt>
                <dd>{selectedCustomer?.name ?? "未選択"}</dd>
              </div>
              <div>
                <dt className="font-semibold">期間</dt>
                <dd>
                  {startDate || "未入力"} 〜 {endDate || "未入力"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">課題日数</dt>
                <dd>{dayCount || "未入力"}日</dd>
              </div>
              <div>
                <dt className="font-semibold">PDFモード</dt>
                <dd>{pdfModeLabelMap[watch("pdfMode")]}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">保存済み課題プラン</h2>
            {plans.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-slate-500">保存済みの課題プランはまだありません。</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => handleLoadPlan(plan)}
                    className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <span className="block text-sm font-bold text-slate-950">{plan.title}</span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {customerNameMap.get(plan.customerId) ?? "顧客不明"} / {plan.startDate}〜{plan.endDate} / {plan.days.length}日
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">場所ラベル</h2>
            <ul className="mt-3 grid gap-2 text-sm text-slate-600">
              {assignmentLocationOptions.map((option) => (
                <li key={option.value}>
                  {option.label}: {locationLabelMap[option.value]}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>
    </>
  );
}
