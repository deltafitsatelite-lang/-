import { z } from "zod";
import type { Template, TemplateCategory } from "@/types";

export const templateCategoryLabels: Record<TemplateCategory, string> = {
  home_training: "自宅トレーニング",
  gym_training: "ジムトレーニング",
  cardio: "有酸素",
  mobility: "ストレッチ・ケア",
  meal: "食事",
  sleep: "睡眠",
  weight_log: "体重記録",
  water: "水分摂取",
  habit: "習慣",
  study: "学習",
  message: "メッセージ",
  other: "その他",
};

export const templateCategoryOptions = [
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
] as const satisfies readonly TemplateCategory[];

export const templateFormSchema = z.object({
  name: z.string().trim().min(1, "テンプレート名は必須です"),
  category: z.enum([
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
  ]),
  content: z.string().trim().min(1, "内容は必須です"),
});

export type TemplateFormValues = z.infer<typeof templateFormSchema>;

export const emptyTemplateFormValues: TemplateFormValues = {
  name: "",
  category: "home_training",
  content: "",
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export function templateToFormValues(template: Template): TemplateFormValues {
  return {
    name: template.name,
    category: template.category,
    content: template.content,
  };
}

export function formValuesToTemplate(values: TemplateFormValues, currentTemplate?: Template): Template {
  const now = new Date().toISOString();

  return {
    id: currentTemplate?.id ?? createId(),
    name: values.name,
    category: values.category,
    content: values.content,
    createdAt: currentTemplate?.createdAt ?? now,
    updatedAt: now,
  };
}
