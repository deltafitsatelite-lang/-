import { useState } from 'react';
import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { TextInput, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const signInWithMagicLink = async () => {
    if (!supabase) return setMessage('Supabase未設定です。ローカル利用はそのまま可能です。');
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: 'movelingo://'} });
    setMessage(error ? `送信失敗: ${error.message}` : 'メールを送信しました。リンクを確認してください。');
  };

  const signInWithPassword = async () => {
    if (!supabase) return setMessage('Supabase未設定です。ローカル利用はそのまま可能です。');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? `ログイン失敗: ${error.message}` : 'ログインしました。');
  };

  return (
    <ScreenContainer>
      <AppText variant="heading">ログイン（任意）</AppText>
      <AppText variant="caption">未ログインでもアプリは利用できます。ログインすると将来のクラウド同期に対応しやすくなります。</AppText>

      <AppCard style={styles.card}>
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Password（任意）" secureTextEntry style={styles.input} />
        <AppButton title="Magic Linkを送る" onPress={() => void signInWithMagicLink()} />
        <AppButton title="Email/Passwordでログイン" onPress={() => void signInWithPassword()} />
        <AppText variant="caption">{isSupabaseConfigured ? 'Supabase接続: 有効' : 'Supabase接続: 未設定'}</AppText>
        {!!message && <AppText variant="caption">{message}</AppText>}
      </AppCard>

      <AppButton title="ログインせずに戻る" onPress={() => router.replace('/(tabs)/home')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { gap: theme.spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
});
