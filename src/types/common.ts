export type EntityId = string;
export type ISODateString = string;
export type ISODateTimeString = string;

export type Gender = "male" | "female" | "other" | "no_answer";

export type ActivityLevel = "low" | "medium" | "high";

export type AssignmentLocation = "home" | "gym" | "outdoor" | "rest" | "other";

export type PdfMode = "single_page" | "two_pages";

export type TemplateCategory =
  | "home_training"
  | "gym_training"
  | "cardio"
  | "mobility"
  | "meal"
  | "sleep"
  | "weight_log"
  | "water"
  | "habit"
  | "study"
  | "message"
  | "other";
