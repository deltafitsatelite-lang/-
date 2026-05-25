import { PlanFeatureMap, FeatureKey, SubscriptionPlan } from '@/types/subscription';

export const PLAN_FEATURES: PlanFeatureMap = {
  free: ['daily-lesson', 'basic-skill-tree', 'xp-streak'],
  pro: [
    'daily-lesson',
    'basic-skill-tree',
    'xp-streak',
    'ai-light-adjust',
    'detailed-growth-report',
    'comeback-lessons',
    'custom-notification',
    'future-form-check',
  ],
};

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  'daily-lesson': '1日1レッスン',
  'basic-skill-tree': '基本スキルツリー',
  'xp-streak': 'XP / streak',
  'ai-light-adjust': 'AIによる軽め変更',
  'detailed-growth-report': '詳細な成長レポート',
  'comeback-lessons': '復帰レッスン',
  'custom-notification': '通知カスタム',
  'future-form-check': '将来のフォームチェック',
};

export function hasFeature(plan: SubscriptionPlan, feature: FeatureKey): boolean {
  return PLAN_FEATURES[plan].includes(feature);
}
