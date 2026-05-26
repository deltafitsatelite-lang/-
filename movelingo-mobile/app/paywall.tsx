import { router } from 'expo-router';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { FEATURE_LABELS, PLAN_FEATURES } from '@/lib/subscription';

export default function PaywallScreen() {
  return (
    <ScreenContainer>
      <AppText variant="heading">MoveLingo Pro（準備中）</AppText>
      <AppText variant="caption">現在はUIのみです。将来RevenueCatで課金導入予定です。</AppText>

      <AppCard>
        <AppText variant="subheading">無料プラン</AppText>
        {PLAN_FEATURES.free.map((feature) => (
          <AppText key={feature}>・{FEATURE_LABELS[feature]}</AppText>
        ))}
      </AppCard>

      <AppCard>
        <AppText variant="subheading">Proプラン</AppText>
        {PLAN_FEATURES.pro.map((feature) => (
          <AppText key={feature}>・{FEATURE_LABELS[feature]}</AppText>
        ))}
      </AppCard>

      <AppButton title="今は無料で続ける" onPress={() => router.back()} />
    </ScreenContainer>
  );
}
