import { z } from "zod";
import type { AssignmentDay, AssignmentPlan, Book, BookSection, Customer, StudyPlanRule, Template } from "@/types";

export const entityIdSchema = z.string().min(1, "IDは必須です");
export const isoDateStringSchema = z.string().min(1, "日付は必須です");
export const isoDateTimeStringSchema = z.string().min(1, "日時は必須です");

export const genderSchema = z.enum(["male", "female", "other", "no_answer"]);
export const activityLevelSchema = z.enum(["low", "medium", "high"]);
export const assignmentLocationSchema = z.enum(["home", "gym", "outdoor", "rest", "other"]);
export const pdfModeSchema = z.enum(["single_page", "two_pages"]);
export const templateCategorySchema = z.enum([
  "home_training",
  "gym_training",
  "cardio",
  "mobility",
  "meal",
  "sleep",
  "weight_log",
  "water",
  "habit",
  "study",
  "message",
  "other",
]);

const nullableNonNegativeNumberSchema = z.number().nonnegative().nullable();
const textArraySchema = z.array(z.string());

export const customerSchema: z.ZodType<Customer> = z.object({
  id: entityIdSchema,
  name: z.string().min(1, "顧客名は必須です"),
  age: nullableNonNegativeNumberSchema,
  gender: genderSchema,
  height: nullableNonNegativeNumberSchema,
  currentWeight: nullableNonNegativeNumberSchema,
  targetWeight: nullableNonNegativeNumberSchema,
  bodyConcerns: z.string(),
  goal: z.string(),
  trainingHistory: z.string(),
  exerciseFrequency: z.string(),
  lifestyle: z.string(),
  sleepHours: nullableNonNegativeNumberSchema,
  eatingHabits: z.string(),
  alcoholFrequency: z.string(),
  snackHabit: z.string(),
  wakeUpTime: z.string(),
  bedTime: z.string(),
  weekdayActivityLevel: activityLevelSchema,
  weekendActivityLevel: activityLevelSchema,
  mealsPerDay: nullableNonNegativeNumberSchema,
  eatingOutFrequency: z.string(),
  waterIntake: nullableNonNegativeNumberSchema,
  homeEquipment: textArraySchema,
  gymEquipment: textArraySchema,
  injuries: z.string(),
  dislikedExercises: z.string(),
  likedExercises: z.string(),
  currentChallenges: z.string(),
  habitsToImprove: z.string(),
  trainerNotes: z.string(),
  createdAt: isoDateTimeStringSchema,
  updatedAt: isoDateTimeStringSchema,
});

export const assignmentDaySchema: z.ZodType<AssignmentDay> = z.object({
  id: entityIdSchema,
  date: isoDateStringSchema,
  dayOfWeek: z.string().min(1, "曜日は必須です"),
  location: assignmentLocationSchema,
  trainingTasks: textArraySchema,
  cardioTask: z.string(),
  mobilityTask: z.string(),
  mealTask: z.string(),
  sleepTask: z.string(),
  weightLogTask: z.string(),
  waterTask: z.string(),
  habitTask: z.string(),
  studyTask: z.string(),
  memo: z.string(),
  isRestDay: z.boolean(),
  checkItems: textArraySchema,
});

export const assignmentPlanSchema: z.ZodType<AssignmentPlan> = z.object({
  id: entityIdSchema,
  customerId: entityIdSchema,
  title: z.string().min(1, "課題タイトルは必須です"),
  startDate: isoDateStringSchema,
  endDate: isoDateStringSchema,
  personalTrainingDate: isoDateStringSchema.nullable(),
  nextTrainingDate: isoDateStringSchema.nullable(),
  trainerMessage: z.string(),
  pdfMode: pdfModeSchema,
  days: z.array(assignmentDaySchema),
  createdAt: isoDateTimeStringSchema,
  updatedAt: isoDateTimeStringSchema,
});

export const bookSectionSchema: z.ZodType<BookSection> = z.object({
  id: entityIdSchema,
  bookId: entityIdSchema,
  chapter: z.string(),
  label: z.string().min(1, "章・節のラベルは必須です"),
  pageRange: z.string(),
  order: z.number().int().nonnegative(),
});

export const bookSchema: z.ZodType<Book> = z.object({
  id: entityIdSchema,
  title: z.string().min(1, "書籍タイトルは必須です"),
  author: z.string(),
  chapters: z.array(bookSectionSchema),
  notes: z.string(),
  createdAt: isoDateTimeStringSchema,
  updatedAt: isoDateTimeStringSchema,
});

export const studyPlanRuleSchema: z.ZodType<StudyPlanRule> = z.object({
  id: entityIdSchema,
  bookId: entityIdSchema,
  progressDays: z.number().int().positive("進行日は1日以上で指定してください"),
  reviewDays: z.number().int().nonnegative(),
  skipRestDays: z.boolean(),
});

export const templateSchema: z.ZodType<Template> = z.object({
  id: entityIdSchema,
  name: z.string().min(1, "テンプレート名は必須です"),
  category: templateCategorySchema,
  content: z.string().min(1, "テンプレート本文は必須です"),
  createdAt: isoDateTimeStringSchema,
  updatedAt: isoDateTimeStringSchema,
});

export const customerListSchema: z.ZodType<Customer[]> = z.array(customerSchema);
export const assignmentPlanListSchema: z.ZodType<AssignmentPlan[]> = z.array(assignmentPlanSchema);
export const bookListSchema: z.ZodType<Book[]> = z.array(bookSchema);
export const templateListSchema: z.ZodType<Template[]> = z.array(templateSchema);
