import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RoadmapNode as RoadmapNodeType } from '@/types/roadmap';

type Props = {
  node: RoadmapNodeType;
  onPress: () => void;
};

const COLORS = {
  completed: '#4ADE80',
  current: '#22C55E',
  locked: '#334155',
  chest: '#F59E0B',
  recovery: '#38BDF8',
} as const;

const ICONS = {
  completed: '✓',
  current: '▶',
  locked: '🔒',
  chest: '🎁',
  recovery: '🧘',
} as const;

export function RoadmapNode({ node, onPress }: Props) {
  const isCurrent = node.status === 'current';

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        style={[styles.circle, { backgroundColor: COLORS[node.status] }, isCurrent && styles.current]}
      >
        <Text style={styles.icon}>{ICONS[node.status]}</Text>
      </Pressable>
      <Text style={styles.label}>{node.title}</Text>
      <Text style={styles.meta}>{node.skill} ・ {node.xp}XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', marginVertical: 10 },
  circle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  current: {
    borderWidth: 5,
    borderColor: '#BBF7D0',
    transform: [{ scale: 1.06 }],
  },
  icon: { fontSize: 28 },
  label: { color: '#E2E8F0', marginTop: 6, fontSize: 13, fontWeight: '600' },
  meta: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
});
