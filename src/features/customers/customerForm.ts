import { z } from "zod";
import type { ActivityLevel, Customer, Gender } from "@/types";

export const genderOptions = [
  { value: "no_answer", label: "未回答" },
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
  { value: "other", label: "その他" },
] as const satisfies ReadonlyArray<{ value: Gender; label: string }>;

export const activityLevelOptions = [
  { value: "low", label: "低い" },
  { value: "medium", label: "普通" },
  { value: "high", label: "高い" },
] as const satisfies ReadonlyArray<{ value: ActivityLevel; label: string }>;

export const homeEquipmentOptions = [
  "なし",
  "ヨガマット",
  "ダンベル",
  "チューブ",
  "フォームローラー",
  "バランスボール",
] as const;

export const gymEquipmentOptions = [
  "マシン",
  "フリーウェイト",
  "ケーブル",
  "有酸素マシン",
  "ストレッチエリア",
  "プール",
] as const;

const optionalNumberTextSchema = z
  .string()
  .trim()
  .refine((value: string) => value === "" || !Number.isNaN(Number(value)), {
    message: "数値で入力してください",
  })
  .refine((value: string) => value === "" || Number(value) >= 0, {
    message: "0以上の数値で入力してください",
  });

const optionalTextSchema = z.string().trim();

export const customerFormSchema = z.object({
  name: optionalTextSchema.min(1, "顧客名は必須です"),
  age: optionalNumberTextSchema,
  gender: z.enum(["male", "female", "other", "no_answer"]),
  height: optionalNumberTextSchema,
  currentWeight: optionalNumberTextSchema,
  targetWeight: optionalNumberTextSchema,
  bodyConcerns: optionalTextSchema,
  goal: optionalTextSchema.min(1, "目標は必須です"),
  trainingHistory: optionalTextSchema,
  exerciseFrequency: optionalTextSchema,
  lifestyle: optionalTextSchema,
  sleepHours: optionalNumberTextSchema,
  eatingHabits: optionalTextSchema,
  alcoholFrequency: optionalTextSchema,
  snackHabit: optionalTextSchema,
  wakeUpTime: optionalTextSchema,
  bedTime: optionalTextSchema,
  weekdayActivityLevel: z.enum(["low", "medium", "high"]),
  weekendActivityLevel: z.enum(["low", "medium", "high"]),
  mealsPerDay: optionalNumberTextSchema,
  eatingOutFrequency: optionalTextSchema,
  waterIntake: optionalNumberTextSchema,
  homeEquipment: z.array(z.string()),
  gymEquipment: z.array(z.string()),
  injuries: optionalTextSchema,
  dislikedExercises: optionalTextSchema,
  likedExercises: optionalTextSchema,
  currentChallenges: optionalTextSchema,
  habitsToImprove: optionalTextSchema,
  trainerNotes: optionalTextSchema,
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export const emptyCustomerFormValues: CustomerFormValues = {
  name: "",
  age: "",
  gender: "no_answer",
  height: "",
  currentWeight: "",
  targetWeight: "",
  bodyConcerns: "",
  goal: "",
  trainingHistory: "",
  exerciseFrequency: "",
  lifestyle: "",
  sleepHours: "",
  eatingHabits: "",
  alcoholFrequency: "",
  snackHabit: "",
  wakeUpTime: "",
  bedTime: "",
  weekdayActivityLevel: "medium",
  weekendActivityLevel: "medium",
  mealsPerDay: "",
  eatingOutFrequency: "",
  waterIntake: "",
  homeEquipment: [],
  gymEquipment: [],
  injuries: "",
  dislikedExercises: "",
  likedExercises: "",
  currentChallenges: "",
  habitsToImprove: "",
  trainerNotes: "",
};

const numberToFormValue = (value: number | null) => (value === null ? "" : String(value));
const formValueToNumber = (value: string) => (value.trim() === "" ? null : Number(value));

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export function customerToFormValues(customer: Customer): CustomerFormValues {
  return {
    name: customer.name,
    age: numberToFormValue(customer.age),
    gender: customer.gender,
    height: numberToFormValue(customer.height),
    currentWeight: numberToFormValue(customer.currentWeight),
    targetWeight: numberToFormValue(customer.targetWeight),
    bodyConcerns: customer.bodyConcerns,
    goal: customer.goal,
    trainingHistory: customer.trainingHistory,
    exerciseFrequency: customer.exerciseFrequency,
    lifestyle: customer.lifestyle,
    sleepHours: numberToFormValue(customer.sleepHours),
    eatingHabits: customer.eatingHabits,
    alcoholFrequency: customer.alcoholFrequency,
    snackHabit: customer.snackHabit,
    wakeUpTime: customer.wakeUpTime,
    bedTime: customer.bedTime,
    weekdayActivityLevel: customer.weekdayActivityLevel,
    weekendActivityLevel: customer.weekendActivityLevel,
    mealsPerDay: numberToFormValue(customer.mealsPerDay),
    eatingOutFrequency: customer.eatingOutFrequency,
    waterIntake: numberToFormValue(customer.waterIntake),
    homeEquipment: customer.homeEquipment,
    gymEquipment: customer.gymEquipment,
    injuries: customer.injuries,
    dislikedExercises: customer.dislikedExercises,
    likedExercises: customer.likedExercises,
    currentChallenges: customer.currentChallenges,
    habitsToImprove: customer.habitsToImprove,
    trainerNotes: customer.trainerNotes,
  };
}

export function formValuesToCustomer(values: CustomerFormValues, currentCustomer?: Customer): Customer {
  const now = new Date().toISOString();

  return {
    id: currentCustomer?.id ?? createId(),
    name: values.name,
    age: formValueToNumber(values.age),
    gender: values.gender,
    height: formValueToNumber(values.height),
    currentWeight: formValueToNumber(values.currentWeight),
    targetWeight: formValueToNumber(values.targetWeight),
    bodyConcerns: values.bodyConcerns,
    goal: values.goal,
    trainingHistory: values.trainingHistory,
    exerciseFrequency: values.exerciseFrequency,
    lifestyle: values.lifestyle,
    sleepHours: formValueToNumber(values.sleepHours),
    eatingHabits: values.eatingHabits,
    alcoholFrequency: values.alcoholFrequency,
    snackHabit: values.snackHabit,
    wakeUpTime: values.wakeUpTime,
    bedTime: values.bedTime,
    weekdayActivityLevel: values.weekdayActivityLevel,
    weekendActivityLevel: values.weekendActivityLevel,
    mealsPerDay: formValueToNumber(values.mealsPerDay),
    eatingOutFrequency: values.eatingOutFrequency,
    waterIntake: formValueToNumber(values.waterIntake),
    homeEquipment: values.homeEquipment,
    gymEquipment: values.gymEquipment,
    injuries: values.injuries,
    dislikedExercises: values.dislikedExercises,
    likedExercises: values.likedExercises,
    currentChallenges: values.currentChallenges,
    habitsToImprove: values.habitsToImprove,
    trainerNotes: values.trainerNotes,
    createdAt: currentCustomer?.createdAt ?? now,
    updatedAt: now,
  };
}
