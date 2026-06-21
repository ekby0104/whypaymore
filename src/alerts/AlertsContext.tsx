import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PriceAlert {
  id: string;
  from: string;
  to: string;
  targetPrice: number;
  tripType: '편도' | '왕복';
  departDate?: string;
  returnDate?: string;
  passengers?: string;
  seatClass?: string;
  active: boolean;
  createdAt: string;
  /** 마지막 가격 확인 결과 */
  lastCheckedPrice?: number;
  lastCheckedAt?: string;
  /** 마지막 확인에서 목표가 도달 여부 */
  reached?: boolean;
  /** 마지막으로 알림을 보낸 가격 (중복 알림 방지) */
  lastNotifiedPrice?: number;
}

const KEY = '@wpm/alerts';

const today = () => new Date().toISOString().slice(0, 10).replace(/-/g, '.');

const seed: PriceAlert[] = [
  {
    id: 'a1', from: '인천 (ICN)', to: '도쿄 나리타 (NRT)', targetPrice: 150000,
    tripType: '왕복', departDate: '2025.08.01', returnDate: '2025.08.07',
    passengers: '성인 2명', seatClass: '이코노미', active: true, createdAt: '2025.06.01',
  },
  {
    id: 'a2', from: '인천 (ICN)', to: '오사카 (KIX)', targetPrice: 130000,
    tripType: '편도', departDate: '2025.09.10',
    passengers: '성인 1명', seatClass: '이코노미', active: true, createdAt: '2025.06.10',
  },
];

type NewAlert = Omit<PriceAlert, 'id' | 'createdAt' | 'active'> & { active?: boolean };

interface AlertsState {
  alerts: PriceAlert[];
  addAlert: (a: NewAlert) => void;
  updateAlert: (id: string, patch: Partial<PriceAlert>) => void;
  togglePause: (id: string) => void;
  removeAlert: (id: string) => void;
  getAlert: (id: string) => PriceAlert | undefined;
}

const AlertsCtx = createContext<AlertsState | undefined>(undefined);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<PriceAlert[]>(seed);
  const [loaded, setLoaded] = useState(false);

  // 복원
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setAlerts(JSON.parse(raw));
      } catch {
        // 무시: seed 유지
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // 변경 시 저장
  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEY, JSON.stringify(alerts)).catch(() => {});
  }, [alerts, loaded]);

  const addAlert = useCallback((a: NewAlert) => {
    setAlerts((prev) => [
      { ...a, id: Date.now().toString(36), active: a.active ?? true, createdAt: today() },
      ...prev,
    ]);
  }, []);

  const updateAlert = useCallback((id: string, patch: Partial<PriceAlert>) => {
    setAlerts((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const togglePause = useCallback((id: string) => {
    setAlerts((prev) => prev.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const getAlert = useCallback((id: string) => alerts.find((x) => x.id === id), [alerts]);

  return (
    <AlertsCtx.Provider value={{ alerts, addAlert, updateAlert, togglePause, removeAlert, getAlert }}>
      {children}
    </AlertsCtx.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertsCtx);
  if (!ctx) throw new Error('useAlerts must be used within AlertsProvider');
  return ctx;
}
