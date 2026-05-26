export type RoadmapNodeType = 'lesson' | 'bonus' | 'recovery';
export type RoadmapNodeStatus = 'completed' | 'current' | 'locked' | 'recovery' | 'bonus';

export type RoadmapNode = {
  id: string;
  type: RoadmapNodeType;
  lessonId: string;
  title: string;
  status: RoadmapNodeStatus;
  caption?: string;
};
