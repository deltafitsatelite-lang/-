import { Lesson, Exercise } from '@/types/lesson';

export type CoachReason =
  | 'tired'
  | 'short-time'
  | 'knee-concern'
  | 'lower-back-concern'
  | 'low-motivation';

export type CoachAdjustedPlan = {
  title: string;
  message: string;
  note: string;
  exercises: Exercise[];
};

function reduceLoad(exercise: Exercise): Exercise {
  return {
    ...exercise,
    reps: exercise.reps ? '元の目安の約半分' : exercise.reps,
    durationSeconds: exercise.durationSeconds
      ? Math.max(20, Math.floor(exercise.durationSeconds * 0.6))
      : exercise.durationSeconds,
    instruction: `今日は軽めでOK。${exercise.instruction}`,
  };
}

export function buildAdjustedPlan(lesson: Lesson, reason: CoachReason): CoachAdjustedPlan {
  const base = lesson.exercises;

  if (reason === 'short-time') {
    const trimmed = base.slice(0, Math.min(2, base.length)).map(reduceLoad);
    return {
      title: '時短モード（2種目）',
      message: '時間がない日でも大丈夫。短く終えて流れをつなげましょう。',
      note: '種目数を減らし、各種目の負荷も軽めにしています。',
      exercises: trimmed,
    };
  }

  if (reason === 'tired' || reason === 'low-motivation') {
    const light = base.slice(0, Math.min(2, base.length)).map((ex) => ({
      ...reduceLoad(ex),
      instruction: `easyVersion優先: ${ex.easyVersion}`,
    }));
    return {
      title: 'やさしめモード',
      message: '戻ってきたことがすでに前進です。今日はやさしくいきましょう。',
      note: 'easyVersionを優先し、回数・時間を短めにしています。',
      exercises: light,
    };
  }

  if (reason === 'knee-concern' || reason === 'lower-back-concern') {
    const filtered = base.filter((ex) => !/スクワット|ランジ|ヒンジ|ひねり|ジャンプ/i.test(`${ex.name} ${ex.caution}`));
    const source = filtered.length > 0 ? filtered : base;
    const gentle = source.slice(0, Math.min(2, source.length)).map((ex) => ({
      ...reduceLoad(ex),
      instruction: `不安部位に配慮して実施: ${ex.easyVersion}`,
    }));
    return {
      title: '配慮モード',
      message: '不安がある日は守りの選択で大丈夫。できる範囲で進めましょう。',
      note: '負担が上がりやすい動きを避け、ストレッチ寄り・軽めの内容に調整しています。',
      exercises: gentle,
    };
  }

  return {
    title: '通常モード',
    message: '今日は今のメニューで進めてみましょう。',
    note: '',
    exercises: base,
  };
}
