import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@/auth/AuthContext';
import { AlertsProvider } from '@/alerts/AlertsContext';
import { PreferencesProvider } from '@/prefs/PreferencesContext';
import RootNavigator from '@/navigation/RootNavigator';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function renderApp() {
  return render(
    <SafeAreaProvider initialMetrics={metrics}>
      <AuthProvider>
        <AlertsProvider>
          <PreferencesProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </PreferencesProvider>
        </AlertsProvider>
      </AuthProvider>
    </SafeAreaProvider>,
  );
}

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('인증 흐름 (통합)', () => {
  it('온보딩 완료·비로그인 상태에서는 로그인 화면을 보여준다', async () => {
    await AsyncStorage.setItem('@wpm/onboarded', 'true');
    renderApp();
    expect(await screen.findByText('아직 계정이 없으신가요?')).toBeTruthy();
  });

  it('로그인하면 홈 화면으로 진입한다', async () => {
    await AsyncStorage.setItem('@wpm/onboarded', 'true');
    renderApp();

    await screen.findByText('아직 계정이 없으신가요?');
    fireEvent.changeText(screen.getByPlaceholderText('example@email.com'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('비밀번호 입력'), 'password');

    // 헤더 타이틀과 버튼이 모두 '로그인' 이므로 마지막(버튼)을 누른다
    const loginEls = screen.getAllByText('로그인');
    fireEvent.press(loginEls[loginEls.length - 1]);

    expect(await screen.findByText('어디로 떠나실 건가요?')).toBeTruthy();
  });

  it('저장된 세션이 있으면 시작 시 바로 홈으로 진입한다 (세션 복원)', async () => {
    await AsyncStorage.setItem('@wpm/onboarded', 'true');
    await AsyncStorage.setItem('@wpm/user', JSON.stringify({ email: 'saved@example.com' }));
    renderApp();

    expect(await screen.findByText('어디로 떠나실 건가요?')).toBeTruthy();
  });

  it('로그아웃하면 인증 화면으로 돌아간다', async () => {
    await AsyncStorage.setItem('@wpm/onboarded', 'true');
    await AsyncStorage.setItem('@wpm/user', JSON.stringify({ email: 'saved@example.com' }));
    renderApp();
    await screen.findByText('어디로 떠나실 건가요?'); // 홈

    fireEvent.press(screen.getAllByText('마이')[0]); // 마이 탭
    fireEvent.press(await screen.findByText('계정 정보 관리')); // 계정 정보 화면
    fireEvent.press(await screen.findByText('로그아웃')); // signOut

    // 비로그인 그룹으로 전환 → 로그인 화면
    expect(await screen.findByText('아직 계정이 없으신가요?')).toBeTruthy();
  });
});
