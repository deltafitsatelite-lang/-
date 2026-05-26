export type RoadmapNodeStatus = 'completed' | 'current' | 'locked' | 'chest' | 'recovery';

export type RoadmapNode = {
  id: string;
  lessonId: string;
  title: string;
  skill: string;
  xp: number;
  kind?: 'normal' | 'chest' | 'recovery';
};

export type RoadmapSection = {
  id: string;
  title: string;
  subtitle: string;
  nodes: RoadmapNode[];
};
