import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Section, Card, Row } from '@/components/layout';
import Text from '@/components/Text';
import { Toggle } from '@/components/Input';
import { useAuth } from '@/auth/AuthContext';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function AccountInfoScreen() {
  const nav = useNavigation<Nav>();
  const { user, signOut } = useAuth();
  const [twoFactor, setTwoFactor] = useState(false);
  const [push, setPush] = useState(true);
  return (
    <>
      <Header title="계정 정보" onBack={() => nav.goBack()} />
      <Screen>
        <Section title="프로필 정보">
          <Card>
            <Row label="사용자 이름" value="홍길동" />
            <Row label="이메일" value={user?.email ?? (user?.provider ? `${user.provider} 계정` : 'example@email.com')} />
          </Card>
        </Section>

        <Section title="보안 설정">
          <Card>
            <Row label="비밀번호" value="변경" valueColor={colors.primary} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xs }}>
              <Text variant="caption" color={colors.textSecondary}>이중 인증</Text>
              <Toggle on={twoFactor} onToggle={() => setTwoFactor((v) => !v)} />
            </View>
          </Card>
        </Section>

        <Section title="알림 설정">
          <Card>
            <Row label="가격 하락 알림" value="ON" valueColor={colors.success} />
            <Row label="예약 리마인더" value="OFF" valueColor={colors.textMuted} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xs }}>
              <Text variant="caption" color={colors.textSecondary}>푸시 알림</Text>
              <Toggle on={push} onToggle={() => setPush((v) => !v)} />
            </View>
          </Card>
        </Section>

        <Section title="앱 정보">
          <Card>
            <Row label="버전" value="1.2.3" />
            <Row label="이용약관" value="보기" valueColor={colors.primary} />
            <Row label="개인정보처리방침" value="보기" valueColor={colors.primary} />
            <Row label="로그아웃" value="›" valueColor={colors.textMuted} onPress={signOut} />
          </Card>
        </Section>
      </Screen>
    </>
  );
}
