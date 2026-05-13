import { z } from "zod";
import { addDaysToDateInputValue, calculateInclusiveDateCount, getJapaneseDayOfWeek } from "@/lib/dates";
import type { AssignmentDay, AssignmentLocation, AssignmentPlan, Customer, PdfMode } from "@/types";

export const assignmentLocationOptions = [
  { value: "home", label: "自宅" },
  { value: "gym", label: "フィットネスジム" },
  { value: "rest", label: "休養" },
  { value: "other", label: "任意" },
] as const satisfies ReadonlyArray<{ value: AssignmentLocation; label: string }>;

export const pdfModeOptions = [
  { value: "single_page", label: "基本1枚" },
  { value: "two_pages", label: "読みやすさ優先で2枚まで許可" },
] as const satisfies ReadonlyArray<{ value: PdfMode; label: string }>;

const optionalDateSchema = z.string().trim();

const dateSchema = z.string().trim().min(1, "日付を入力してください");
const shortTextSchema = z.string().trim();
const multiLineTextSchema = z.string().trim();

const dayCountSchema = z
  .string()
  .trim()
  .min(1, "課題日数を入力してください")
  .refine((value: string) => Number.isInteger(Number(value)), {
    message: "課題日数は整数で入力してください",
  })
  .refine((value: string) => Number(value) >= 1, {
    message: "課題日数は1日以上で入力してください",
  })
  .refine((value: string) => Number(value) <= 31, {
    message: "MVPでは31日以内で入力してください",
  });

export const assignmentDayFormSchema = z.object({
  id: z.string().min(1),
  date: dateSchema,
  dayOfWeek: z.string().min(1, "曜日を入力してください"),
  location: z.enum(["home", "gym", "outdoor", "rest", "other"]),
  trainingTasksText: multiLineTextSchema,
  cardioTask: shortTextSchema,
  mobilityTask: shortTextSchema,
  mealTask: shortTextSchema,
  sleepTask: shortTextSchema,
  weightLogTask: shortTextSchema,
  waterTask: shortTextSchema,
  habitTask: shortTextSchema,
  studyTask: shortTextSchema,
  memo: multiLineTextSchema,
  isRestDay: z.boolean(),
  checkItemsText: multiLineTextSchema,
});

export const assignmentPlanFormSchema = z
  .object({
    customerId: z.string().min(1, "顧客を選択してください"),
    title: z.string().trim().min(1, "PDFタイトルを入力してください"),
    startDate: dateSchema,
    endDate: dateSchema,
    personalTrainingDate: optionalDateSchema,
    nextTrainingDate: optionalDateSchema,
    dayCount: dayCountSchema,
    trainerMessage: z.string().trim(),
    pdfMode: z.enum(["single_page", "two_pages"]),
    days: z.array(assignmentDayFormSchema).min(1, "日別課題を生成してください"),
  })
  .refine((values) => calculateInclusiveDateCount(values.startDate, values.endDate) > 0, {
    path: ["endDate"],
    message: "終了日は開始日以降にしてください",
  });

export type AssignmentDayFormValues = z.infer<typeof assignmentDayFormSchema>;
export type AssignmentPlanFormValues = z.infer<typeof assignmentPlanFormSchema>;

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const joinLines = (values: string[]) => values.join("\n");

export const getDefaultAssignmentPlanFormValues = (): AssignmentPlanFormValues => {
  const today = new Date();
  const startDate = today.toISOString().slice(0, 10);
  const endDate = addDaysToDateInputValue(startDate, 6);

  return {
    customerId: "",
    title: "次回トレーニングまでの課題",
    startDate,
    endDate,
    personalTrainingDate: "",
    nextTrainingDate: "",
    dayCount: "7",
    trainerMessage: "次回まで無理のない範囲で取り組みましょう。痛みがある場合は中止してください。",
    pdfMode: "single_page",
    days: generateAssignmentDayFormValues(startDate, 7),
  };
};

