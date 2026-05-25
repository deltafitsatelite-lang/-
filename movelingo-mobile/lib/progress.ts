import { Lesson, SkillTree } from '@/types/lesson';
import { CompleteLessonResult, ProgressState, SkillProgress } from '@/types/progress';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const SKILL_PROGRESS_STEP = 5;

export const INITIAL_PROGRESS_STATE: ProgressState = {
  totalXp: 120,
  streakDays: 3,
  lastCompletedDate: null,
  completedLessonIds: [],
  skillProgress: [
    { skillTree: 'lower-body', progressPercent: 35 },
    { skillTree: 'core', progressPercent: 35 },
    { skillTree: 'upper-body', progressPercent: 35 },
    { skillTree: 'flexibility', progressPercent: 35 },
    { skillTree: 'cardio', progressPercent: 35 },
  ],
};

function dayDiff(fromDate: string, toDate: string): number {
  const from = new Date(`${fromDate}T00:00:00Z`).getTime();
  const to = new Date(`${toDate}T00:00:00Z`).getTime();
  return Math.floor((to - from) / MS_PER_DAY);
}

function updateStreak(streakDays: number, lastCompletedDate: string | null, today: string): number {
  if (!lastCompletedDate) return 1;
  const diff = dayDiff(lastCompletedDate, today);
  if (diff <= 0) return streakDays;
  if (diff <= 2) return streakDays + 1;
  return 1;
}

function updateSkillProgress(skillProgress: SkillProgress[], skillTree: SkillTree): SkillProgress[] {
  return skillProgress.map((item) =>
    item.skillTree === skillTree
      ? { ...item, progressPercent: Math.min(100, item.progressPercent + SKILL_PROGRESS_STEP) }
      : item,
  );
}

export function completeLesson(
  state: ProgressState,
  lesson: Lesson,
  today: string,
): { nextState: ProgressState; result: CompleteLessonResult } {
  const baseXp = 10;
  const firstTimeBonus = state.completedLessonIds.includes(lesson.id) ? 0 : 5;
  const xpGained = baseXp + firstTimeBonus;

  const shouldUpdateStreak = !state.lastCompletedDate || dayDiff(state.lastCompletedDate, today) > 0;
  const nextStreakDays = shouldUpdateStreak
    ? updateStreak(state.streakDays, state.lastCompletedDate, today)
    : state.streakDays;

  const nextCompleted = state.completedLessonIds.includes(lesson.id)
    ? state.completedLessonIds
    : [...state.completedLessonIds, lesson.id];

  const nextSkillProgress = updateSkillProgress(state.skillProgress, lesson.skillTree);

  const nextState: ProgressState = {
    ...state,
    totalXp: state.totalXp + xpGained,
    streakDays: nextStreakDays,
    lastCompletedDate: today,
    completedLessonIds: nextCompleted,
    skillProgress: nextSkillProgress,
  };

  return {
    nextState,
    result: {
      xpGained,
      totalXp: nextState.totalXp,
      streakDays: nextState.streakDays,
      skillProgress: nextState.skillProgress,
    },
  };
}
