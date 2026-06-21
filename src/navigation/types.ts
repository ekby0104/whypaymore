import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  HomeTab: undefined;
  ExploreTab: undefined;
  AlertTab: undefined;
  HistoryTab: undefined;
  MyTab: undefined;
};

export interface SearchQuery {
  tripType: '편도' | '왕복' | '다구간';
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  passengers: string;
  seatClass: string;
}

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  // 검색·구매
  FlightSearch: undefined;
  SearchResults: { query: SearchQuery };
  FlightDetail: { flightId?: string } | undefined;
  BookingConditions: undefined;
  // 알림
  AlertConditionSetup: undefined;
  AlertConditionEdit: { alertId?: string } | undefined;
  // 가격 인사이트
  PriceCalendar: undefined;
  PriceTrend: undefined;
  FlexibleDates: undefined;
  // 이력
  AlertHistoryDetail: { id?: string } | undefined;
  PushPermission: undefined;
  // 계정/설정
  AccountInfo: undefined;
  AlertListManage: undefined;
  AppSettings: undefined;
  // 온보딩/인증
  Splash: undefined;
  Onboarding: undefined;
  TermsAgreement: undefined;
  TermsDetail: { kind: 'terms' | 'privacy' };
  Login: undefined;
  SignUp: undefined;
  SocialLogin: undefined;
  EmailVerification: { email?: string } | undefined;
  PasswordReset: undefined;
  NewPassword: undefined;
  AuthError: {
    kind: 'invalid-input' | 'duplicate-email' | 'login-failed' | 'network' | 'social-cancel';
  };
};

export type AuthErrorKind = RootStackParamList['AuthError']['kind'];
