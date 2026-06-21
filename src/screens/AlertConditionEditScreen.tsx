import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Divider } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { TextField, Toggle } from '@/components/Input';
import { PickerField } from '@/components/PickerField';
import { AIRPORTS, dateOptions, TRIP_TYPES } from '@/data/options';
import { useAlerts } from '@/alerts/AlertsContext';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type R = RouteProp<RootStackParamList, 'AlertConditionEdit'>;

const toNumber = (s: string) => parseInt(s.replace(/[^0-9]/g, ''), 10) || 0;

export default function AlertConditionEditScreen() {
  const nav = useNavigation<Nav>();
  const { getAlert, updateAlert } = useAlerts();
  const id = useRoute<R>().params?.alertId;
  const alert = id ? getAlert(id) : undefined;

  const [from, setFrom] = useState(alert?.from ?? '인천 (ICN)');
  const [to, setTo] = useState(alert?.to ?? '도쿄 나리타 (NRT)');
  const [departDate, setDepartDate] = useState(alert?.departDate ?? '2025.08.01');
  const [price, setPrice] = useState(alert ? alert.targetPrice.toLocaleString('ko-KR') : '');
  const [tripType, setTripType] = useState<'편도' | '왕복'>(alert?.tripType ?? '왕복');
  const [mail, setMail] = useState(true);
  const [push, setPush] = useState(true);
  const [active, setActive] = useState(alert?.active ?? true);

  const save = () => {
    if (id) {
      updateAlert(id, { from, to, departDate, targetPrice: toNumber(price), tripType, active });
    }
    nav.goBack();
  };

  return (
    <>
      <Header title="알림 조건 수정" onBack={() => nav.goBack()} />
      <Screen>
        <View style={{ gap: spacing.lg }}>
          <PickerField label="출발지" value={from} options={AIRPORTS} onSelect={setFrom} />
          <PickerField label="도착지" value={to} options={AIRPORTS} onSelect={setTo} />
          <PickerField label="출발일" value={departDate} options={dateOptions(1)} onSelect={setDepartDate} />
          <TextField label="가격 한계" placeholder="150,000" value={price} onChangeText={setPrice} keyboardType="number-pad" />
          <PickerField label="편도/왕복" value={tripType} options={TRIP_TYPES} onSelect={(v) => setTripType(v as '편도' | '왕복')} />
        </View>

        <Divider />

        <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.sm }}>
          알림 수신
        </Text>
        <ToggleRow label="메일" on={mail} onToggle={() => setMail((v) => !v)} />
        <ToggleRow label="푸시 알림" on={push} onToggle={() => setPush((v) => !v)} />

        <Divider />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text variant="caption" weight="medium">활성화</Text>
            <Text variant="micro" color={colors.textMuted}>
              {active ? '알림 활성 중' : '알림 중지됨'}
            </Text>
          </View>
          <Toggle on={active} onToggle={() => setActive((v) => !v)} />
        </View>

        <View style={{ height: spacing.xl }} />
        <Button label="저장" full disabled={toNumber(price) === 0} onPress={save} />
      </Screen>
    </>
  );
}

function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
      }}
    >
      <Text variant="caption">{label}</Text>
      <Toggle on={on} onToggle={onToggle} />
    </View>
  );
}
