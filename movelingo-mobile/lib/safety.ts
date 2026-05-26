import { SafetyCheckResult } from '@/types/aiCoach';

const DANGER_WORDS = [
  'pain',
  'dizziness',
  'shortness of breath',
  'chest pain',
  'しびれ',
  '痛み',
  'めまい',
  '息苦しさ',
  '胸痛',
];

const MEDICAL_WORDS = ['diagnosis', 'treatment', 'prescription', '治療', '診断', '処方'];

export function runSafetyCheck(text: string): SafetyCheckResult {
  const lower = text.toLowerCase();
  const foundDanger = DANGER_WORDS.find((word) => lower.includes(word.toLowerCase()));
  if (foundDanger) {
    return {
      safe: false,
      reason: `危険サイン（${foundDanger}）が含まれています。`,
      shouldStopExercise: true,
    };
  }

  const foundMedical = MEDICAL_WORDS.find((word) => lower.includes(word.toLowerCase()));
  if (foundMedical) {
    return {
      safe: false,
      reason: `医療的表現（${foundMedical}）が含まれています。`,
      shouldStopExercise: true,
    };
  }

  return { safe: true, reason: null, shouldStopExercise: false };
}
