export type Difficulty = 'beginner';

export type SkillTree =
  | 'lower-body'
  | 'core'
  | 'upper-body'
  | 'flexibility'
  | 'cardio';

export type Exercise = {
  id: string;
  name: string;
  durationSeconds?: number;
  reps?: string;
  instruction: string;
  easyVersion: string;
  caution: string;
};

export type Lesson = {
  id: string;
  title: string;
  skillTree: SkillTree;
  difficulty: Difficulty;
  totalMinutes: 3 | 4 | 5;
  equipment: 'none';
  beginnerFriendly: true;
  safetyNote: string;
  exercises: [Exercise, Exercise] | [Exercise, Exercise, Exercise];
};

export type SkillTreeMeta = {
  key: SkillTree;
  nameJa: string;
  description: string;
};
