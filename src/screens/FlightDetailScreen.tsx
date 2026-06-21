import { View, Linking } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Section, Card, Row, Tag } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { colors, spacing } from '@/theme';
import { won, type Flight } from '@/data/mock';
import { api } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { useAlerts } from '@/alerts/AlertsContext';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type R = RouteProp<RootStackParamList, 'FlightDetail'>;

const fallback: Flight = {
  id: 'f1', depTime: '09:30', arrTime: '11:40', duration: '2시간 10분', stops: '직항',
  from: 'ICN', to: 'NRT', airline: '대한항공 KE701', price: 89900,
};

export default function FlightDetailScreen() {
  const nav = useNavigation<Nav>();
  const { addAlert } = useAlerts();
  const id = useRoute<R>().params?.flightId;
  const { data } = useAsync(() => (id ? api.getFlight(id) : Promise.resolve(fallback)), [id]);
  const f = data ?? fallback;

  const goBooking = () => {
    if (f.reservationUrl) {
      Linking.openURL(f.reservationUrl).catch(() => nav.navigate('BookingConditions'));
    } else {
      nav.navigate('BookingConditions');
    }
  };

  const saveAlert = () => {
    addAlert({
      from: f.from,
      to: f.to,
      targetPrice: f.price,
      tripType: '편도',
      passengers: '성인 1명',
      seatClass: '이코노미',
    });
    nav.navigate('Tabs', { screen: 'AlertTab' });
  };
  return (
    <>
      <Header title="항공권 상세" onBack={() => nav.goBack()} />
      <Screen>
        <Section title="항공편 요약">
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text variant="title" weight="semibold">{f.from}</Text>
              <Text variant="body" color={colors.textMuted}>→</Text>
              <Text variant="title" weight="semibold">{f.to}</Text>
            </View>
            <Row label={`${f.depTime} 출발`} value={`${f.arrTime} 도착`} />
            <Row label={f.stops} value={f.duration} />
            <Row label="2025년 8월 12일 (화)" value={f.airline} />
          </Card>
        </Section>

        <Section title="요금 및 예약 조건">
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text variant="heading" weight="semibold">편도 성인 1인</Text>
              <Text variant="title" weight="bold" color={colors.primary}>{won(f.price)}</Text>
            </View>
            <Row label="유류할증료 포함" value="₩112,400" />
            <Row label="수하물" value="위탁 불포함" />
            <Row label="환불 조건" value="취소 수수료 발생" />
            <Row label="좌석 변경" value="유료 변경 가능" />
            <Button
              label="예약 조건 전체 보기"
              variant="secondary"
              full
              style={{ marginTop: spacing.sm }}
              onPress={() => nav.navigate('BookingConditions')}
            />
          </Card>
        </Section>

        <Section title="최근 가격 변동">
          <Card>
            <Row label="7일 최저가" value="₩84,500" valueColor={colors.success} />
            <Row label="7일 최고가" value="₩124,000" valueColor={colors.danger} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="caption" color={colors.textSecondary}>현재 가격 상태</Text>
              <Tag label="보통" tone="warning" />
            </View>
          </Card>
        </Section>

        <View style={{ gap: spacing.sm }}>
          <Button label="구매 페이지로 이동" full onPress={goBooking} />
          <Button label="이 가격 알림 저장" variant="secondary" full onPress={saveAlert} />
        </View>
      </Screen>
    </>
  );
}
