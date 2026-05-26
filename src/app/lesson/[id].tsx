import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLessonById } from '../../data/lessons';

export default function LessonDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const lessonId = Array.isArray(params.id) ? params.id[0] : params.id;
  const lesson = getLessonById(lessonId ?? '');

  if (!lesson) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errorTitle}>レッスンが見つかりません</Text>
        <Pressable style={styles.primaryButton} onPress={() => router.replace('/')}>
          <Text style={styles.primaryButtonText}>ホームへ戻る</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.label}>{lesson.skill}</Text>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.subtitle}>{lesson.subtitle}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>時間</Text>
          <Text style={styles.infoValue}>{lesson.duration}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>獲得XP</Text>
          <Text style={styles.infoValue}>{lesson.xp}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>今日のメニュー</Text>

        {lesson.steps.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() =>
          router.push({
            pathname: '/lesson-complete/[id]',
            params: { id: lesson.id },
          })
        }
      >
        <Text style={styles.primaryButtonText}>完了する</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.secondaryButtonText}>戻る</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: '#EAF7F0',
    paddingTop: 54,
    paddingHorizontal: 22,
    paddingBottom: 36,
  },
  label: {
    color: '#2F7D61',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
  },
  title: {
    color: '#10352D',
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: '#52736B',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#D6EEE5',
  },
  infoLabel: {
    color: '#78918A',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },
  infoValue: {
    color: '#123D34',
    fontSize: 22,
    fontWeight: '900',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D6EEE5',
    marginBottom: 22,
  },
  cardTitle: {
    color: '#123D34',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#20C981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  stepText: {
    flex: 1,
    color: '#31534B',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#123D34',
    borderRadius: 22,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#52736B',
    fontSize: 15,
    fontWeight: '800',
  },
  errorTitle: {
    color: '#10352D',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 18,
  },
});