import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Card } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { colors, spacing } from '@/theme';
import type { RootStackParamList, AuthErrorKind } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type R = RouteProp<RootStackParamList, 'AuthError'>;

const config: Record<AuthErrorKind, { emoji: string; title: string; desc: string; cta: string }> = {
  'invalid-input': {
    emoji: '⚠️',
    title: '입력 형식을 확인해 주세요',
    desc: '이메일 또는 비밀번호 형식이 올바르지 않습니다. 다시 입력해 주세요.',
    cta: '다시 입력',
  },
  'duplicate-email': {
    emoji: '📧',
    title: '이미 가입된 이메일입니다',
    desc: '해당 이메일로 가입된 계정이 있습니다. 로그인하거나 다른 이메일을 사용해 주세요.',
    cta: '로그인하러 가기',
  },
  'login-failed': {
    emoji: '🔒',
    title: '로그인에 실패했습니다',
    desc: '이메일 또는 비밀번호가 일치하지 않습니다. 다시 시도해 주세요.',
    cta: '다시 시도',
  },
  network: {
    emoji: '📡',
    title: '네트워크 오류',
    desc: '연결 상태가 불안정합니다. 네트워크를 확인하고 다시 시도해 주세요.',
    cta: '다시 시도',
  },
  'social-cancel': {
    emoji: '🚫',
    title: '소셜 로그인이 취소되었습니다',
    desc: '로그인이 완료되지 않았습니다. 다시 시도하거나 다른 방법으로 로그인해 주세요.',
    cta: '다시 시도',
  },
};

export default function AuthErrorScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<R>();
  const c = config[params.kind];
  return (
    <>
      <Header title="오류" onBack={() => nav.goBack()} />
      <Screen>
        <View style={{ alignItems: 'center', marginVertical: spacing.xxl }}>
          <Text style={{ fontSize: 56 }}>{c.emoji}</Text>
          <Text variant="title" weight="bold" center style={{ marginTop: spacing.lg }}>
            {c.title}
          </Text>
        </View>

        <Card>
          <Text variant="caption" color={colors.textSecondary} center>
            {c.desc}
          </Text>
        </Card>

        <View style={{ height: spacing.xxl }} />
        <Button
          label={c.cta}
          full
          onPress={() => (params.kind === 'duplicate-email' ? nav.navigate('Login') : nav.goBack())}
        />
      </Screen>
    </>
  );
}
