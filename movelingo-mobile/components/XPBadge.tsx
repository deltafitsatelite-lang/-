import { StyleSheet, View } from 'react-native';
import { theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';

type XPBadgeProps = {
  xp: number;
};

export function XPBadge({ xp }: XPBadgeProps) {
  return (
    <View style={styles.badge}>
      <AppText style={styles.label}>⭐ {xp} XP</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  label: {
    fontWeight: '800',
    color: '#92400E',
  },
});
