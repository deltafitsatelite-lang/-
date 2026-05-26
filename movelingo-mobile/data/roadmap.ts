import { RoadmapSection } from '@/types/roadmap';

export const roadmapSection: RoadmapSection = {
  id: 'section-1-unit-1',
  title: 'セクション1・ユニット1',
  subtitle: 'まずは3分の運動習慣',
  nodes: [
    { id: 'n1', lessonId: 'chair-squat', title: 'チェアスクワット', skill: '下半身', xp: 20 },
    { id: 'n2', lessonId: 'wall-pushup', title: '壁プッシュアップ', skill: '上半身', xp: 20 },
    { id: 'n3', lessonId: 'shoulder-mobility', title: '肩モビリティ', skill: '柔軟性', xp: 25 },
    { id: 'c1', lessonId: 'chest-1', title: '筋肉チェスト', skill: '報酬', xp: 25, kind: 'chest' },
    { id: 'n4', lessonId: 'core-breathing', title: '体幹ブリージング', skill: '体幹', xp: 15, kind: 'recovery' },
    { id: 'n5', lessonId: 'easy-walk', title: 'イージーウォーク', skill: '有酸素', xp: 30 },
    { id: 'n6', lessonId: 'hip-stretch', title: 'ヒップストレッチ', skill: '柔軟性', xp: 18 },
    { id: 'c2', lessonId: 'chest-2', title: '筋肉チェスト', skill: '報酬', xp: 25, kind: 'chest' },
  ],
};
