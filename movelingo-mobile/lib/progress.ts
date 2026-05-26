import { Lesson, SkillTree } from '@/types/lesson';
import { CompleteLessonResult, ProgressState, SkillProgress, BadgeKey } from '@/types/progress';

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
  recoveryMode: false,
  recentMpGained: 0,
  energy: 25,
  openedChestIds: [],
  earnedBadges: [],
};

function dayDiff(fromDate: string, toDate: string): number {
  const from = new Date(`${fromDate}T00:00:00Z`).getTime();
  const to = new Date(`${toDate}T00:00:00Z`).getTime();
  return Math.floor((to - from) / MS_PER_DAY);
}

function updateSkillProgress(skillProgress: SkillProgress[], skillTree: SkillTree): SkillProgress[] {
  return skillProgress.map((item) =>
    item.skillTree === skillTree
      ? { ...item, progressPercent: Math.min(100, item.progressPercent + SKILL_PROGRESS_STEP) }
      : item,
  );
}

function pushBadge(list: BadgeKey[], badge: BadgeKey): BadgeKey[] {
  return list.includes(badge) ? list : [...list, badge];
}

export function completeLesson(
  state: ProgressState,
  lesson: Lesson,
  today: string,
): { nextState: ProgressState; result: CompleteLessonResult } {
  const baseMp = lesson.xp;
  const firstTimeBonus = state.completedLessonIds.includes(lesson.id) ? 0 : 5;
  const xpGained = baseMp + firstTimeBonus;

  const diff = state.lastCompletedDate ? dayDiff(state.lastCompletedDate, today) : 0;
  const isNewDay = !state.lastCompletedDate || diff > 0;

  let nextStreakDays = state.streakDays;
  let recoveryMode = false;

  if (!state.lastCompletedDate) nextStreakDays = 1;
  else if (isNewDay) {
    if (diff === 1) nextStreakDays = state.streakDays + 1;
    else if (diff === 2) nextStreakDays = state.streakDays;
    else if (diff >= 3) {
      nextStreakDays = state.streakDays;
      recoveryMode = true;
    }
  }

  const nextCompleted = state.completedLessonIds.includes(lesson.id)
    ? state.completedLessonIds
    : [...state.completedLessonIds, lesson.id];

  const nextSkillProgress = updateSkillProgress(state.skillProgress, lesson.skillTree);

  let nextBadges = state.earnedBadges;
  if (nextCompleted.length >= 1) nextBadges = pushBadge(nextBadges, 'first-step');
  if (nextStreakDays >= 3) nextBadges = pushBadge(nextBadges, 'streak-3');
  if ((nextSkillProgress.find((s) => s.skillTree === 'lower-body')?.progressPercent ?? 0) >= 40) {
    nextBadges = pushBadge(nextBadges, 'lower-body-lv1');
  }
  if (recoveryMode) nextBadges = pushBadge(nextBadges, 'comeback');

  const nextState: ProgressState = {
    ...state,
    totalXp: state.totalXp + xpGained,
    streakDays: nextStreakDays,
    lastCompletedDate: today,
    completedLessonIds: nextCompleted,
    skillProgress: nextSkillProgress,
    recoveryMode,
    recentMpGained: xpGained,
    energy: state.energy - 1,
    earnedBadges: nextBadges,
  };

  return {
    nextState,
    result: {
      xpGained,
      totalXp: nextState.totalXp,
      streakDays: nextState.streakDays,
      skillProgress: nextState.skillProgress,
      recoveryMode,
    },
  };
}

export function openChest(state: ProgressState, chestId: string): ProgressState {
  if (state.openedChestIds.includes(chestId)) return state;
  return {
    ...state,
    openedChestIds: [...state.openedChestIds, chestId],
    totalXp: state.totalXp + 25,
    recentMpGained: 25,
  };
}
