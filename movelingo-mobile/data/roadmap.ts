import { RoadmapSection } from '@/types/roadmap';

export const roadmapSection: RoadmapSection = {
  id: 'section-1-unit-1',
  title: 'セクション1・ユニット1',
  subtitle: 'まずは3分の運動習慣',
  nodes: [
    { id: 'n1', label: '姿勢チェック', state: 'completed' },
    { id: 'n2', label: 'チェアスクワット', state: 'completed' },
    { id: 'n3', label: '3分ルーティン', state: 'current' },
    { id: 'n4', label: 'ストレッチ', state: 'recovery' },
    { id: 'n5', label: 'デイリー宝箱', state: 'chest' },
    { id: 'n6', label: '次の基礎', state: 'locked' },
    { id: 'n7', label: '次の基礎2', state: 'locked' },
  ],
};
