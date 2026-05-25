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
};

export type CompleteLessonResult = {
  xpGained: number;
  totalXp: number;
  streakDays: number;
  skillProgress: SkillProgress[];
};
