import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Card } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const rows = [
  { k: '취소 수수료', v: '출발 7일 전까지 30%, 이후 50% 부과' },
  { k: '좌석 변경', v: '1회 유료 변경 가능, 이후 추가 요금 발생' },
  { k: '수하물', v: '기내 반입 10kg 포함, 위탁 수하물 별도 구매' },
  { k: '마일리지', v: '대한항공 스카이패스 적립 가능' },
];

export default function BookingConditionsScreen() {
  const nav = useNavigation<Nav>();
  return (
    <>
      <Header title="예약 조건 상세" onBack={() => nav.goBack()} />
      <Screen>
        <Card>
          {rows.map((r, i) => (
            <View key={r.k} style={{ marginTop: i === 0 ? 0 : spacing.md }}>
              <Text variant="caption" weight="semibold">
                {r.k}
              </Text>
              <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                {r.v}
              </Text>
            </View>
          ))}
        </Card>
        <View style={{ height: spacing.xl }} />
        <Button label="확인" full onPress={() => nav.goBack()} />
      </Screen>
    </>
  );
}
