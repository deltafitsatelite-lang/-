import { RoadmapSection } from '@/types/roadmap';

export const roadmapSection: RoadmapSection = {
  id: 'section-1-unit-1',
  title: 'セクション1・ユニット1',
  subtitle: 'まずは3分の運動習慣',
  nodes: [
    { id: 'n1', lessonId: 'chair-squat', title: 'チェアスクワット', skill: '下半身', xp: 20 },
    { id: 'n2', lessonId: 'wall-pushup', title: '壁プッシュアップ', skill: '上半身', xp: 20 },
    { id: 'n3', lessonId: 'shoulder-mobility', title: '肩モビリティ', skill: '柔軟性', xp: 25 },
    { id: 'n4', lessonId: 'core-breathing', title: '体幹ブリージング', skill: '体幹', xp: 15, kind: 'recovery' },
    { id: 'n5', lessonId: 'easy-walk', title: 'イージーウォーク', skill: '有酸素', xp: 30, kind: 'chest' },
    { id: 'n6', lessonId: 'hip-stretch', title: 'ヒップストレッチ', skill: '柔軟性', xp: 18 },
  ],
};
