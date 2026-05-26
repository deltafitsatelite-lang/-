import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  leftIcon?: ReactNode;
};

export function AppButton({ title, onPress, leftIcon }: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.content}>
        {leftIcon}
        <AppText style={styles.label}>{title}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  pressed: {
    backgroundColor: theme.colors.primaryPressed,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  label: {
    color: '#FFFFFF',
    fontSize: theme.typography.button,
    lineHeight: 24,
    fontWeight: '800',
  },
});
