import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { TextField } from '@/components/Input';
import { useAuth } from '@/auth/AuthContext';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const nav = useNavigation<Nav>();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const login = () => {
    if (!email.includes('@') || pw.length === 0) {
      nav.navigate('AuthError', { kind: 'invalid-input' });
      return;
    }
    // 데모: 비밀번호 '0000' 이면 로그인 실패 화면
    if (pw === '0000') {
      nav.navigate('AuthError', { kind: 'login-failed' });
      return;
    }
    signIn({ email });
  };

  return (
    <>
      <Header title="로그인" onBack={() => nav.goBack()} />
      <Screen>
        <View style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
          <Text variant="title" weight="bold">최저가 항공권 알림</Text>
          <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
            원하는 노선의 최저가를 놓치지 마세요.
          </Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <TextField label="이메일" type="email" placeholder="example@email.com" value={email} onChangeText={setEmail} />
          <TextField label="비밀번호" type="password" placeholder="비밀번호 입력" value={pw} onChangeText={setPw} />
        </View>

        <View style={{ alignItems: 'flex-end', marginTop: spacing.sm }}>
          <Text variant="micro" color={colors.textSecondary} onPress={() => nav.navigate('PasswordReset')}>
            비밀번호를 잊으셨나요?
          </Text>
        </View>

        <View style={{ height: spacing.lg }} />
        <Button label="로그인" full onPress={login} />
        <View style={{ height: spacing.sm }} />
        <Button label="소셜 계정으로 로그인" variant="secondary" full onPress={() => nav.navigate('SocialLogin')} />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl, gap: spacing.xs }}>
          <Text variant="caption" color={colors.textSecondary}>아직 계정이 없으신가요?</Text>
          <Text variant="caption" weight="semibold" color={colors.primary} onPress={() => nav.navigate('SignUp')}>
            회원가입
          </Text>
        </View>
      </Screen>
    </>
  );
}
