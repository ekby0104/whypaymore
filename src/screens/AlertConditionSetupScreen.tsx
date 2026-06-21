import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Section } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { TextField, Checkbox } from '@/components/Input';
import { PickerField } from '@/components/PickerField';
import { AIRPORTS, dateOptions, futureDate } from '@/data/options';
import { useAlerts } from '@/alerts/AlertsContext';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const toNumber = (s: string) => parseInt(s.replace(/[^0-9]/g, ''), 10) || 0;

export default function AlertConditionSetupScreen() {
  const nav = useNavigation<Nav>();
  const { addAlert } = useAlerts();
  const [from, setFrom] = useState('인천 (ICN)');
  const [to, setTo] = useState('뉴욕 (JFK)');
  const [departDate, setDepartDate] = useState(futureDate(14));
  const [returnDate, setReturnDate] = useState(futureDate(21));
  const [price, setPrice] = useState('');
  const [allowStop, setAllowStop] = useState(false);

  const save = () => {
    addAlert({
      from,
      to,
      targetPrice: toNumber(price),
      tripType: '왕복',
      departDate,
      returnDate,
      passengers: '성인 1명',
      seatClass: '이코노미',
    });
    nav.goBack();
  };

  return (
    <>
      <Header title="알림 조건 설정" onBack={() => nav.goBack()} />
      <Screen>
        <Section title="구간 설정">
          <View style={{ gap: spacing.md }}>
            <PickerField label="출발지 (도시 또는 공항)" value={from} options={AIRPORTS} onSelect={setFrom} />
            <PickerField label="도착지 (도시 또는 공항)" value={to} options={AIRPORTS} onSelect={setTo} />
          </View>
        </Section>

        <Section title="날짜 설정">
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <PickerField label="출발일" value={departDate} options={dateOptions(1)} onSelect={setDepartDate} />
            </View>
            <View style={{ flex: 1 }}>
              <PickerField label="귀국일" value={returnDate} options={dateOptions(1)} onSelect={setReturnDate} />
            </View>
          </View>
        </Section>

        <Section title="가격 조건">
          <View style={{ gap: spacing.md }}>
            <TextField
              label="목표 가격 (원)"
              placeholder="950,000"
              keyboardType="number-pad"
              value={price}
              onChangeText={setPrice}
            />
            <Checkbox checked={allowStop} onToggle={() => setAllowStop((v) => !v)} label="경유 허용" />
          </View>
        </Section>

        <View style={{ gap: spacing.sm }}>
          <Button label="알림 저장" full disabled={toNumber(price) === 0} onPress={save} />
          <Button label="조건 초기화" variant="default" full onPress={() => setPrice('')} />
        </View>
        <Text variant="micro" color={colors.textMuted} style={{ marginTop: spacing.md }}>
          목표 가격 이하로 떨어지면 푸시 알림으로 알려드립니다.
        </Text>
      </Screen>
    </>
  );
}
