import { SubscriptionPlan } from '@/types/subscription';

export type FitnessGoal =
  | 'build-fitness'
  | 'improve-posture'
  | 'lose-weight'
  | 'reduce-stiffness'
  | 'build-habit';

export type ExerciseExperience = 'none' | 'some' | 'before';

export type DailyTimeMinutes = 3 | 5 | 10;

export type ConcernArea = 'none' | 'knee' | 'lower-back' | 'shoulder' | 'other';

export type CoachTone = 'gentle' | 'friendly' | 'calm';

export type NotificationTime = 'morning' | 'noon' | 'night';

export type UserProfile = {
  fitnessGoal: FitnessGoal;
  exerciseExperience: ExerciseExperience;
  dailyTimeMinutes: DailyTimeMinutes;
  concernArea: ConcernArea;
  coachTone: CoachTone;
  notificationsEnabled: boolean;
  notificationTime: NotificationTime;
  plan: SubscriptionPlan;
};
