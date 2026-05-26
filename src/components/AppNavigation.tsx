import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const navigationItems = [
  { href: '/', label: 'ホーム' },
];

export function AppNavigation() {
  return (
    <View style={styles.container}>
      {navigationItems.map((item) => (
        <Link key={item.href} href={item.href as any} asChild>
          <Text style={styles.link}>{item.label}</Text>
        </Link>
      ))}
    </View>
  );
}

export default AppNavigation;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  link: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22A45D',
  },
});