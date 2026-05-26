import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLessonById } from '../../data/lessons';
import { markLessonCompleted, type Progress } from '../../lib/progress';

export default function LessonComplete() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const lessonId = Array.isArray(params.id) ? params.id[0] : params.id;
  const lesson = getLessonById(lessonId ?? '');
  const savedRef = useRef(false);
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    if (!lesson || savedRef.current) {
      return;
    }

    savedRef.current = true;

    markLessonCompleted(lesson.id, lesson.xp).then((nextProgress) => {
      setProgress(nextProgress);
    });
  }, [lesson]);

  if (!lesson) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>レッスンが見つかりません</Text>
        <Pressable style={styles.primaryButton} onPress={() => router.replace('/')}>
          <Text style={styles.primaryButtonText}>ホームへ戻る</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.completeBadge}>
        <Text style={styles.completeBadgeText}>✓</Text>
      </View>

      <Text style={styles.title}>完了しました！</Text>
      <Text style={styles.subtitle}>{lesson.title}</Text>

      <View style={styles.rewardCard}>
        <View style={styles.rewardItem}>
          <Text style={styles.rewardLabel}>獲得XP</Text>
          <Text style={styles.rewardValue}>+{lesson.xp}</Text>
        </View>

        <View style={styles.rewardItem}>
          <Text style={styles.rewardLabel}>合計XP</Text>
          <Text style={styles.rewardValue}>{progress?.xp ?? '-'}</Text>
        </View>

        <View style={styles.rewardItem}>
          <Text style={styles.rewardLabel}>継続</Text>
          <Text style={styles.rewardValue}>{progress?.streak ?? '-'}日</Text>
        </View>
      </View>

      <Text style={styles.unlockText}>
        次のレッスンが解放されました
      </Text>

      <Pressable style={styles.primaryButton} onPress={() => router.replace('/')}>
        <Text style={styles.primaryButtonText}>ロードマップへ戻る</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EAF7F0',
    paddingTop: 86,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  completeBadge: {
    width: 104,
    height: 104,
    borderRadius: 34,
    backgroundColor: '#20C981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#1C8C62',
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
  completeBadgeText: {
    color: '#FFFFFF',
    fontSize: 54,
    fontWeight: '900',
  },
  title: {
    color: '#10352D',
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#52736B',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
  },
  rewardCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D6EEE5',
    marginBottom: 18,
  },
  rewardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rewardLabel: {
    color: '#6B8A82',
    fontSize: 15,
    fontWeight: '800',
  },
  rewardValue: {
    color: '#123D34',
    fontSize: 20,
    fontWeight: '900',
  },
  unlockText: {
    color: '#2F7D61',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 26,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#123D34',
    borderRadius: 22,
    paddingVertical: 17,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
});