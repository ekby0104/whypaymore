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

export default function NewPasswordScreen() {
  const nav = useNavigation<Nav>();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const valid = pw.length >= 8 && pw === confirm;
  return (
    <>
      <Header title="새 비밀번호" onBack={() => nav.goBack()} />
      <Screen>
        <Text variant="title" weight="bold" style={{ marginVertical: spacing.lg }}>
          새 비밀번호를 설정하세요
        </Text>

        <View style={{ gap: spacing.md }}>
          <TextField label="새 비밀번호" type="password" placeholder="8자 이상" value={pw} onChangeText={setPw} />
          <TextField label="비밀번호 확인" type="password" placeholder="비밀번호 재입력" value={confirm} onChangeText={setConfirm} />
        </View>

        {confirm.length > 0 && pw !== confirm ? (
          <Text variant="micro" color={colors.danger} style={{ marginTop: spacing.sm }}>
            비밀번호가 일치하지 않습니다.
          </Text>
        ) : null}

        <View style={{ height: spacing.xl }} />
        <Button
          label="비밀번호 변경 완료"
          full
          disabled={!valid}
          onPress={() => nav.navigate('Login')}
        />
      </Screen>
    </>
  );
}
