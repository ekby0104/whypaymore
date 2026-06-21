import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Card, Divider } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { Checkbox } from '@/components/Input';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const items = [
  { key: 'age', label: '[필수] 만 14세 이상입니다', required: true, detail: null },
  { key: 'terms', label: '[필수] 서비스 이용약관 동의', required: true, detail: 'terms' as const },
  { key: 'privacy', label: '[필수] 개인정보 수집·이용 동의', required: true, detail: 'privacy' as const },
  { key: 'marketing', label: '[선택] 마케팅 정보 수신 동의', required: false, detail: null },
];

export default function TermsAgreementScreen() {
  const nav = useNavigation<Nav>();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const allOn = items.every((it) => checked[it.key]);
  const requiredOk = items.filter((it) => it.required).every((it) => checked[it.key]);

  const toggleAll = () => {
    const v = !allOn;
    setChecked(Object.fromEntries(items.map((it) => [it.key, v])));
  };
  const toggle = (k: string) => setChecked((c) => ({ ...c, [k]: !c[k] }));

  return (
    <>
      <Header title="약관 동의" onBack={() => nav.goBack()} />
      <Screen>
        <Text variant="title" weight="bold" style={{ marginVertical: spacing.lg }}>
          서비스 이용을 위해{'\n'}약관에 동의해 주세요
        </Text>

        <Card>
          <Checkbox checked={allOn} label="전체 동의" onToggle={toggleAll} />
          <Divider />
          <View style={{ gap: spacing.md }}>
            {items.map((it) => (
              <View key={it.key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Checkbox
                    checked={!!checked[it.key]}
                    label={it.label}
                    onToggle={() => toggle(it.key)}
                  />
                </View>
                {it.detail ? (
                  <Text
                    variant="micro"
                    color={colors.textMuted}
                    onPress={() => nav.navigate('TermsDetail', { kind: it.detail! })}
                  >
                    보기 ›
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        </Card>

        <View style={{ height: spacing.xl }} />
        <Button
          label="동의하고 계속"
          full
          disabled={!requiredOk}
          onPress={() => nav.replace('SocialLogin')}
        />
      </Screen>
    </>
  );
}
