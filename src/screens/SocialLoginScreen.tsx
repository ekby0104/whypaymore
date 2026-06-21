import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { useAuth } from '@/auth/AuthContext';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const providers = ['Apple로 계속하기', 'Google로 계속하기', '카카오로 계속하기'];

export default function SocialLoginScreen() {
  const nav = useNavigation<Nav>();
  const { signIn } = useAuth();
  return (
    <>
      <Header title="소셜 로그인" onBack={() => nav.goBack()} />
      <Screen>
        <View style={{ alignItems: 'center', marginVertical: spacing.xxl }}>
          <Text variant="title" weight="bold">최저가 항공권 알림</Text>
          <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
            가장 저렴한 항공권을 놓치지 마세요
          </Text>
        </View>

        <View style={{ gap: spacing.sm }}>
          {providers.map((p) => (
            <Button
              key={p}
              label={p}
              variant="secondary"
              full
              onPress={() =>
                p.startsWith('카카오')
                  ? nav.navigate('AuthError', { kind: 'social-cancel' })
                  : signIn({ provider: p.split('로')[0] })
              }
            />
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl, gap: spacing.md }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          <Text variant="caption" color={colors.textMuted}>또는</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        </View>

        <Button label="이메일로 로그인" full onPress={() => nav.navigate('Login')} />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl, gap: spacing.xs }}>
          <Text variant="caption" color={colors.textSecondary}>계정이 없으신가요?</Text>
          <Text variant="caption" weight="semibold" color={colors.primary} onPress={() => nav.navigate('SignUp')}>
            회원가입
          </Text>
        </View>

        <Text variant="micro" color={colors.textMuted} center style={{ marginTop: spacing.xl }}>
          로그인함으로써 서비스 약관과 개인정보 처리방침에 동의하는 것으로 간주됩니다
        </Text>
      </Screen>
    </>
  );
}
