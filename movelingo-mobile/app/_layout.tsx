import { Stack } from 'expo-router';
import { ProgressProvider } from '@/context/ProgressContext';
import { UserProfileProvider } from '@/context/UserProfileContext';

export default function RootLayout() {
  return (
    <UserProfileProvider>
      <ProgressProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="paywall" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ProgressProvider>
    </UserProfileProvider>
  );
}
