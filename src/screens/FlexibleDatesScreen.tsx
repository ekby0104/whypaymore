import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Card, Row, Tag } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { colors, spacing } from '@/theme';
import { flexibleDates } from '@/data/mock';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function FlexibleDatesScreen() {
  const nav = useNavigation<Nav>();
  return (
    <>
      <Header title="유연한 날짜 추천" onBack={() => nav.goBack()} />
      <Screen>
        <Text variant="title" weight="bold">저렴한 여행 시기 추천</Text>
        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.sm, marginBottom: spacing.lg }}>
          출발지·목적지 조건에 맞는 최저가 날짜를 분석했습니다.
        </Text>

        <Card style={{ marginBottom: spacing.lg }}>
          <Row label="추천 조건" value="인천 → 도쿄 나리타 · 성인 1명" />
        </Card>

        <View style={{ gap: spacing.sm }}>
          {flexibleDates.map((d) => (
            <Card key={d.date} onPress={() => nav.navigate('FlightDetail')}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="caption" weight="medium">{d.date}</Text>
                <Text variant="heading" weight="bold" color={colors.primary}>
                  ₩{d.price.toLocaleString('ko-KR')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="caption" color={colors.textSecondary}>{d.nights}</Text>
                <Tag label={d.tag} tone={d.tone as any} />
              </View>
              <Text variant="micro" color={colors.textMuted}>{d.note}</Text>
            </Card>
          ))}
        </View>

        <View style={{ height: spacing.xl }} />
        <Button label="이 조건으로 알림 만들기" full onPress={() => nav.navigate('AlertConditionSetup')} />
      </Screen>
    </>
  );
}
