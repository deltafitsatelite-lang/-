import * as Notifications from 'expo-notifications';
import { NotificationTime } from '@/types/user';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const MESSAGES = [
  '今日の3分、身体を少しだけ進めましょう',
  '完璧じゃなくて大丈夫。1レッスンだけどうですか？',
  '今日のMoveLingoが待っています',
];

function timeToHour(time: NotificationTime): number {
  if (time === 'morning') return 8;
  if (time === 'noon') return 12;
  return 20;
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted) return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch {
    return false;
  }
}

export async function scheduleDailyNotification(time: NotificationTime): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const hour = timeToHour(time);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'MoveLingo',
        body: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
    });
  } catch {
    // keep app usable even if scheduling fails
  }
}

export async function cancelDailyNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore
  }
}
