import { Lesson } from '@/types/lesson';
import { ProgressState } from '@/types/progress';
import { UserProfile } from '@/types/user';

export type TodayLessonResult = {
  lesson: Lesson;
  reason: string;
};

function dayDiff(fromDate: string, toDate: string): number {
  const from = new Date(`${fromDate}T00:00:00Z`).getTime();
  const to = new Date(`${toDate}T00:00:00Z`).getTime();
  return Math.floor((to - from) / (24 * 60 * 60 * 1000));
}

function isLowImpact(lesson: Lesson): boolean {
  return lesson.totalMinutes <= 3 || lesson.title.includes('やさしい') || lesson.title.includes('ケア');
}

function avoidByConcern(lesson: Lesson, concern: UserProfile['concernArea']): boolean {
  const text = `${lesson.title} ${lesson.exercises.map((e) => `${e.name} ${e.caution}`).join(' ')}`;
  if (concern === 'knee') return /スクワット|ランジ|ジャンプ|ひざ痛/i.test(text);
  if (concern === 'lower-back') return /腰痛|ひねり|反る|ヒンジ/i.test(text);
  if (concern === 'shoulder') return /プッシュ|肩痛|Y字|パンチ/i.test(text);
  return false;
}

export function getTodayLesson(
  userProfile: UserProfile | null,
  progress: ProgressState,
  lessons: Lesson[],
  today = new Date().toISOString().slice(0, 10),
): TodayLessonResult {
  const available = lessons.length > 0 ? lessons : [];
  if (available.length === 0) {
    throw new Error('No lessons available');
  }

  const uncompleted = available.filter((l) => !progress.completedLessonIds.includes(l.id));
  let candidates = uncompleted.length > 0 ? uncompleted : available;
  let reason = uncompleted.length > 0 ? '今日は未完了のレッスンを優先しています' : '復習として取り組みやすいレッスンを選びました';

  const gapDays = progress.lastCompletedDate ? dayDiff(progress.lastCompletedDate, today) : 0;
  if (gapDays >= 2) {
    const comeback = candidates.filter(isLowImpact);
    if (comeback.length > 0) {
      candidates = comeback;
      reason = '今日は復帰しやすい軽めのレッスンです';
    }
  }

  if (userProfile?.dailyTimeMinutes === 3) {
    const shortOnes = candidates.filter((l) => l.totalMinutes <= 3);
    if (shortOnes.length > 0) {
      candidates = shortOnes;
      reason = '今日は3分で終わる短めレッスンを選びました';
    }
  }

  if (userProfile && userProfile.concernArea !== 'none' && userProfile.concernArea !== 'other') {
    const safer = candidates.filter((l) => !avoidByConcern(l, userProfile.concernArea));
    if (safer.length > 0) {
      candidates = safer;
      reason = '不安な部位に配慮して、無理しにくい内容を選んでいます';
    }
  }

  const lastCompletedId = progress.completedLessonIds[progress.completedLessonIds.length - 1];
  const lastSkill = available.find((l) => l.id === lastCompletedId)?.skillTree;
  if (lastSkill) {
    const mixed = candidates.filter((l) => l.skillTree !== lastSkill);
    if (mixed.length > 0) {
      candidates = mixed;
      reason = '同じ部位に偏りすぎないよう、別のスキルを選びました';
    }
  }

  const lesson = [...candidates].sort((a, b) => a.totalMinutes - b.totalMinutes)[0];
  return { lesson, reason };
}
