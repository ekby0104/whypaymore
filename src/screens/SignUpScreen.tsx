import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { TextField, Checkbox } from '@/components/Input';
import { spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SignUpScreen() {
  const nav = useNavigation<Nav>();
  const [agree, setAgree] = useState(false);
  const [email, setEmail] = useState('');

  const signUp = () => {
    // 데모: 이미 가입된 이메일이면 오류 화면
    if (email === 'used@email.com') {
      nav.navigate('AuthError', { kind: 'duplicate-email' });
      return;
    }
    nav.replace('EmailVerification', { email });
  };

  return (
    <>
      <Header title="회원가입" onBack={() => nav.goBack()} />
      <Screen>
        <Text variant="title" weight="bold" style={{ marginVertical: spacing.lg }}>
          계정 생성
        </Text>

        <View style={{ gap: spacing.md }}>
          <TextField label="이메일" type="email" placeholder="example@email.com" value={email} onChangeText={setEmail} />
          <TextField label="비밀번호" type="password" placeholder="8자 이상" />
          <TextField label="비밀번호 확인" type="password" placeholder="비밀번호 재입력" />
        </View>

        <View style={{ height: spacing.xl }} />
        <Checkbox
          checked={agree}
          onToggle={() => setAgree((v) => !v)}
          label="최저가 항공권 알림 서비스 이용약관에 동의합니다"
        />

        <View style={{ height: spacing.xl }} />
        <Button label="회원가입" full disabled={!agree || !email.includes('@')} onPress={signUp} />
      </Screen>
    </>
  );
}
