import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { theme } from '@/constants/theme';
import { useUserProfile } from '@/context/UserProfileContext';
import { CoachTone, ConcernArea, DailyTimeMinutes, ExerciseExperience, FitnessGoal } from '@/types/user';

const goals: { value: FitnessGoal; label: string }[] = [
  { value: 'build-fitness', label: '体力をつけたい' },
  { value: 'improve-posture', label: '姿勢をよくしたい' },
  { value: 'lose-weight', label: '痩せたい' },
  { value: 'reduce-stiffness', label: '肩こり・腰の重さを減らしたい' },
  { value: 'build-habit', label: 'まずは習慣化したい' },
];

const experiences: { value: ExerciseExperience; label: string }[] = [
  { value: 'none', label: 'ほぼない' },
  { value: 'some', label: '少しある' },
  { value: 'before', label: '以前やっていた' },
];

const dailyTimes: { value: DailyTimeMinutes; label: string }[] = [
  { value: 3, label: '3分' },
  { value: 5, label: '5分' },
  { value: 10, label: '10分' },
];

const concerns: { value: ConcernArea; label: string }[] = [
  { value: 'none', label: 'なし' },
  { value: 'knee', label: '膝' },
  { value: 'lower-back', label: '腰' },
  { value: 'shoulder', label: '肩' },
  { value: 'other', label: 'その他' },
];

const tones: { value: CoachTone; label: string }[] = [
  { value: 'gentle', label: 'やさしく' },
  { value: 'friendly', label: '友達っぽく' },
  { value: 'calm', label: '淡々と' },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useUserProfile();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText variant="heading">はじめに教えてください</AppText>
          <AppText variant="caption">あなたに合う進め方を作るための、かんたんな5つの質問です。</AppText>
        </View>

        <AppCard style={styles.card}>
          <AppText variant="subheading">1. 運動の目的</AppText>
          {goals.map((item) => (
            <AppText key={item.value}>・{item.label}</AppText>
          ))}
        </AppCard>

        <AppCard style={styles.card}>
          <AppText variant="subheading">2. 運動経験</AppText>
          {experiences.map((item) => (
            <AppText key={item.value}>・{item.label}</AppText>
          ))}
        </AppCard>

        <AppCard style={styles.card}>
          <AppText variant="subheading">3. 1日に使える時間</AppText>
          {dailyTimes.map((item) => (
            <AppText key={item.value}>・{item.label}</AppText>
          ))}
        </AppCard>

        <AppCard style={styles.card}>
          <AppText variant="subheading">4. 不安な部位</AppText>
          <AppText variant="caption">不調の診断ではなく、配慮のために確認します。</AppText>
          {concerns.map((item) => (
            <AppText key={item.value}>・{item.label}</AppText>
          ))}
        </AppCard>

        <AppCard style={styles.card}>
          <AppText variant="subheading">5. コーチの雰囲気</AppText>
          {tones.map((item) => (
            <AppText key={item.value}>・{item.label}</AppText>
          ))}
        </AppCard>

        <AppButton
          title="この内容で始める"
          onPress={async () => {
            await completeOnboarding({
              fitnessGoal: 'build-habit',
              exerciseExperience: 'none',
              dailyTimeMinutes: 3,
              concernArea: 'none',
              coachTone: 'gentle',
              notificationsEnabled: false,
              notificationTime: 'night',
              plan: 'free',
            });
            router.replace('/(tabs)/home');
          }}
        />
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
    gap: theme.spacing.xs,
  },
});
