'use client';

import { View, Text, StyleSheet } from 'react-native';

export default function AssignmentsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assignments (disabled in mobile MVP)</Text>
      <Text style={styles.body}>Web/PDF assignment builder is excluded from Expo Go runtime.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  body: { fontSize: 16, color: '#334155' },
});
