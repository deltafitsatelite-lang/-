import { RoadmapNode } from '@/types/roadmap';

export const roadmapNodes: RoadmapNode[] = [
  { id: 'r1', type: 'lesson', lessonId: 'chair-squat', title: '椅子スクワット入門', status: 'completed', caption: '下半身 ・ 3分 ・ XP10' },
  { id: 'r2', type: 'lesson', lessonId: 'shoulder-mobility', title: '肩まわりリセット', status: 'current', caption: '柔軟性 ・ 3分 ・ XP10' },
  { id: 'r3', type: 'recovery', lessonId: 'breathing-core', title: '体幹呼吸', status: 'recovery', caption: '体幹 ・ 3分 ・ XP10' },
  { id: 'r4', type: 'bonus', lessonId: 'wall-pushup', title: '成長ボーナス', status: 'bonus', caption: 'ボーナスカプセル' },
  { id: 'r5', type: 'lesson', lessonId: 'wall-pushup', title: '壁腕立て入門', status: 'locked', caption: '上半身 ・ 4分 ・ XP12' },
  { id: 'r6', type: 'lesson', lessonId: 'hip-stretch', title: '股関節ストレッチ', status: 'locked', caption: '柔軟性 ・ 4分 ・ XP12' },
];
