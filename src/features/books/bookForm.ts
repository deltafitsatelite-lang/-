import { z } from "zod";
import type { Book, BookSection } from "@/types";

export const bookFormSchema = z.object({
  title: z.string().trim().min(1, "書籍名は必須です"),
  author: z.string().trim(),
  notes: z.string().trim(),
});

export const bookSectionFormSchema = z.object({
  chapter: z.string().trim().min(1, "章を入力してください"),
  label: z.string().trim().min(1, "ラベルを入力してください"),
  pageRange: z.string().trim().min(1, "ページ範囲を入力してください"),
  order: z
    .string()
    .trim()
    .min(1, "表示順を入力してください")
    .refine((value: string) => Number.isInteger(Number(value)), { message: "表示順は整数で入力してください" })
    .refine((value: string) => Number(value) >= 0, { message: "表示順は0以上で入力してください" }),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;
export type BookSectionFormValues = z.infer<typeof bookSectionFormSchema>;

export const emptyBookFormValues: BookFormValues = {
  title: "",
  author: "",
  notes: "",
};

export const emptyBookSectionFormValues: BookSectionFormValues = {
  chapter: "",
  label: "",
  pageRange: "",
  order: "0",
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export function createBook(values: BookFormValues): Book {
  const now = new Date().toISOString();

  return {
    id: createId(),
    title: values.title,
    author: values.author,
    chapters: [],
    notes: values.notes,
    createdAt: now,
    updatedAt: now,
  };
}

export function createBookSection(values: BookSectionFormValues, bookId: string): BookSection {
  return {
    id: createId(),
    bookId,
    chapter: values.chapter,
    label: values.label,
    pageRange: values.pageRange,
    order: Number(values.order),
  };
}

export function sortBookSections(sections: BookSection[]) {
  return [...sections].sort((a, b) => a.order - b.order || a.chapter.localeCompare(b.chapter));
}
