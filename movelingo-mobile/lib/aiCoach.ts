import { AICoachInput, AICoachResponse, AIAdjustedLesson } from '@/types/aiCoach';
import { Lesson } from '@/types/lesson';
import { runSafetyCheck } from '@/lib/safety';

const useMock = process.env.EXPO_PUBLIC_AI_COACH_MODE !== 'live';
const edgeFunctionUrl = process.env.EXPO_PUBLIC_AI_COACH_EDGE_URL;
const edgeFunctionToken = process.env.EXPO_PUBLIC_AI_COACH_EDGE_TOKEN;

function isExerciseLike(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.instruction === 'string' &&
    typeof v.easyVersion === 'string' &&
    typeof v.caution === 'string'
  );
}

export function validateAIResponse(raw: unknown): raw is AICoachResponse {
  if (!raw || typeof raw !== 'object') return false;
  const root = raw as Record<string, unknown>;
  const adjusted = root.adjustedLesson as Record<string, unknown> | undefined;
  if (!adjusted) return false;

  const withinTime = Number(adjusted.totalMinutes ?? 3);

  return (
    typeof adjusted.lessonId === 'string' &&
    typeof adjusted.title === 'string' &&
    typeof adjusted.summary === 'string' &&
    typeof adjusted.caution === 'string' &&
    Array.isArray(adjusted.exercises) &&
    adjusted.exercises.every(isExerciseLike) &&
    adjusted.message !== null &&
    typeof adjusted.message === 'object' &&
    ['gentle', 'friendly', 'calm'].includes((adjusted.message as Record<string, unknown>).tone as string) &&
    typeof (adjusted.message as Record<string, unknown>).text === 'string' &&
    withinTime >= 3 &&
    withinTime <= 5
  );
}

export function mockAIResponse(input: AICoachInput): unknown {
  return {
    adjustedLesson: {
      lessonId: input.lesson.id,
      title: `${input.lesson.title}（調整版）`,
      summary: '今日は軽めに、easyVersion中心で進めましょう。',
      exercises: input.lesson.exercises.slice(0, 2).map((ex) => ({
        ...ex,
        instruction: `easyVersion優先: ${ex.easyVersion}`,
        durationSeconds: ex.durationSeconds ? Math.max(20, Math.floor(ex.durationSeconds * 0.7)) : ex.durationSeconds,
      })),
      message: {
        tone: 'gentle',
        text: '戻ってきたことが前進です。無理のない範囲でいきましょう。',
      },
      caution: '痛み、めまい、息苦しさがある場合は中止してください。妊娠中・術後・持病・運動制限がある場合は専門家へ相談してください。',
      totalMinutes: input.lesson.totalMinutes,
      noEquipment: true,
      beginnerFriendly: true,
    },
  };
}

async function callEdgeAI(input: AICoachInput): Promise<unknown> {
  if (!edgeFunctionUrl) return null;
  try {
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(edgeFunctionToken ? { Authorization: `Bearer ${edgeFunctionToken}` } : {}),
      },
      body: JSON.stringify({
        mode: 'light_adjust_only',
        constraints: {
          noMedicalDiagnosis: true,
          durationMin: 3,
          durationMax: 5,
          noEquipment: true,
          beginnerOnly: true,
          noHighLoadNewProgram: true,
        },
        input,
      }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function fallbackFromLesson(lesson: Lesson): AIAdjustedLesson {
  return {
    lessonId: lesson.id,
    title: `${lesson.title}（固定フォールバック）`,
    summary: '安全のため固定レッスンを表示しています。',
    exercises: lesson.exercises.slice(0, 2),
    message: {
      tone: 'gentle',
      text: '今日は無理せず、できる範囲の内容だけ行いましょう。',
    },
    caution: '痛み、めまい、息苦しさがある場合は中止してください。妊娠中・術後・持病・運動制限がある場合は専門家へ相談してください。',
  };
}

export async function getSafeAIAdjustedLesson(input: AICoachInput): Promise<{
  adjustedLesson: AIAdjustedLesson;
  usedFallback: boolean;
  blockedBySafety: boolean;
  source: 'mock' | 'live' | 'fallback';
}> {
  const raw = useMock ? mockAIResponse(input) : await callEdgeAI(input);

  if (!validateAIResponse(raw)) {
    return { adjustedLesson: fallbackFromLesson(input.lesson), usedFallback: true, blockedBySafety: false, source: 'fallback' };
  }

  const combinedText = `${input.userInput} ${raw.adjustedLesson.summary} ${raw.adjustedLesson.message.text} ${raw.adjustedLesson.caution}`;
  const safety = runSafetyCheck(combinedText);
  if (!safety.safe) {
    return {
      adjustedLesson: {
        lessonId: input.lesson.id,
        title: '今日は中止して休みましょう',
        summary: '危険サインがあるため、運動提案は行いません。',
        exercises: [],
        message: {
          tone: 'gentle',
          text: '体調を最優先にしてください。必要に応じて専門家へ相談しましょう。',
        },
        caution: '痛み、めまい、息苦しさ、妊娠中、術後、持病、運動制限がある場合は運動を中止し専門家へ相談してください。',
      },
      usedFallback: false,
      blockedBySafety: true,
      source: useMock ? 'mock' : 'live',
    };
  }

  return { adjustedLesson: raw.adjustedLesson, usedFallback: false, blockedBySafety: false, source: useMock ? 'mock' : 'live' };
}
