import { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/auth/AuthContext';
import { AlertsProvider } from '@/alerts/AlertsContext';
import { PreferencesProvider } from '@/prefs/PreferencesContext';

/** 테스트에서 안전영역 측정을 동기화하기 위한 고정 메트릭 (iPhone 기준) */
const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

/** 앱의 전역 Provider 들로 감싸 렌더링한다 (네비게이션은 테스트에서 목 처리) */
export function renderWithProviders(ui: ReactElement) {
  return render(
    <SafeAreaProvider initialMetrics={metrics}>
      <AuthProvider>
        <AlertsProvider>
          <PreferencesProvider>{ui}</PreferencesProvider>
        </AlertsProvider>
      </AuthProvider>
    </SafeAreaProvider>,
  );
}
