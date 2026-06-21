import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  email?: string;
  provider?: string;
}

interface AuthState {
  user: AuthUser | null;
  hasOnboarded: boolean;
  isLoading: boolean;
  signIn: (user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const USER_KEY = '@wpm/user';
const ONBOARD_KEY = '@wpm/onboarded';

const AuthCtx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isLoading, setLoading] = useState(true);

  // 앱 시작 시 저장된 세션 복원
  useEffect(() => {
    (async () => {
      try {
        const [u, o] = await Promise.all([
          AsyncStorage.getItem(USER_KEY),
          AsyncStorage.getItem(ONBOARD_KEY),
        ]);
        if (u) setUser(JSON.parse(u));
        if (o === 'true') setHasOnboarded(true);
      } catch {
        // 저장소 읽기 실패 시 비로그인 상태로 시작
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (u: AuthUser) => {
    setUser(u);
    setHasOnboarded(true);
    await AsyncStorage.multiSet([
      [USER_KEY, JSON.stringify(u)],
      [ONBOARD_KEY, 'true'],
    ]);
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(USER_KEY);
  }, []);

  const completeOnboarding = useCallback(async () => {
    setHasOnboarded(true);
    await AsyncStorage.setItem(ONBOARD_KEY, 'true');
  }, []);

  return (
    <AuthCtx.Provider value={{ user, hasOnboarded, isLoading, signIn, signOut, completeOnboarding }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
