import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PageHeaderProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  [key: string]: any;
};

export function PageHeader({
  title,
  subtitle,
  description,
  eyebrow,
  children,
}: PageHeaderProps) {
  return (
    <View style={styles.container}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {children}
    </View>
  );
}

export default PageHeader;

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    color: '#22A45D',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#17202A',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#34495E',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5D6D7E',
  },
});