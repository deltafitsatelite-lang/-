import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppText } from '@/components/AppText';
import { ProgressBar } from '@/components/ProgressBar';
import { ScreenContainer } from '@/components/ScreenContainer';
import { theme } from '@/constants/theme';
import { useProgress } from '@/context/ProgressContext';
import { lessons } from '@/data/lessons';
import { skillTrees } from '@/data/skillTrees';

function calcLevel(progressPercent: number): number {
  return Math.min(5, Math.max(1, Math.floor(progressPercent / 20) + 1));
}

export default function SkillTreeScreen() {
  const { progress } = useProgress();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText variant="heading">Skill Tree</AppText>
          <AppText variant="caption">毎日の小さな積み重ねで、しっかり育っています。</AppText>
        </View>

        {skillTrees.map((skill) => {
          const progressItem = progress.skillProgress.find((item) => item.skillTree === skill.key);
          const progressPercent = progressItem?.progressPercent ?? 0;
          const level = calcLevel(progressPercent);
          const skillLessons = lessons.filter((lesson) => lesson.skillTree === skill.key);
          const completedCount = skillLessons.filter((lesson) =>
            progress.completedLessonIds.includes(lesson.id),
          ).length;
          const nextLesson = skillLessons.find(
            (lesson) => !progress.completedLessonIds.includes(lesson.id),
          );

          return (
            <AppCard key={skill.key} style={styles.card}>
              <View style={styles.cardHeader}>
                <AppText variant="subheading">{skill.nameJa}</AppText>
                <AppText variant="caption">Lv.{level}</AppText>
              </View>

              <AppText variant="caption">{skill.description}</AppText>
              <ProgressBar progress={progressPercent / 100} />

              <View style={styles.metaRow}>
                <AppText>進捗: {Math.round(progressPercent)}%</AppText>
                <AppText>完了: {completedCount}/{skillLessons.length}</AppText>
              </View>

              <View style={styles.nextBox}>
                <AppText variant="caption">次に解放されるレッスン</AppText>
                <AppText>
                  {nextLesson ? nextLesson.title : 'このスキルのレッスンはすべて完了しました 🎉'}
                </AppText>
              </View>

              <AppButton
                title={nextLesson ? 'レッスン一覧を見る' : '完了したレッスンを見る'}
                onPress={() =>
                  router.push(
                    nextLesson ? `/lesson/${nextLesson.id}` : `/lesson/${skillLessons[0]?.id ?? lessons[0].id}`,
                  )
                }
              />
            </AppCard>
          );
        })}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  header: {
    gap: theme.spacing.xs,
  },
  card: {
    gap: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  nextBox: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: '#EFF6FF',
    gap: theme.spacing.xs,
  },
});
