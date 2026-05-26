import { z } from "zod";
import { assignmentDayFormSchema } from "@/features/assignments/assignmentPlanForm";
import { customerSchema } from "@/lib/validation";

export const aiStudySectionSchema = z.object({
  chapter: z.string(),
  label: z.string(),
  order: z.number().int().nonnegative(),
});

export const aiStudyRuleSchema = z.object({
  bookTitle: z.string().min(1),
  progressDays: z.number().int().positive(),
  reviewDays: z.number().int().nonnegative(),
  skipRestDays: z.boolean(),
  sections: z.array(aiStudySectionSchema),
});

export const aiAssignmentGenerationRequestSchema = z.object({
  customer: customerSchema,
  assignmentPeriod: z.object({
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    dayCount: z.number().int().positive(),
  }),
  days: z.array(assignmentDayFormSchema).min(1),
  studyRule: aiStudyRuleSchema.nullable(),
});

export const aiAssignmentGenerationContentSchema = z.object({
  days: z.array(assignmentDayFormSchema).min(1),
});

export const aiAssignmentGenerationResponseSchema = aiAssignmentGenerationContentSchema.extend({
  source: z.enum(["openai", "mock"]),
});

export type AiStudyRule = z.infer<typeof aiStudyRuleSchema>;
export type AiAssignmentGenerationRequest = z.infer<typeof aiAssignmentGenerationRequestSchema>;
export type AiAssignmentGenerationContent = z.infer<typeof aiAssignmentGenerationContentSchema>;
export type AiAssignmentGenerationResponse = z.infer<typeof aiAssignmentGenerationResponseSchema>;

const assignmentDayJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "id",
    "date",
    "dayOfWeek",
    "location",
    "trainingTasksText",
    "cardioTask",
    "mobilityTask",
    "mealTask",
    "sleepTask",
    "weightLogTask",
    "waterTask",
    "habitTask",
    "studyTask",
    "memo",
    "isRestDay",
    "checkItemsText",
  ],
  properties: {
    id: { type: "string" },
    date: { type: "string" },
    dayOfWeek: { type: "string" },
    location: { type: "string", enum: ["home", "gym", "outdoor", "rest", "other"] },
    trainingTasksText: { type: "string" },
    cardioTask: { type: "string" },
    mobilityTask: { type: "string" },
    mealTask: { type: "string" },
    sleepTask: { type: "string" },
    weightLogTask: { type: "string" },
    waterTask: { type: "string" },
    habitTask: { type: "string" },
    studyTask: { type: "string" },
    memo: { type: "string" },
    isRestDay: { type: "boolean" },
    checkItemsText: { type: "string" },
  },
} as const;

export const openAiAssignmentGenerationJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["days"],
  properties: {
    days: {
      type: "array",
      items: assignmentDayJsonSchema,
    },
  },
} as const;
