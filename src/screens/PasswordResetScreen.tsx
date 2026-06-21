import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { TextField } from '@/components/Input';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function PasswordResetScreen() {
  const nav = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  return (
    <>
      <Header title="비밀번호 재설정" onBack={() => nav.goBack()} />
      <Screen>
        <Text variant="title" weight="bold" style={{ marginVertical: spacing.lg }}>
          비밀번호를 잊으셨나요?
        </Text>
        <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.xl }}>
          가입한 이메일 주소를 입력하시면{'\n'}재설정 링크를 보내드립니다.
        </Text>

        <TextField
          label="이메일"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChangeText={setEmail}
        />

        <View style={{ height: spacing.xl }} />
        <Button
          label="재설정 메일 발송"
          full
          disabled={!email.includes('@')}
          onPress={() => nav.navigate('NewPassword')}
        />
      </Screen>
    </>
  );
}
