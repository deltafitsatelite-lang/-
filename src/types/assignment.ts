import type {
  AssignmentLocation,
  EntityId,
  ISODateString,
  ISODateTimeString,
  PdfMode,
} from "./common";

export type AssignmentPlan = {
  id: EntityId;
  customerId: EntityId;
  title: string;
  startDate: ISODateString;
  endDate: ISODateString;
  personalTrainingDate: ISODateString | null;
  nextTrainingDate: ISODateString | null;
  trainerMessage: string;
  pdfMode: PdfMode;
  days: AssignmentDay[];
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};

export type AssignmentDay = {
  id: EntityId;
  date: ISODateString;
  dayOfWeek: string;
  location: AssignmentLocation;
  trainingTasks: string[];
  cardioTask: string;
  mobilityTask: string;
  mealTask: string;
  sleepTask: string;
  weightLogTask: string;
  waterTask: string;
  habitTask: string;
  studyTask: string;
  memo: string;
  isRestDay: boolean;
  checkItems: string[];
};
