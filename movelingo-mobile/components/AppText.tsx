import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { theme } from '@/constants/theme';

type AppTextVariant = 'heading' | 'subheading' | 'body' | 'caption';

type AppTextProps = {
  children: ReactNode;
  variant?: AppTextVariant;
  style?: StyleProp<TextStyle>;
};

export function AppText({ children, variant = 'body', style }: AppTextProps) {
  return <Text style={[styles.base, styles[variant], style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  base: {
    color: theme.colors.text,
  },
  heading: {
    fontSize: theme.typography.heading,
    lineHeight: 34,
    fontWeight: '800',
  },
  subheading: {
    fontSize: theme.typography.subheading,
    lineHeight: 28,
    fontWeight: '700',
  },
  body: {
    fontSize: theme.typography.body,
    lineHeight: 26,
    fontWeight: '500',
  },
  caption: {
    fontSize: theme.typography.caption,
    lineHeight: 20,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
});
