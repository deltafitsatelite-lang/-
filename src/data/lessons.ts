export type LessonKind = 'strength' | 'mobility' | 'recovery' | 'core';

export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  skill: string;
  duration: string;
  xp: number;
  kind: LessonKind;
  steps: string[];
};

export const lessons: Lesson[] = [
  {
    id: 'chair-squat',
    title: '椅子スクワット',
    subtitle: '下半身の土台をつくる',
    skill: '下半身',
    duration: '3分',
    xp: 10,
    kind: 'strength',
    steps: [
      '椅子の前に立ちます',
      '胸を起こしたまま、ゆっくり腰を下ろします',
      '椅子に軽く触れたら立ち上がります',
      '10回を目安に行います',
    ],
  },
  {
    id: 'shoulder-reset',
    title: '肩まわりリセット',
    subtitle: '呼吸しやすい姿勢へ',
    skill: '柔軟性',
    duration: '3分',
    xp: 10,
    kind: 'mobility',
    steps: [
      '背すじを伸ばして座ります',
      '肩をゆっくり大きく回します',
      '肩甲骨を寄せるように胸を開きます',
      '呼吸を止めずに続けます',
    ],
  },
  {
    id: 'recovery-breath',
    title: '回復ブレス',
    subtitle: '疲れを残さない休息',
    skill: '回復',
    duration: '2分',
    xp: 8,
    kind: 'recovery',
    steps: [
      '楽な姿勢で座ります',
      '鼻から4秒かけて吸います',
      '口から6秒かけて吐きます',
      '5呼吸くり返します',
    ],
  },
  {
    id: 'wall-pushup',
    title: '壁腕立て',
    subtitle: '上半身の入門レッスン',
    skill: '上半身',
    duration: '4分',
    xp: 12,
    kind: 'strength',
    steps: [
      '壁に両手をつきます',
      '体をまっすぐに保ちます',
      'ゆっくり肘を曲げます',
      '壁を押して元に戻ります',
    ],
  },
  {
    id: 'core-breathing',
    title: '体幹呼吸',
    subtitle: 'お腹まわりを安定させる',
    skill: '体幹',
    duration: '3分',
    xp: 12,
    kind: 'core',
    steps: [
      '仰向け、または楽な姿勢になります',
      'お腹に手を置きます',
      '息を吸ってお腹をふくらませます',
      '吐きながらお腹を軽く引き締めます',
    ],
  },
];

export function getLessonById(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}