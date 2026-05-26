import { Alert, StyleSheet, Switch, View } from 'react-native';
import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { XPBadge } from '@/components/XPBadge';
import { theme } from '@/constants/theme';
import { useProgress } from '@/context/ProgressContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { clearAllLocalData } from '@/lib/storage';
import { NotificationTime } from '@/types/user';

const goalLabels = {
  'build-fitness': '体力をつけたい',
  'improve-posture': '姿勢をよくしたい',
  'lose-weight': '痩せたい',
  'reduce-stiffness': '肩こり・腰の重さを減らしたい',
  'build-habit': 'まずは習慣化したい',
} as const;
const experienceLabels = { none: 'ほぼない', some: '少しある', before: '以前やっていた' } as const;
const toneLabels = { gentle: 'やさしく', friendly: '友達っぽく', calm: '淡々と' } as const;
const timeLabels: Record<NotificationTime, string> = { morning: '朝', noon: '昼', night: '夜' };

const badgeLabels: Record<string, string> = {
  'first-step': 'はじめの一歩',
  'streak-3': '3日継続',
  'lower-body-lv1': '下半身Lv1',
  comeback: '復帰できた',
};

export default function ProfileScreen() {
  const { progress, resetProgress } = useProgress();
  const { profile, resetProfile, setNotificationEnabled, setNotificationTime } = useUserProfile();

  const handleReset = () => {
    Alert.alert('データを初期化しますか？', 'オンボーディング回答と進捗データが削除されます。', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '初期化する', style: 'destructive', onPress: async () => {
          await clearAllLocalData();
          resetProgress();
          resetProfile();
          router.replace('/onboarding');
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <AppText variant="heading">プロフィール</AppText>
      <AppCard style={styles.cardGap}>
        <XPBadge xp={progress.totalXp} />
        <AppText>連続記録: {progress.streakDays}日</AppText>
        <AppText>完了レッスン数: {progress.completedLessonIds.length}件</AppText>
      </AppCard>

      <AppCard style={styles.cardGap}>
        <AppText variant="subheading">あなたの設定</AppText>
        <View style={styles.row}><AppText variant="caption">目的</AppText><AppText>{profile ? goalLabels[profile.fitnessGoal] : '未設定'}</AppText></View>
        <View style={styles.row}><AppText variant="caption">運動経験</AppText><AppText>{profile ? experienceLabels[profile.exerciseExperience] : '未設定'}</AppText></View>
        <View style={styles.row}><AppText variant="caption">使える時間</AppText><AppText>{profile ? `${profile.dailyTimeMinutes}分` : '未設定'}</AppText></View>
        <View style={styles.row}><AppText variant="caption">コーチの雰囲気</AppText><AppText>{profile ? toneLabels[profile.coachTone] : '未設定'}</AppText></View>
      </AppCard>


      <AppCard style={styles.cardGap}>
        <AppText variant="subheading">現在のプラン</AppText>
        <AppText>{profile?.plan === 'pro' ? 'Pro' : '無料'}</AppText>
        <AppButton title="Pro機能を見る" onPress={() => router.push('/paywall')} />
      </AppCard>

      <AppCard style={styles.cardGap}>
        <View style={styles.row}>
          <AppText variant="subheading">通知</AppText>
          <Switch value={profile?.notificationsEnabled ?? false} onValueChange={(value) => void setNotificationEnabled(value)} />
        </View>
        <AppText variant="caption">毎日の軽い運動をやさしくお知らせします。</AppText>
        <View style={styles.timeRow}>
          {(['morning', 'noon', 'night'] as NotificationTime[]).map((time) => (
            <AppButton key={time} title={timeLabels[time]} onPress={() => void setNotificationTime(time)} />
          ))}
        </View>
      </AppCard>

      <AppCard style={styles.cardGap}>
        <AppText variant="subheading">クラウド同期（準備中）</AppText>
        <AppText variant="caption">ログインは任意です。未ログインでも利用できます。</AppText>
        <AppButton title="ログイン画面を開く" onPress={() => router.push('/login')} />
      </AppCard>


      <AppCard style={styles.cardGap}>
        <AppText variant="subheading">バッジ</AppText>
        <AppText variant="caption">
          {progress.earnedBadges.length > 0
            ? progress.earnedBadges.map((b) => badgeLabels[b] ?? b).join(' / ')
            : 'まだバッジはありません'}
        </AppText>
      </AppCard>

      <AppCard style={styles.cardGap}>
        <AppText variant="subheading">安全に関する注意</AppText>
        <AppText variant="caption">このアプリは医療診断、治療、リハビリ指導を目的としたものではありません。痛み、めまい、息苦しさがある場合は運動を中止してください。持病、妊娠中、術後、医師から運動制限を受けている場合は、利用前に専門家へ相談してください。</AppText>
      </AppCard>

      <AppCard style={styles.cardGap}>
        <AppText variant="subheading">データ管理</AppText>
        <AppText variant="caption">危険な操作です。初期化すると元に戻せません。</AppText>
        <AppButton title="データを初期化" onPress={handleReset} />
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cardGap: { gap: theme.spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: theme.spacing.sm },
  timeRow: { gap: theme.spacing.xs },
});
