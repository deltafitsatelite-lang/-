'use client';

import { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PageHeaderProps = {
  title: string;
  description?: string;
  rightSlot?: ReactNode;
};

export default function PageHeader({ title, description, rightSlot }: PageHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {rightSlot ? <View style={styles.right}>{rightSlot}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  left: { flex: 1, gap: 4 },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  description: { fontSize: 14, color: '#475569' },
  right: { marginLeft: 8 },
});
