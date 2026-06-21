import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Card } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { useAuth } from '@/auth/AuthContext';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type R = RouteProp<RootStackParamList, 'EmailVerification'>;

export default function EmailVerificationScreen() {
  const nav = useNavigation<Nav>();
  const { signIn } = useAuth();
  const route = useRoute<R>();
  const email = route.params?.email ?? 'example@email.com';
  return (
    <>
      <Header title="이메일 인증" onBack={() => nav.goBack()} />
      <Screen>
        <View style={{ alignItems: 'center', marginVertical: spacing.xxl }}>
          <Text style={{ fontSize: 56 }}>📩</Text>
          <Text variant="title" weight="bold" center style={{ marginTop: spacing.lg }}>
            인증 메일을 보냈어요
          </Text>
        </View>

        <Card>
          <Text variant="caption" color={colors.textSecondary} center>
            아래 주소로 인증 링크를 발송했습니다.{'\n'}메일을 확인하고 인증을 완료해 주세요.
          </Text>
          <Text variant="body" weight="semibold" center style={{ marginTop: spacing.sm }}>
            {email}
          </Text>
        </Card>

        <View style={{ height: spacing.xxl }} />
        <View style={{ gap: spacing.sm }}>
          <Button label="인증을 완료했어요" full onPress={() => signIn({ email })} />
          <Button
            label="인증 메일 재발송"
            variant="secondary"
            full
            onPress={() => nav.navigate('AuthError', { kind: 'network' })}
          />
        </View>
        <Text variant="micro" color={colors.textMuted} center style={{ marginTop: spacing.lg }}>
          메일이 오지 않았다면 스팸함을 확인하거나 재발송해 주세요.
        </Text>
      </Screen>
    </>
  );
}
