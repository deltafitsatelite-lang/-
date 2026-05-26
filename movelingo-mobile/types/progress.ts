import { SkillTree } from '@/types/lesson';

export type SkillProgress = {
  skillTree: SkillTree;
  progressPercent: number;
};

export type ProgressState = {
  totalXp: number;
  streakDays: number;
  lastCompletedDate: string | null;
  completedLessonIds: string[];
  skillProgress: SkillProgress[];
  recoveryMode: boolean;
  recentMpGained: number;
};

export type CompleteLessonResult = {
  xpGained: number;
  totalXp: number;
  streakDays: number;
  skillProgress: SkillProgress[];
  recoveryMode: boolean;
};
