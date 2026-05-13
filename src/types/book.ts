import type { EntityId, ISODateTimeString } from "./common";

export type Book = {
  id: EntityId;
  title: string;
  author: string;
  chapters: BookSection[];
  notes: string;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};

export type BookSection = {
  id: EntityId;
  bookId: EntityId;
  chapter: string;
  label: string;
  pageRange?: string;
  order: number;
};

export type StudyPlanRule = {
  id: EntityId;
  bookId: EntityId;
  progressDays: number;
  reviewDays: number;
  skipRestDays: boolean;
};
