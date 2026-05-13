import { sortBookSections } from "@/features/books/bookForm";
import type { AssignmentDayFormValues } from "./assignmentPlanForm";
import type { Book, BookSection } from "@/types";

export type StudyAssignmentRule = {
  progressDays: number;
  reviewDays: number;
  skipRestDays: boolean;
};

type ChapterReviewGroup = {
  chapter: string;
  sections: BookSection[];
};

const formatSectionText = (section: BookSection) =>
  [section.chapter, section.label].filter((value) => value.trim().length > 0).join(" ");

const formatProgressTask = (book: Book, section: BookSection) =>
  `『${book.title}』${formatSectionText(section)}`;

const groupSectionsByChapter = (sections: BookSection[]): ChapterReviewGroup[] => {
  const groups = new Map<string, BookSection[]>();

  for (const section of sections) {
    groups.set(section.chapter, [...(groups.get(section.chapter) ?? []), section]);
  }

  return Array.from(groups.entries()).map(([chapter, groupedSections]) => ({
    chapter,
    sections: groupedSections,
  }));
};

const formatReviewTask = (book: Book, group: ChapterReviewGroup) => {
  const labels = group.sections.map((section) => section.label).join("、");

  return `『${book.title}』${[group.chapter, labels, "復習"].filter((value) => value.trim().length > 0).join(" ")}`;
};

export function assignStudyTasksToDays(
  days: AssignmentDayFormValues[],
  book: Book,
  rule: StudyAssignmentRule,
): AssignmentDayFormValues[] {
  const sections = sortBookSections(book.chapters);

  if (sections.length === 0) {
    return days;
  }

  const progressDays = Math.max(rule.progressDays, 1);
  const reviewDays = Math.max(rule.reviewDays, 0);
  const cycleDays = progressDays + reviewDays;
  let activeStudyIndex = 0;
  let progressSectionIndex = 0;
  let currentCycleProgressSections: BookSection[] = [];

  return days.map((day) => {
    const isRestDay = day.isRestDay || day.location === "rest";

    if (isRestDay && rule.skipRestDays) {
      return {
        ...day,
        studyTask: "",
      };
    }

    const cycleIndex = cycleDays === 0 ? 0 : activeStudyIndex % cycleDays;
    let studyTask = "";

    if (cycleIndex === 0) {
      currentCycleProgressSections = [];
    }

    if (cycleIndex < progressDays) {
      const section = sections[progressSectionIndex % sections.length];
      currentCycleProgressSections.push(section);
      studyTask = formatProgressTask(book, section);
      progressSectionIndex += 1;
    } else {
      const reviewIndex = cycleIndex - progressDays;
      const reviewGroups = groupSectionsByChapter(currentCycleProgressSections);
      const reviewGroup = reviewGroups[reviewIndex] ?? reviewGroups[reviewGroups.length - 1];
      studyTask = reviewGroup ? formatReviewTask(book, reviewGroup) : "復習：直近で読んだ範囲を見直す";
    }

    activeStudyIndex += 1;

    return {
      ...day,
      studyTask,
    };
  });
}
