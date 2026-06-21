import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Preferences {
  /** 전체 알림 활성화 */
  allAlerts: boolean;
  /** 알림 유형별 */
  types: { lowest: boolean; change: boolean; deadline: boolean; weekly: boolean };
  /** 알림 채널 */
  channels: { push: boolean; email: boolean; inApp: boolean };
  /** 앱 설정 */
  pushPermission: boolean;
  weekendSpecialOnly: boolean;
  currency: 'KRW' | 'USD';
  defaultOrigin: string;
  theme: 'auto' | 'light' | 'dark';
}

export const defaultPrefs: Preferences = {
  allAlerts: true,
  types: { lowest: true, change: true, deadline: false, weekly: true },
  channels: { push: true, email: true, inApp: false },
  pushPermission: true,
  weekendSpecialOnly: false,
  currency: 'KRW',
  defaultOrigin: '인천 (ICN)',
  theme: 'auto',
};

const KEY = '@wpm/prefs';

interface PrefsState {
  prefs: Preferences;
  update: (patch: Partial<Preferences>) => void;
  toggleType: (k: keyof Preferences['types']) => void;
  toggleChannel: (k: keyof Preferences['channels']) => void;
}

const PrefsCtx = createContext<PrefsState | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(defaultPrefs);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setPrefs({ ...defaultPrefs, ...JSON.parse(raw) });
      } catch {
        // 기본값 유지
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEY, JSON.stringify(prefs)).catch(() => {});
  }, [prefs, loaded]);

  const update = useCallback((patch: Partial<Preferences>) => {
    setPrefs((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleType = useCallback((k: keyof Preferences['types']) => {
    setPrefs((prev) => ({ ...prev, types: { ...prev.types, [k]: !prev.types[k] } }));
  }, []);

  const toggleChannel = useCallback((k: keyof Preferences['channels']) => {
    setPrefs((prev) => ({ ...prev, channels: { ...prev.channels, [k]: !prev.channels[k] } }));
  }, []);

  return (
    <PrefsCtx.Provider value={{ prefs, update, toggleType, toggleChannel }}>
      {children}
    </PrefsCtx.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PrefsCtx);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
