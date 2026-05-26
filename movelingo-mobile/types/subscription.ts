export type SubscriptionPlan = 'free' | 'pro';

export type FeatureKey =
  | 'daily-lesson'
  | 'basic-skill-tree'
  | 'xp-streak'
  | 'ai-light-adjust'
  | 'detailed-growth-report'
  | 'comeback-lessons'
  | 'custom-notification'
  | 'future-form-check';

export type PlanFeatureMap = Record<SubscriptionPlan, FeatureKey[]>;
