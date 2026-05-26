import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useUserProfile } from '@/context/UserProfileContext';
import { useProgress } from '@/context/ProgressContext';
import { theme } from '@/constants/theme';

export default function IndexScreen() {
  const { onboardingCompleted, isLoadingProfile } = useUserProfile();
  const { isLoadingProgress } = useProgress();

  if (isLoadingProfile || isLoadingProgress) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <Redirect href={onboardingCompleted ? '/(tabs)/home' : '/onboarding'} />;
}