export function generateAssignmentDayFormValues(
  startDate: string,
  dayCount: number,
  existingDays: AssignmentDayFormValues[] = [],
): AssignmentDayFormValues[] {
  if (!startDate || dayCount < 1) {
    return [];
  }

  return Array.from({ length: dayCount }, (_, index) => {
    const date = addDaysToDateInputValue(startDate, index);
    const existingDayWithSameDate = existingDays.find((day) => day.date === date);
    const existingDay = existingDayWithSameDate ?? existingDays[index];

    return {
      id: existingDay?.id ?? createId(),
      date,
      dayOfWeek: existingDayWithSameDate?.dayOfWeek ?? getJapaneseDayOfWeek(date),
      location: existingDay?.location ?? "home",
      trainingTasksText: existingDay?.trainingTasksText ?? "",
      cardioTask: existingDay?.cardioTask ?? "",
      mobilityTask: existingDay?.mobilityTask ?? "",
      mealTask: existingDay?.mealTask ?? "",
      sleepTask: existingDay?.sleepTask ?? "",
      weightLogTask: existingDay?.weightLogTask ?? "",
      waterTask: existingDay?.waterTask ?? "",
      habitTask: existingDay?.habitTask ?? "",
      studyTask: existingDay?.studyTask ?? "",
      memo: existingDay?.memo ?? "",
      isRestDay: existingDay?.isRestDay ?? false,
      checkItemsText: existingDay?.checkItemsText ?? "",
    };
  });
}

export function assignmentPlanFormValuesToPlan(
  values: AssignmentPlanFormValues,
  currentPlan?: AssignmentPlan,
): AssignmentPlan {
  const now = new Date().toISOString();

  return {
    id: currentPlan?.id ?? createId(),
    customerId: values.customerId,
    title: values.title,
    startDate: values.startDate,
    endDate: values.endDate,
    personalTrainingDate: values.personalTrainingDate || null,
    nextTrainingDate: values.nextTrainingDate || null,
    trainerMessage: values.trainerMessage,
    pdfMode: values.pdfMode,
    days: values.days.map((day): AssignmentDay => {
      const isRestDay = day.isRestDay || day.location === "rest";

      return {
        id: day.id,
        date: day.date,
        dayOfWeek: day.dayOfWeek,
        location: isRestDay ? "rest" : day.location,
        trainingTasks: splitLines(day.trainingTasksText),
        cardioTask: day.cardioTask,
        mobilityTask: day.mobilityTask,
        mealTask: day.mealTask,
        sleepTask: day.sleepTask,
        weightLogTask: day.weightLogTask,
        waterTask: day.waterTask,
        habitTask: day.habitTask,
        studyTask: day.studyTask,
        memo: day.memo,
        isRestDay,
        checkItems: splitLines(day.checkItemsText),
      };
    }),
    createdAt: currentPlan?.createdAt ?? now,
    updatedAt: now,
  };
}

export function assignmentPlanToFormValues(plan: AssignmentPlan): AssignmentPlanFormValues {
  return {
    customerId: plan.customerId,
    title: plan.title,
    startDate: plan.startDate,
    endDate: plan.endDate,
    personalTrainingDate: plan.personalTrainingDate ?? "",
    nextTrainingDate: plan.nextTrainingDate ?? "",
    dayCount: String(plan.days.length),
    trainerMessage: plan.trainerMessage,
    pdfMode: plan.pdfMode,
    days: plan.days.map((day) => ({
      id: day.id,
      date: day.date,
      dayOfWeek: day.dayOfWeek,
      location: day.location,
      trainingTasksText: joinLines(day.trainingTasks),
      cardioTask: day.cardioTask,
      mobilityTask: day.mobilityTask,
      mealTask: day.mealTask,
      sleepTask: day.sleepTask,
      weightLogTask: day.weightLogTask,
      waterTask: day.waterTask,
      habitTask: day.habitTask,
      studyTask: day.studyTask,
      memo: day.memo,
      isRestDay: day.isRestDay,
      checkItemsText: joinLines(day.checkItems),
    })),
  };
}

export function createDefaultTitle(customer?: Customer) {
  if (!customer) {
    return "次回トレーニングまでの課題";
  }

  return `${customer.name}さん 次回トレーニングまでの課題`;
}
