export type RoadmapNodeStatus = 'completed' | 'current' | 'locked' | 'chest' | 'recovery';

export type RoadmapNode = {
  id: string;
  lessonId: string;
  title: string;
  skill: string;
  status: RoadmapNodeStatus;
  xp: number;
};

export type RoadmapSection = {
  id: string;
  title: string;
  subtitle: string;
  nodes: RoadmapNode[];
};
