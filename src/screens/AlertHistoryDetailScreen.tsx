import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Section, Card, Row } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const priceLog = [
  { at: '2025.06.10', airline: '대한항공', price: '₩189,000' },
  { at: '2025.06.11', airline: '진에어', price: '₩178,000' },
  { at: '2025.06.12', airline: '진에어', price: '₩172,000' },
];

export default function AlertHistoryDetailScreen() {
  const nav = useNavigation<Nav>();
  return (
    <>
      <Header title="알림 이력 상세" onBack={() => nav.goBack()} />
      <Screen>
        <Section title="알림 발생 정보">
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="heading" weight="semibold">인천 → 도쿄 (NRT)</Text>
              <Text variant="caption" color={colors.textSecondary}>2025.06.12 (목)</Text>
            </View>
            <Row label="발생 일시" value="2025.01.23 오전 09:41" />
            <Row label="항공사" value="진에어 LJ201" />
            <Row label="출발 시각" value="07:30 → 10:45" />
            <Row label="좌석 등급" value="이코노미" />
          </Card>
        </Section>

        <Section title="알림 트리거 조건">
          <Card>
            <Row label="설정 목표가" value="₩189,000 이하" />
            <Row label="알림 발생 당시 가격" value="₩172,000" valueColor={colors.success} />
            <Row label="목표가 대비 절감액" value="₩17,000 절감" valueColor={colors.success} />
          </Card>
        </Section>

        <Section title="가격 변동 이력">
          <Card>
            <View style={{ flexDirection: 'row', paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text variant="caption" weight="semibold" style={{ flex: 1 }}>일시</Text>
              <Text variant="caption" weight="semibold" style={{ flex: 1 }}>항공사</Text>
              <Text variant="caption" weight="semibold" style={{ flex: 1, textAlign: 'right' }}>가격</Text>
            </View>
            {priceLog.map((p) => (
              <View key={p.at} style={{ flexDirection: 'row', paddingTop: spacing.sm }}>
                <Text variant="caption" color={colors.textSecondary} style={{ flex: 1 }}>{p.at}</Text>
                <Text variant="caption" color={colors.textSecondary} style={{ flex: 1 }}>{p.airline}</Text>
                <Text variant="caption" weight="medium" style={{ flex: 1, textAlign: 'right' }}>{p.price}</Text>
              </View>
            ))}
          </Card>
        </Section>

        <View style={{ gap: spacing.sm }}>
          <Button label="이 항공권 상세 보기" full onPress={() => nav.navigate('FlightDetail')} />
          <Button label="구매 페이지로 이동" variant="secondary" full onPress={() => nav.navigate('BookingConditions')} />
        </View>
      </Screen>
    </>
  );
}
