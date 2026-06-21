import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { useAuth } from '@/auth/AuthContext';
import TabNavigator from './TabNavigator';

import FlightSearchScreen from '@/screens/FlightSearchScreen';
import SearchResultsScreen from '@/screens/SearchResultsScreen';
import FlightDetailScreen from '@/screens/FlightDetailScreen';
import BookingConditionsScreen from '@/screens/BookingConditionsScreen';
import AlertConditionSetupScreen from '@/screens/AlertConditionSetupScreen';
import AlertConditionEditScreen from '@/screens/AlertConditionEditScreen';
import PriceCalendarScreen from '@/screens/PriceCalendarScreen';
import PriceTrendScreen from '@/screens/PriceTrendScreen';
import FlexibleDatesScreen from '@/screens/FlexibleDatesScreen';
import AlertHistoryDetailScreen from '@/screens/AlertHistoryDetailScreen';
import PushPermissionScreen from '@/screens/PushPermissionScreen';
import AccountInfoScreen from '@/screens/AccountInfoScreen';
import AlertListManageScreen from '@/screens/AlertListManageScreen';
import AppSettingsScreen from '@/screens/AppSettingsScreen';
import LoginScreen from '@/screens/LoginScreen';
import SignUpScreen from '@/screens/SignUpScreen';
import SocialLoginScreen from '@/screens/SocialLoginScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import TermsAgreementScreen from '@/screens/TermsAgreementScreen';
import TermsDetailScreen from '@/screens/TermsDetailScreen';
import EmailVerificationScreen from '@/screens/EmailVerificationScreen';
import PasswordResetScreen from '@/screens/PasswordResetScreen';
import NewPasswordScreen from '@/screens/NewPasswordScreen';
import AuthErrorScreen from '@/screens/AuthErrorScreen';
import SplashScreen from '@/screens/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, hasOnboarded, isLoading } = useAuth();

  // 저장된 세션 복원 중에는 스플래시 표시
  if (isLoading) return <SplashScreen />;

  const initialRoute = user ? 'Tabs' : hasOnboarded ? 'Login' : 'Onboarding';

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      {user ? (
        // 로그인 상태: 앱 화면
        <Stack.Group>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="FlightSearch" component={FlightSearchScreen} />
          <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
          <Stack.Screen name="FlightDetail" component={FlightDetailScreen} />
          <Stack.Screen name="BookingConditions" component={BookingConditionsScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="AlertConditionSetup" component={AlertConditionSetupScreen} />
          <Stack.Screen name="AlertConditionEdit" component={AlertConditionEditScreen} />
          <Stack.Screen name="PriceCalendar" component={PriceCalendarScreen} />
          <Stack.Screen name="PriceTrend" component={PriceTrendScreen} />
          <Stack.Screen name="FlexibleDates" component={FlexibleDatesScreen} />
          <Stack.Screen name="AlertHistoryDetail" component={AlertHistoryDetailScreen} />
          <Stack.Screen name="PushPermission" component={PushPermissionScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
          <Stack.Screen name="AlertListManage" component={AlertListManageScreen} />
          <Stack.Screen name="AppSettings" component={AppSettingsScreen} />
        </Stack.Group>
      ) : (
        // 비로그인 상태: 온보딩/인증 화면
        // Login 을 먼저 둔다 — 그룹 전환(로그아웃) 시 첫 화면으로 진입하기 때문.
        // 최초 실행(미온보딩)은 initialRouteName='Onboarding' 으로 처리된다.
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SocialLogin" component={SocialLoginScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="TermsAgreement" component={TermsAgreementScreen} />
          <Stack.Screen name="TermsDetail" component={TermsDetailScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
          <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
          <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
          <Stack.Screen name="AuthError" component={AuthErrorScreen} options={{ presentation: 'modal' }} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
