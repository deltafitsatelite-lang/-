import { Lesson, Exercise } from '@/types/lesson';

export type CoachMessage = {
  tone: 'gentle' | 'friendly' | 'calm';
  text: string;
};

export type AIAdjustedLesson = {
  lessonId: string;
  title: string;
  summary: string;
  exercises: Exercise[];
  message: CoachMessage;
  caution: string;
  totalMinutes?: 3 | 4 | 5;
  noEquipment?: boolean;
  beginnerFriendly?: boolean;
};

export type SafetyCheckResult = {
  safe: boolean;
  reason: string | null;
  shouldStopExercise: boolean;
};

export type AICoachResponse = {
  adjustedLesson: AIAdjustedLesson;
};

export type AICoachInput = {
  lesson: Lesson;
  userInput: string;
};
