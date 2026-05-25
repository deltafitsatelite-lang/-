import { StyleSheet, View } from 'react-native';
import { theme } from '@/constants/theme';

type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  const safeProgress = Math.min(1, Math.max(0, progress));

  return (
    <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(safeProgress * 100) }}>
      <View style={[styles.fill, { width: `${safeProgress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 14,
    backgroundColor: '#E2E8F0',
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: theme.radius.pill,
  },
});
