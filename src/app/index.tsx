import React, { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { lessons } from '../data/lessons';
import {
  defaultProgress,
  getLessonStatus,
  getProgress,
  type Progress,
} from '../lib/progress';

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      getProgress().then((savedProgress) => {
        if (mounted) {
          setProgress(savedProgress);
        }
      });

      return () => {
        mounted = false;
      };
    }, []),
  );

  const openLesson = (lessonId: string) => {
    const status = getLessonStatus(lessonId, progress);

    if (status === 'locked') {
      Alert.alert('まだ準備中です', '前のレッスンを完了すると解放されます。');
      return;
    }

    router.push({
      pathname: '/lesson/[id]',
      params: { id: lessonId },
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>MoveLingo</Text>
          <Text style={styles.tagline}>今日の身体リズムを整えよう</Text>
        </View>

        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.1</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>継続</Text>
          <Text style={styles.statValue}>{progress.streak}日</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>XP</Text>
          <Text style={styles.statValue}>{progress.xp}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Energy</Text>
          <Text style={styles.statValue}>{progress.energy}</Text>
        </View>
      </View>

      <View style={styles.phaseCard}>
        <Text style={styles.phaseLabel}>PHASE 1</Text>
        <Text style={styles.phaseTitle}>3分の運動習慣をつくる</Text>
        <Text style={styles.phaseText}>
          完了すると次のレッスンが自動で解放されます
        </Text>

        <View style={styles.pulseBar}>
          <View style={styles.pulseDot} />
          <View style={styles.pulseLine} />
          <View style={styles.pulseDotSmall} />
          <View style={styles.pulseLine} />
          <View style={styles.pulseDotSmall} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.trailList}
      >
        {lessons.map((lesson, index) => {
          const status = getLessonStatus(lesson.id, progress);

          return (
            <Pressable
              key={lesson.id}
              onPress={() => openLesson(lesson.id)}
              style={({ pressed }) => [
                styles.trailCard,
                lesson.kind === 'recovery' && styles.recoveryCard,
                status === 'active' && styles.activeCard,
                status === 'done' && styles.doneCard,
                status === 'locked' && styles.lockedCard,
                index % 2 === 1 && styles.offsetCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.trailLeft}>
                <View
                  style={[
                    styles.signal,
                    lesson.kind === 'recovery' && styles.recoverySignal,
                    status === 'active' && styles.activeSignal,
                    status === 'done' && styles.doneSignal,
                    status === 'locked' && styles.lockedSignal,
                  ]}
                >
                  <Text style={styles.signalText}>
                    {status === 'done'
                      ? '✓'
                      : status === 'locked'
                        ? '＋'
                        : lesson.kind === 'recovery'
                          ? 'R'
                          : '▶'}
                  </Text>
                </View>

                <View style={styles.lessonTextArea}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
                  <Text style={styles.lessonMeta}>
                    {lesson.skill}・{lesson.duration}・{lesson.xp}XP
                  </Text>
                </View>
              </View>

              <View style={styles.statusPill}>
                <Text style={styles.statusText}>
                  {status === 'done'
                    ? '完了'
                    : status === 'active'
                      ? '今日'
                      : 'ロック'}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={styles.navActive}>
          <Text style={styles.navActiveText}>Home</Text>
        </View>
        <Text style={styles.navText}>Lesson</Text>
        <Text style={styles.navText}>Growth</Text>
        <Text style={styles.navText}>Coach</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EAF7F0',
    paddingTop: 46,
  },
  header: {
    paddingHorizontal: 22,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appName: {
    color: '#10352D',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  tagline: {
    color: '#52736B',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  levelBadge: {
    backgroundColor: '#10352D',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D6EEE5',
  },
  statLabel: {
    color: '#6B8A82',
    fontSize: 12,
    fontWeight: '800',
  },
  statValue: {
    color: '#123D34',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  phaseCard: {
    marginHorizontal: 20,
    backgroundColor: '#123D34',
    borderRadius: 28,
    padding: 22,
    marginBottom: 12,
  },
  phaseLabel: {
    color: '#8EF0C1',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  phaseTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  phaseText: {
    color: '#CFE8DF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  pulseBar: {
    marginTop: 20,
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#8EF0C1',
  },
  pulseDotSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  pulseLine: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#4EA486',
    marginHorizontal: 6,
  },
  trailList: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 110,
  },
  trailCard: {
    minHeight: 96,
    borderRadius: 26,
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D9EFE7',
  },
  offsetCard: {
    marginLeft: 28,
  },
  activeCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#3DCB8A',
    borderWidth: 2,
    shadowColor: '#1C8C62',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  doneCard: {
    backgroundColor: '#F4FFFA',
  },
  lockedCard: {
    backgroundColor: '#F2F5F4',
    opacity: 0.72,
  },
  recoveryCard: {
    backgroundColor: '#F0FBFF',
    borderColor: '#BDECF6',
  },
  trailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  signal: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: '#20C981',
  },
  activeSignal: {
    backgroundColor: '#20C981',
  },
  doneSignal: {
    backgroundColor: '#6BD6A5',
  },
  lockedSignal: {
    backgroundColor: '#AAB8B4',
  },
  recoverySignal: {
    backgroundColor: '#64C7E8',
  },
  signalText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  lessonTextArea: {
    flex: 1,
  },
  lessonTitle: {
    color: '#153C34',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  lessonSubtitle: {
    color: '#6A817B',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  lessonMeta: {
    color: '#2F7D61',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 6,
  },
  statusPill: {
    backgroundColor: '#E3F6EE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginLeft: 8,
  },
  statusText: {
    color: '#146B4C',
    fontSize: 12,
    fontWeight: '900',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.85,
  },
  bottomNav: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D7EFE6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#0B2E26',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  navActive: {
    backgroundColor: '#123D34',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  navActiveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  navText: {
    color: '#78918A',
    fontSize: 13,
    fontWeight: '900',
  },
});