export type RoadmapNodeState = 'completed' | 'current' | 'locked' | 'chest' | 'recovery';

export type RoadmapNode = {
  id: string;
  label: string;
  state: RoadmapNodeState;
};

export type RoadmapSection = {
  id: string;
  title: string;
  subtitle: string;
  nodes: RoadmapNode[];
};
