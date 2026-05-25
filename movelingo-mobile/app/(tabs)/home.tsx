import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { XPBadge } from '@/components/XPBadge';
import { lessons } from '@/data/lessons';
import { skillTrees } from '@/data/skillTrees';
import { theme } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';
import { useProgress } from '@/context/ProgressContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { getTodayLesson } from '@/lib/todayLesson';

export default function HomeScreen() {
  const { progress } = useProgress();
  const { profile } = useUserProfile();
  const selected = getTodayLesson(profile, progress, lessons);
  const todayLesson = selected.lesson;
  const skill = skillTrees.find((item) => item.key === todayLesson.skillTree);

  return (
    <ScreenContainer>
      <View style={styles.topSection}>
        <XPBadge xp={progress.totalXp} />
        <AppText variant="caption">🔥 連続記録 {progress.streakDays}日</AppText>
      </View>

      <AppText variant="heading">今日のレッスン</AppText>
      <AppText variant="caption">{selected.reason}</AppText>

      <AppCard style={styles.lessonCard}>
        <AppText variant="subheading">{todayLesson.title}</AppText>
        <AppText>所要時間: {todayLesson.totalMinutes}分</AppText>
        <AppText>対象スキル: {skill?.nameJa ?? todayLesson.skillTree}</AppText>
        <AppText>難易度: 初心者向け</AppText>
        <AppText>獲得予定XP: +10（初回は+5ボーナス）</AppText>
      </AppCard>

      <View style={styles.bottomArea}>
        <AppCard>
          <AppText variant="caption">今日の一言</AppText>
          <AppText>「完璧より、まず1回。小さな一歩が力になります。」</AppText>
        </AppCard>
        <AppButton
          title="今日のレッスンを始める"
          onPress={() => router.push(`/lesson/${todayLesson.id}`)}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonCard: {
    gap: theme.spacing.sm,
  },
  bottomArea: {
    marginTop: 'auto',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
});
