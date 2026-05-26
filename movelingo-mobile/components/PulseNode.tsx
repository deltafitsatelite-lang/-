import { Pressable, StyleSheet, Text, View } from 'react-native';

type PulseState = 'completed' | 'current' | 'locked' | 'recovery' | 'bonus';

type Props = {
  title: string;
  caption: string;
  state: PulseState;
  onPress: () => void;
};

const tone = {
  completed: { bg: '#C8F7E6', border: '#5DD6AE', text: '#0A3D2C', badge: '完了' },
  current: { bg: '#A7F3D0', border: '#2DD4BF', text: '#053B31', badge: '進行中' },
  locked: { bg: '#E2E8F0', border: '#94A3B8', text: '#334155', badge: 'ロック' },
  recovery: { bg: '#DBEAFE', border: '#60A5FA', text: '#1E3A8A', badge: '回復' },
  bonus: { bg: '#FDF4FF', border: '#C084FC', text: '#6B21A8', badge: 'ボーナス' },
} as const;

export function PulseNode({ title, caption, state, onPress }: Props) {
  const isCurrent = state === 'current';

  return (
    <Pressable onPress={onPress} style={[styles.wrap, { backgroundColor: tone[state].bg, borderColor: tone[state].border }, isCurrent && styles.current]}>
      <View style={styles.row}>
        <Text style={[styles.title, { color: tone[state].text }]}>{title}</Text>
        <Text style={[styles.badge, { color: tone[state].text }]}>{tone[state].badge}</Text>
      </View>
      <Text style={[styles.caption, { color: tone[state].text }]}>{caption}</Text>
      {isCurrent ? <View style={styles.pulseRing} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '88%',
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 10,
    position: 'relative',
  },
  current: {
    shadowColor: '#34D399',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '800' },
  badge: { fontSize: 12, fontWeight: '700' },
  caption: { marginTop: 6, fontSize: 13, fontWeight: '600' },
  pulseRing: {
    position: 'absolute',
    right: -8,
    top: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#34D399',
  },
});
