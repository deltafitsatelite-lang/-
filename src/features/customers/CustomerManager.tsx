"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/PageHeader";
import {
  findCustomerById,
  listCustomers,
  removeCustomer,
  saveCustomer,
} from "@/lib/storage";
import type { ActivityLevel, Customer, Gender } from "@/types";
import {
  activityLevelOptions,
  customerFormSchema,
  customerToFormValues,
  emptyCustomerFormValues,
  formValuesToCustomer,
  genderOptions,
  gymEquipmentOptions,
  homeEquipmentOptions,
  type CustomerFormValues,
} from "./customerForm";

const genderLabelMap: Record<Gender, string> = {
  male: "男性",
  female: "女性",
  other: "その他",
  no_answer: "未回答",
};

const activityLevelLabelMap: Record<ActivityLevel, string> = {
  low: "低い",
  medium: "普通",
  high: "高い",
};

type TextInputProps = {
  label: string;
  error?: string;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = {
  label: string;
  error?: string;
  required?: boolean;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

type SelectProps = {
  label: string;
  error?: string;
  children?: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

function TextInput({ label, error, required = false, ...props }: TextInputProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </span>
      <input
        {...props}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
      {error ? <span className="text-sm font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

function Textarea({ label, error, required = false, ...props }: TextareaProps) {
  return (
    <label className="flex flex-col gap-2 md:col-span-2">
      <span className="text-sm font-semibold text-slate-700">
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </span>
      <textarea
        {...props}
        rows={props.rows ?? 3}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
      {error ? <span className="text-sm font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

function Select({ label, error, children, ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        {...props}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      >
        {children}
      </select>
      {error ? <span className="text-sm font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function CustomerManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const editingCustomer = useMemo(
    () => customers.find((customer) => customer.id === editingCustomerId),
    [customers, editingCustomerId],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: emptyCustomerFormValues,
  });

  useEffect(() => {
    setCustomers(listCustomers());
  }, []);

  const refreshCustomers = () => setCustomers(listCustomers());

  const openCreateForm = () => {
    setEditingCustomerId(null);
    reset(emptyCustomerFormValues);
    setStatusMessage(null);
    setIsFormOpen(true);
  };

  const openEditForm = (customer: Customer) => {
    setEditingCustomerId(customer.id);
    reset(customerToFormValues(customer));
    setStatusMessage(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingCustomerId(null);
    reset(emptyCustomerFormValues);
    setIsFormOpen(false);
  };

  const onSubmit = (values: CustomerFormValues) => {
    const currentCustomer = editingCustomerId ? findCustomerById(editingCustomerId) : undefined;
    const customer = formValuesToCustomer(values, currentCustomer);

    saveCustomer(customer);
    refreshCustomers();
    setStatusMessage(editingCustomerId ? "顧客情報を更新しました。" : "顧客を追加しました。");
    closeForm();
  };

  const handleDelete = (customer: Customer) => {
    const confirmed = window.confirm(`${customer.name}さんの顧客情報を削除します。よろしいですか？`);

    if (!confirmed) {
      return;
    }

    removeCustomer(customer.id);
    refreshCustomers();

    if (editingCustomerId === customer.id) {
      closeForm();
    }

    setStatusMessage("顧客を削除しました。");
  };

  return (
    <>
      <PageHeader
        title="顧客管理"
        description="顧客の基本情報、生活習慣、トレーニング条件、トレーナーメモをlocalStorageに保存します。必須項目は顧客名と目標のみです。"
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">顧客一覧</h2>
              <p className="mt-1 text-sm text-slate-500">
                登録数: <span className="font-semibold text-slate-900">{customers.length}</span> 名
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateForm}
              className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              ＋ 顧客を追加
            </button>
          </div>

          {statusMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {statusMessage}
            </div>
          ) : null}

          {customers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <h3 className="text-xl font-bold text-slate-950">顧客データはまだありません</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                「顧客を追加」から、まずは顧客名と目標だけ入力して保存できます。
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {customers.map((customer) => (
                <article
                  key={customer.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-950">{customer.name}</h3>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {genderLabelMap[customer.gender]}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        <span className="font-semibold text-slate-800">目標:</span> {customer.goal}
                      </p>
                      <div className="mt-3 grid gap-2 text-sm text-slate-500 sm:grid-cols-3">
                        <span>年齢: {customer.age ?? "未入力"}</span>
                        <span>身長: {customer.height === null ? "未入力" : `${customer.height}cm`}</span>
                        <span>
                          現在体重: {customer.currentWeight === null ? "未入力" : `${customer.currentWeight}kg`}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        平日活動量: {activityLevelLabelMap[customer.weekdayActivityLevel]} / 休日活動量:{" "}
                        {activityLevelLabelMap[customer.weekendActivityLevel]}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(customer)}
                        className="rounded-full border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(customer)}
                        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-blue-100 bg-blue-50 p-6 text-sm leading-7 text-blue-950 lg:sticky lg:top-6 lg:self-start">
          <h2 className="text-lg font-bold">入力のコツ</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>最初は顧客名と目標だけで保存できます。</li>
            <li>生活習慣は分かる範囲で追記してください。</li>
            <li>怪我や痛みは課題作成時の安全性に関わるため、優先して記録してください。</li>
          </ul>
        </aside>
      </section>

      {isFormOpen ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                {editingCustomer ? "顧客情報を編集中" : "新規顧客を追加"}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                {editingCustomer ? `${editingCustomer.name}さん` : "顧客プロフィール"}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              閉じる
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormSection title="基本情報" description="顧客名と目標のみ必須です。ほかは分かる範囲で入力します。">
              <TextInput label="顧客名" required error={errors.name?.message} {...register("name")} />
              <Select label="性別" error={errors.gender?.message} {...register("gender")}>
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <TextInput label="年齢" inputMode="decimal" error={errors.age?.message} {...register("age")} />
              <TextInput label="身長（cm）" inputMode="decimal" error={errors.height?.message} {...register("height")} />
              <TextInput
                label="現在体重（kg）"
                inputMode="decimal"
                error={errors.currentWeight?.message}
                {...register("currentWeight")}
              />
              <TextInput
                label="目標体重（kg）"
                inputMode="decimal"
                error={errors.targetWeight?.message}
                {...register("targetWeight")}
              />
              <Textarea
                label="現在の体型・悩み"
                placeholder="例: 下腹部が気になる、肩こりがある"
                error={errors.bodyConcerns?.message}
                {...register("bodyConcerns")}
              />
              <Textarea
                label="目標"
                required
                placeholder="例: 3か月で体脂肪を落とし、疲れにくい身体を作りたい"
                error={errors.goal?.message}
                {...register("goal")}
              />
              <Textarea label="トレーニング歴" error={errors.trainingHistory?.message} {...register("trainingHistory")} />
              <Textarea label="運動頻度" error={errors.exerciseFrequency?.message} {...register("exerciseFrequency")} />
            </FormSection>

            <FormSection title="生活習慣" description="睡眠・食事・活動量を記録して、課題提案に使いやすくします。">
              <Textarea label="仕事・生活スタイル" error={errors.lifestyle?.message} {...register("lifestyle")} />
              <TextInput
                label="睡眠時間（時間）"
                inputMode="decimal"
                error={errors.sleepHours?.message}
                {...register("sleepHours")}
              />
              <TextInput label="起床時間" placeholder="例: 7:00" error={errors.wakeUpTime?.message} {...register("wakeUpTime")} />
              <TextInput label="就寝時間" placeholder="例: 23:30" error={errors.bedTime?.message} {...register("bedTime")} />
              <Textarea label="食事習慣" error={errors.eatingHabits?.message} {...register("eatingHabits")} />
              <TextInput
                label="食事回数（回/日）"
                inputMode="decimal"
                error={errors.mealsPerDay?.message}
                {...register("mealsPerDay")}
              />
              <TextInput label="外食頻度" error={errors.eatingOutFrequency?.message} {...register("eatingOutFrequency")} />
              <TextInput label="飲酒頻度" error={errors.alcoholFrequency?.message} {...register("alcoholFrequency")} />
              <Textarea label="間食習慣" error={errors.snackHabit?.message} {...register("snackHabit")} />
              <TextInput
                label="水分摂取量（L/日）"
                inputMode="decimal"
                error={errors.waterIntake?.message}
                {...register("waterIntake")}
              />
              <Select
                label="平日の活動量"
                error={errors.weekdayActivityLevel?.message}
                {...register("weekdayActivityLevel")}
              >
                {activityLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select
                label="休日の活動量"
                error={errors.weekendActivityLevel?.message}
                {...register("weekendActivityLevel")}
              >
                {activityLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormSection>

            <FormSection title="トレーニング条件" description="使える器具や注意点を記録し、安全な課題作成につなげます。">
              <fieldset className="rounded-2xl border border-slate-200 bg-white p-4">
                <legend className="px-1 text-sm font-semibold text-slate-700">自宅で使える器具</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {homeEquipmentOptions.map((equipment) => (
                    <label key={equipment} className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" value={equipment} {...register("homeEquipment")} />
                      {equipment}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="rounded-2xl border border-slate-200 bg-white p-4">
                <legend className="px-1 text-sm font-semibold text-slate-700">ジムで使える器具</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {gymEquipmentOptions.map((equipment) => (
                    <label key={equipment} className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" value={equipment} {...register("gymEquipment")} />
                      {equipment}
                    </label>
                  ))}
                </div>
              </fieldset>
              <Textarea label="怪我・痛み・注意点" error={errors.injuries?.message} {...register("injuries")} />
              <Textarea label="苦手な種目" error={errors.dislikedExercises?.message} {...register("dislikedExercises")} />
              <Textarea label="好きな種目" error={errors.likedExercises?.message} {...register("likedExercises")} />
            </FormSection>

            <FormSection title="その他" description="現在困っていることや、今後改善したい習慣をメモします。">
              <Textarea label="現在の課題" error={errors.currentChallenges?.message} {...register("currentChallenges")} />
              <Textarea label="改善したい習慣" error={errors.habitsToImprove?.message} {...register("habitsToImprove")} />
              <Textarea label="トレーナーメモ" rows={4} error={errors.trainerNotes?.message} {...register("trainerNotes")} />
            </FormSection>

            <div className="sticky bottom-4 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {editingCustomer ? "更新する" : "保存する"}
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </>
  );
}
