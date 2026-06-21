import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, ScreenTitle, Section, Card, Tag } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { colors, spacing } from '@/theme';
import { priceExplore, won } from '@/data/mock';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const tabs = ['가격 캘린더', '트렌드 그래프', '유연한 날짜'];

export default function PriceExploreScreen() {
  const nav = useNavigation<Nav>();
  return (
    <Screen safeTop>
      <ScreenTitle title="가격 탐색" />

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
        <Button label="가격 캘린더" variant="chip-active" onPress={() => nav.navigate('PriceCalendar')} />
        <Button label="트렌드 그래프" variant="chip" onPress={() => nav.navigate('PriceTrend')} />
        <Button label="유연한 날짜" variant="chip" onPress={() => nav.navigate('FlexibleDates')} />
      </View>

      <Section title="조건별 가격 비교">
        <View style={{ gap: spacing.sm }}>
          {priceExplore.map((p) => (
            <Card key={p.date} onPress={() => nav.navigate('FlightDetail')}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="heading" weight="semibold">
                  {p.date}
                </Text>
                <Text variant="heading" weight="bold" color={colors.primary}>
                  {won(p.price)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="caption" color={colors.textSecondary}>
                  {p.route}
                </Text>
                {p.tag ? <Tag label={p.tag} tone={p.tone as any} /> : null}
              </View>
            </Card>
          ))}
        </View>
      </Section>

      <Text variant="caption" color={colors.textMuted}>
        주간 평균 대비 최대 23% 저렴한 날짜를 강조 표시합니다.
      </Text>
    </Screen>
  );
}
