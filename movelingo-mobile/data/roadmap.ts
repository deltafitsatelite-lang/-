import { RoadmapSection } from '@/types/roadmap';

export const roadmapSection: RoadmapSection = {
  id: 'section-1-unit-1',
  title: 'セクション1・ユニット1',
  subtitle: 'まずは3分の運動習慣',
  nodes: [
    { id: 'n1', lessonId: 'chair-squat', title: 'チェアスクワット', skill: '下半身', status: 'completed', xp: 20 },
    { id: 'n2', lessonId: 'wall-pushup', title: '壁プッシュアップ', skill: '上半身', status: 'completed', xp: 20 },
    { id: 'n3', lessonId: 'shoulder-mobility', title: '肩モビリティ', skill: '柔軟性', status: 'current', xp: 25 },
    { id: 'n4', lessonId: 'core-breathing', title: '体幹ブリージング', skill: '体幹', status: 'recovery', xp: 15 },
    { id: 'n5', lessonId: 'easy-walk', title: 'イージーウォーク', skill: '有酸素', status: 'chest', xp: 30 },
    { id: 'n6', lessonId: 'hip-stretch', title: 'ヒップストレッチ', skill: '柔軟性', status: 'locked', xp: 18 },
  ],
};
