import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { PageHeader } from '@/components/PageHeader';

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <PageHeader
          eyebrow="MoveLingo"
          title="今日の3分レッスン"
          subtitle="小さく続けて、身体能力を育てましょう"
          description="まずは軽い運動から始めます。痛み、めまい、息苦しさがある場合はすぐに中止してください。"
        />

        <Pressable
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed,
          ]}
          onPress={() => router.push('/lesson/chair-squat')}
        >
          <Text style={styles.cardLabel}>今日のレッスン</Text>
          <Text style={styles.cardTitle}>椅子スクワット入門</Text>
          <Text style={styles.cardText}>所要時間：3分</Text>
          <Text style={styles.cardText}>獲得予定XP：10XP</Text>
          <Text style={styles.tapHint}>タップして始める →</Text>
        </Pressable>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>120</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>連続日数</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>今日の一言</Text>
          <Text style={styles.noteText}>
            完璧じゃなくて大丈夫。今日の一歩だけ進めましょう。
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FBF7',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#22A45D',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#17202A',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 4,
  },
  tapHint: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#22A45D',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#17202A',
  },
  statLabel: {
    fontSize: 14,
    color: '#5D6D7E',
    marginTop: 4,
  },
  noteCard: {
    backgroundColor: '#EAF8EF',
    borderRadius: 20,
    padding: 18,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17202A',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#34495E',
  },
});