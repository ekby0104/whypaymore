/**
 * 로컬 알림(expo-notifications) 래퍼.
 * Expo Go 등 환경에 따라 동작이 제한될 수 있어 모든 호출을 방어적으로 감싼다.
 */
import * as Notifications from 'expo-notifications';

// 포그라운드에서도 배너를 표시
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted') return true;
    const req = await Notifications.requestPermissionsAsync();
    return req.status === 'granted';
  } catch {
    return false;
  }
}

/** 즉시 로컬 알림 발송 (best-effort) */
export async function sendLocalNotification(title: string, body: string): Promise<void> {
  try {
    if (!(await ensureNotificationPermission())) return;
    await Notifications.scheduleNotificationAsync({ content: { title, body }, trigger: null });
  } catch {
    // 무시: 알림 미지원 환경이어도 앱 내 반영은 별도로 처리됨
  }
}
