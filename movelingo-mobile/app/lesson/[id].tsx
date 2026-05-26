import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { theme } from '@/constants/theme';
import { lessons } from '@/data/lessons';
import { skillTrees } from '@/data/skillTrees';
import { useProgress } from '@/context/ProgressContext';
import { buildAdjustedPlan, CoachReason } from '@/lib/coachAdjust';
import { useUserProfile } from '@/context/UserProfileContext';
import { useState } from 'react';

const coachOptions: { label: string; value: CoachReason }[] = [
  { label: '疲れている', value: 'tired' },
  { label: '時間がない', value: 'short-time' },
  { label: '膝が不安', value: 'knee-concern' },
  { label: '腰が不安', value: 'lower-back-concern' },
  { label: '気分が乗らない', value: 'low-motivation' },
];

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonByAlias = {
    'chair-squat': lessons[0],
    'wall-pushup': lessons[6],
    'shoulder-mobility': lessons[9],
    'core-breathing': lessons[3],
    'easy-walk': lessons[12],
    'hip-stretch': lessons[10],
  } as const;

  const lesson = lessons.find((item) => item.id === id) ?? lessonByAlias[id as keyof typeof lessonByAlias];
  const { completeLessonById } = useProgress();
  const { profile } = useUserProfile();
  const [selectedReason, setSelectedReason] = useState<CoachReason | null>(null);

  if (!lesson) return null;

  const skill = skillTrees.find((item) => item.key === lesson.skillTree);
  const adjusted = selectedReason ? buildAdjustedPlan(lesson, selectedReason) : null;
  const displayExercises = adjusted ? adjusted.exercises : lesson.exercises;

  const showCoachChoices = () => {
    if ((profile?.plan ?? 'free') !== 'pro') {
      router.push('/paywall');
      return;
    }
    Alert.alert('今日はきつそう？', '今の気分に合わせて、軽めプランに調整できます。', [
      ...coachOptions.map((opt) => ({ text: opt.label, onPress: () => setSelectedReason(opt.value) })),
      { text: 'キャンセル', style: 'cancel' },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'レッスン詳細', headerShown: true }} />
      <ScreenContainer>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <AppText variant="caption" style={styles.safetyTop}>
            痛み、めまい、息苦しさがある場合はすぐに中止してください
          </AppText>

          <AppCard style={styles.lessonCard}>
            <AppText variant="heading">{lesson.title}</AppText>
            <AppText>所要時間: {lesson.totalMinutes}分</AppText>
            <AppText>対象スキル: {skill?.nameJa ?? lesson.skillTree}</AppText>
            <AppText>安全メモ: {lesson.safetyNote}</AppText>
          </AppCard>

          <AppButton title="今日はきつそう" onPress={showCoachChoices} />

          {adjusted && (
            <AppCard style={styles.adjustCard}>
              <AppText variant="subheading">{adjusted.title}</AppText>
              <AppText>{adjusted.message}</AppText>
              <AppText variant="caption">{adjusted.note}</AppText>
            </AppCard>
          )}

          <View style={styles.section}>
            <AppText variant="subheading">種目一覧</AppText>
            {displayExercises.map((exercise) => (
              <AppCard key={exercise.id} style={styles.exerciseCard}>
                <AppText variant="subheading">{exercise.name}</AppText>
                <AppText>{exercise.durationSeconds ? `時間: ${exercise.durationSeconds}秒` : `回数: ${exercise.reps}`}</AppText>
                <AppText>説明: {exercise.instruction}</AppText>
                <AppText>かんたん版: {exercise.easyVersion}</AppText>
                <AppText>注意: {exercise.caution}</AppText>
              </AppCard>
            ))}
          </View>

          <View style={styles.buttonArea}>
            <AppButton
              title="完了した"
              onPress={() => {
                completeLessonById(lesson.id);
                router.push(`/lesson-complete/${lesson.id}`);
              }}
            />
            <AppButton title="今日はやめる" onPress={() => router.replace('/(tabs)/home')} />
          </View>
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: theme.spacing.xl, gap: theme.spacing.md },
  safetyTop: { color: '#B45309' },
  lessonCard: { gap: theme.spacing.sm },
  adjustCard: { gap: theme.spacing.xs, backgroundColor: '#EFF6FF' },
  section: { gap: theme.spacing.md },
  exerciseCard: { gap: theme.spacing.xs },
  buttonArea: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
});
