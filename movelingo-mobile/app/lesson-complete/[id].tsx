import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppText } from '@/components/AppText';
import { ProgressBar } from '@/components/ProgressBar';
import { ScreenContainer } from '@/components/ScreenContainer';
import { theme } from '@/constants/theme';
import { lessons } from '@/data/lessons';
import { skillTrees } from '@/data/skillTrees';
import { useProgress } from '@/context/ProgressContext';
import { useEffect, useRef } from 'react';

export default function LessonCompleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { progress, completeLessonById } = useProgress();
  const mappedId = id;
  const countedRef = useRef(false);

  useEffect(() => {
    if (!mappedId || countedRef.current) return;
    completeLessonById(mappedId);
    countedRef.current = true;
  }, [completeLessonById, mappedId]);

  const currentIndex = lessons.findIndex((lesson) => lesson.id === mappedId);
  const currentLesson = currentIndex >= 0 ? lessons[currentIndex] : undefined;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : lessons[0];

  const skill = currentLesson ? skillTrees.find((item) => item.key === currentLesson.skillTree) : undefined;
  const progressPercent = currentLesson
    ? progress.skillProgress.find((item) => item.skillTree === currentLesson.skillTree)?.progressPercent ?? 0
    : 0;

  return (
    <>
      <Stack.Screen options={{ title: '完了', headerShown: true }} />
      <ScreenContainer>
        <View style={styles.content}>
          <AppCard style={styles.heroCard}>
            <AppText variant="heading">今日の一歩、完了！</AppText>
            <AppText>3分でも、身体はちゃんと前に進んでいます</AppText>
            <AppText variant="caption">明日も小さく続けましょう</AppText>
          </AppCard>

          <AppCard style={styles.statsCard}>
            <AppText variant="subheading">今回の結果</AppText>
            <AppText>獲得MP: +{progress.recentMpGained}</AppText>
            <AppText>現在MP: {progress.totalXp}</AppText>
            <AppText>連続記録: {progress.streakDays}日</AppText>
            <AppText>対象スキル: {skill?.nameJa ?? '未設定'}</AppText>
            <AppText>スキル成長: {Math.round(progressPercent)}%</AppText>
            <ProgressBar progress={progressPercent / 100} />
          </AppCard>

          <View style={styles.buttonArea}>
            <AppButton title="次のレッスンを見る" onPress={() => router.replace(`/lesson/${nextLesson.id}`)} />
            <AppButton title="ホームに戻る" onPress={() => router.replace('/(tabs)/home')} />
          </View>
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, gap: theme.spacing.md, justifyContent: 'space-between' },
  heroCard: { gap: theme.spacing.sm },
  statsCard: { gap: theme.spacing.sm },
  buttonArea: { gap: theme.spacing.sm },
});
