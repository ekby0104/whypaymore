import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Section, Card, Row } from '@/components/layout';
import Text from '@/components/Text';
import { Toggle } from '@/components/Input';
import { useAuth } from '@/auth/AuthContext';
import { usePreferences } from '@/prefs/PreferencesContext';
import { colors, spacing } from '@/theme';
import { setFailureRate, FAILURE_RATE } from '@/services/api';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const themeLabel = { auto: '자동', light: '라이트', dark: '다크' } as const;
const nextTheme = { auto: 'light', light: 'dark', dark: 'auto' } as const;

export default function AppSettingsScreen() {
  const nav = useNavigation<Nav>();
  const { user } = useAuth();
  const { prefs, update } = usePreferences();
  const [failSim, setFailSim] = useState(FAILURE_RATE > 0);
  return (
    <>
      <Header title="설정" onBack={() => nav.goBack()} />
      <Screen>
        <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <View style={{ flex: 1, paddingRight: spacing.md }}>
            <Text variant="heading" weight="semibold">푸시 알림 권한</Text>
            <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
              최저 가격 발견 시 즉시 알림을 받으세요
            </Text>
          </View>
          <Toggle on={prefs.pushPermission} onToggle={() => update({ pushPermission: !prefs.pushPermission })} accessibilityLabel="푸시 알림 권한" />
        </Card>

        <Section title="알림 설정">
          <Card>
            <Row label="알림 수신 빈도" value="1일 최대 3회" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xs }}>
              <Text variant="caption" color={colors.textSecondary}>주말 알림 (특가 알림만)</Text>
              <Toggle on={prefs.weekendSpecialOnly} onToggle={() => update({ weekendSpecialOnly: !prefs.weekendSpecialOnly })} accessibilityLabel="주말 알림" />
            </View>
          </Card>
        </Section>

        <Section title="표시 설정">
          <Card>
            <Row
              label="통화 단위"
              value={prefs.currency === 'KRW' ? 'KRW (₩)' : 'USD ($)'}
              valueColor={colors.primary}
              onPress={() => update({ currency: prefs.currency === 'KRW' ? 'USD' : 'KRW' })}
            />
            <Row label="출발지 기본값" value={prefs.defaultOrigin} />
            <Row
              label="테마"
              value={themeLabel[prefs.theme]}
              valueColor={colors.primary}
              onPress={() => update({ theme: nextTheme[prefs.theme] })}
            />
          </Card>
        </Section>

        <Section title="계정">
          <Card>
            <Row label="이메일" value={user?.email ?? (user?.provider ? `${user.provider} 계정` : 'user@example.com')} />
            <Row label="로그인 상태" value="연결됨" valueColor={colors.success} />
            <Row label="계정 삭제" value="" valueColor={colors.danger} />
          </Card>
        </Section>

        {__DEV__ ? (
          <Section title="개발자">
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, paddingRight: spacing.md }}>
                  <Text variant="caption" weight="medium">네트워크 오류 시뮬레이션</Text>
                  <Text variant="micro" color={colors.textMuted} style={{ marginTop: 2 }}>
                    켜면 검색·이력 등 API 호출이 실패해 에러/재시도 UI를 확인할 수 있어요
                  </Text>
                </View>
                <Toggle
                  on={failSim}
                  onToggle={() => {
                    const next = !failSim;
                    setFailSim(next);
                    setFailureRate(next ? 1 : 0);
                  }}
                />
              </View>
            </Card>
          </Section>
        ) : null}
      </Screen>
    </>
  );
}
