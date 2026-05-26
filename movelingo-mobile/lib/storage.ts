import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressState } from '@/types/progress';
import { UserProfile } from '@/types/user';

const USER_PROFILE_KEY = 'movelingo:userProfile';
const PROGRESS_KEY = 'movelingo:progress';

export async function loadUserProfile(): Promise<UserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore storage errors to avoid crashing app
  }
}

export async function clearUserProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  } catch {
    // ignore
  }
}

export async function loadProgress(): Promise<ProgressState | null> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProgressState;
  } catch {
    return null;
  }
}

export async function saveProgress(progress: ProgressState): Promise<void> {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

export async function clearProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PROGRESS_KEY);
  } catch {
    // ignore
  }
}

export async function clearAllLocalData(): Promise<void> {
  await Promise.all([clearUserProfile(), clearProgress()]);
}
