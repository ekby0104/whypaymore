import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Section, Card, Tag } from '@/components/layout';
import { AsyncBoundary } from '@/components/Async';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { colors, spacing, radius } from '@/theme';
import { won } from '@/data/mock';
import { api, usingLiveApi, type FareDate } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { futureDate } from '@/data/options';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ROUTE = { from: '인천 (ICN)', to: '도쿄 (NRT)' };

export default function PriceTrendScreen() {
  const nav = useNavigation<Nav>();
  const state = useAsync(
    () => api.getFareCalendar({ from: ROUTE.from, to: ROUTE.to, date: futureDate(14) }),
    [],
  );

  return (
    <>
      <Header title="가격 트렌드 그래프" onBack={() => nav.goBack()} />
      <Screen>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
          <Text variant="title" weight="bold">가격 트렌드</Text>
          <Tag label={usingLiveApi ? '실시간' : '목 데이터'} tone={usingLiveApi ? 'success' : 'neutral'} />
        </View>
        <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.lg }}>
          인천 → 도쿄 · 날짜별 최저가 추이
        </Text>

        <AsyncBoundary state={state} loadingLabel="가격 추이를 불러오는 중…" isEmpty={(d) => d.length === 0}>
          {(data) => {
            const series = data.slice(0, 14);
            const prices = series.map((d) => d.price);
            const max = Math.max(...prices);
            const min = Math.min(...prices);
            const allPrices = data.map((d) => d.price).filter((p) => p > 0);
            const avg = Math.round(allPrices.reduce((s, p) => s + p, 0) / Math.max(1, allPrices.length));
            const lowest = Math.min(...allPrices);
            const highest = Math.max(...allPrices);
            return (
              <>
                <Card style={{ height: 200, justifyContent: 'flex-end' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 150, gap: 4 }}>
                    {series.map((d, i) => (
                      <View
                        key={i}
                        style={{
                          flex: 1,
                          height: `${max > 0 ? (d.price / max) * 100 : 0}%`,
                          backgroundColor: d.price === min ? colors.primary : colors.primarySoft,
                          borderRadius: radius.sm,
                        }}
                      />
                    ))}
                  </View>
                </Card>

                <View style={{ height: spacing.xl }} />

                <Section title="가격 변동 요약">
                  <Card>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Stat label="최저가" value={won(lowest)} color={colors.success} />
                      <Stat label="평균가" value={won(avg)} />
                      <Stat label="최고가" value={won(highest)} color={colors.danger} />
                    </View>
                  </Card>
                </Section>
              </>
            );
          }}
        </AsyncBoundary>

        <Button label="이 조건으로 알림 만들기" full onPress={() => nav.navigate('AlertConditionSetup')} />
      </Screen>
    </>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text variant="caption" color={colors.textSecondary}>{label}</Text>
      <Text variant="heading" weight="bold" color={color} style={{ marginTop: 2 }}>{value}</Text>
    </View>
  );
}
