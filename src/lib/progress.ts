import AsyncStorage from '@react-native-async-storage/async-storage';
import { lessons } from '../data/lessons';

const STORAGE_KEY = 'movelingo.progress.v1';

export type LessonStatus = 'done' | 'active' | 'locked';

export type Progress = {
  completedLessonIds: string[];
  xp: number;
  energy: number;
  streak: number;
  lastCompletedDate: string | null;
};

export const defaultProgress: Progress = {
  completedLessonIds: [],
  xp: 0,
  energy: 25,
  streak: 0,
  lastCompletedDate: null,
};

function normalizeProgress(value: Partial<Progress> | null): Progress {
  return {
    completedLessonIds: Array.isArray(value?.completedLessonIds)
      ? value.completedLessonIds.filter((id): id is string => typeof id === 'string')
      : [],
    xp: typeof value?.xp === 'number' ? value.xp : 0,
    energy: typeof value?.energy === 'number' ? value.energy : 25,
    streak: typeof value?.streak === 'number' ? value.streak : 0,
    lastCompletedDate:
      typeof value?.lastCompletedDate === 'string' ? value.lastCompletedDate : null,
  };
}

export async function getProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaultProgress;
    }

    return normalizeProgress(JSON.parse(raw));
  } catch {
    return defaultProgress;
  }
}

export async function saveProgress(progress: Progress): Promise<Progress> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

function dateDiffDays(from: string, to: string) {
  const fromDate = new Date(`${from}T00:00:00`);
  const toDate = new Date(`${to}T00:00:00`);
  return Math.round((toDate.getTime() - fromDate.getTime()) / 86400000);
}

function calculateNextStreak(lastCompletedDate: string | null, today: string, currentStreak: number) {
  if (!lastCompletedDate) {
    return 1;
  }

  if (lastCompletedDate === today) {
    return Math.max(currentStreak, 1);
  }

  const diff = dateDiffDays(lastCompletedDate, today);

  if (diff === 1) {
    return currentStreak + 1;
  }

  return 1;
}

export async function markLessonCompleted(lessonId: string, xp: number): Promise<Progress> {
  const progress = await getProgress();
  const today = new Date().toISOString().slice(0, 10);
  const alreadyCompleted = progress.completedLessonIds.includes(lessonId);

  const nextProgress: Progress = {
    ...progress,
    completedLessonIds: alreadyCompleted
      ? progress.completedLessonIds
      : [...progress.completedLessonIds, lessonId],
    xp: alreadyCompleted ? progress.xp : progress.xp + xp,
    energy: alreadyCompleted ? progress.energy : Math.max(0, progress.energy - 1),
    streak: calculateNextStreak(progress.lastCompletedDate, today, progress.streak),
    lastCompletedDate: today,
  };

  return saveProgress(nextProgress);
}

export function getLessonStatus(lessonId: string, progress: Progress): LessonStatus {
  if (progress.completedLessonIds.includes(lessonId)) {
    return 'done';
  }

  const firstIncompleteLesson = lessons.find(
    (lesson) => !progress.completedLessonIds.includes(lesson.id),
  );

  if (firstIncompleteLesson?.id === lessonId) {
    return 'active';
  }

  return 'locked';
}

export async function resetProgress() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}