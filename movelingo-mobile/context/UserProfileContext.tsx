import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { loadUserProfile, saveUserProfile } from '@/lib/storage';
import { UserProfile, NotificationTime } from '@/types/user';
import { cancelDailyNotifications, requestNotificationPermission, scheduleDailyNotification } from '@/lib/notifications';

type UserProfileContextValue = {
  profile: UserProfile | null;
  onboardingCompleted: boolean;
  isLoadingProfile: boolean;
  completeOnboarding: (profile: UserProfile) => Promise<void>;
  resetProfile: () => void;
  setNotificationEnabled: (enabled: boolean) => Promise<void>;
  setNotificationTime: (time: NotificationTime) => Promise<void>;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await loadUserProfile();
      if (saved) setProfile({ ...saved, plan: saved.plan ?? 'free' });
      setIsLoadingProfile(false);
    })();
  }, []);

  const value = useMemo<UserProfileContextValue>(
    () => ({
      profile,
      onboardingCompleted: profile !== null,
      isLoadingProfile,
      completeOnboarding: async (nextProfile: UserProfile) => {
        const granted = await requestNotificationPermission();
        const finalProfile: UserProfile = {
          ...nextProfile,
          notificationsEnabled: granted,
        };
        setProfile(finalProfile);
        await saveUserProfile(finalProfile);
        if (granted) {
          await scheduleDailyNotification(finalProfile.notificationTime);
        }
      },
      resetProfile: () => {
        setProfile(null);
      },
      setNotificationEnabled: async (enabled: boolean) => {
        if (!profile) return;
        let finalEnabled = enabled;
        if (enabled) {
          const granted = await requestNotificationPermission();
          finalEnabled = granted;
          if (granted) await scheduleDailyNotification(profile.notificationTime);
        } else {
          await cancelDailyNotifications();
        }
        const next = { ...profile, notificationsEnabled: finalEnabled };
        setProfile(next);
        await saveUserProfile(next);
      },
      setNotificationTime: async (time: NotificationTime) => {
        if (!profile) return;
        const next = { ...profile, notificationTime: time };
        setProfile(next);
        await saveUserProfile(next);
        if (next.notificationsEnabled) {
          await scheduleDailyNotification(time);
        }
      },
    }),
    [isLoadingProfile, profile],
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used inside UserProfileProvider');
  }
  return context;
}
