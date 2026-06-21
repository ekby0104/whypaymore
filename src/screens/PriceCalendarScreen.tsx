import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Section, Card, Tag } from '@/components/layout';
import { AsyncBoundary } from '@/components/Async';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { colors, spacing } from '@/theme';
import { won } from '@/data/mock';
import { api, usingLiveApi, type FareDate } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { futureDate } from '@/data/options';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ROUTE = { from: '인천 (ICN)', to: '도쿄 (NRT)' };

function stats(data: FareDate[]) {
  const prices = data.map((d) => d.price).filter((p) => p > 0);
  if (prices.length === 0) return null;
  const min = data.reduce((a, b) => (b.price > 0 && b.price < a.price ? b : a));
  const max = data.reduce((a, b) => (b.price > a.price ? b : a));
  const avg = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);
  return { min, max, avg };
}

export default function PriceCalendarScreen() {
  const nav = useNavigation<Nav>();
  const state = useAsync(
    () => api.getFareCalendar({ from: ROUTE.from, to: ROUTE.to, date: futureDate(14) }),
    [],
  );

  return (
    <>
      <Header title="가격 캘린더" onBack={() => nav.goBack()} />
      <Screen>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <Text variant="title" weight="bold">가격 캘린더</Text>
          <Tag label={usingLiveApi ? '실시간' : '목 데이터'} tone={usingLiveApi ? 'success' : 'neutral'} />
        </View>
        <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.lg }}>
          인천 → 도쿄 · 날짜별 최저가
        </Text>

        <AsyncBoundary state={state} loadingLabel="날짜별 최저가를 불러오는 중…" isEmpty={(d) => d.length === 0}>
          {(data) => {
            const s = stats(data);
            return (
              <>
                {s ? (
                  <Section title="가격 트렌드 요약">
                    <Card>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Summary label="최저가" value={won(s.min.price)} sub={s.min.date} color={colors.success} />
                        <Summary label="평균 가격" value={won(s.avg)} sub={`${data.length}일 기준`} />
                        <Summary label="최고가" value={won(s.max.price)} sub={s.max.date} color={colors.danger} />
                      </View>
                    </Card>
                  </Section>
                ) : null}

                <Section title="날짜별 최저가">
                  <View style={{ gap: spacing.sm }}>
                    {data.slice(0, 20).map((d) => {
                      const cheapest = s && d.price === s.min.price;
                      return (
                        <Card key={d.date} onPress={() => nav.navigate('FlightDetail')}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                              <Text variant="caption" color={colors.textSecondary}>{d.date}</Text>
                              {cheapest ? <Tag label="최저가" tone="primary" /> : null}
                            </View>
                            <Text variant="heading" weight="semibold" color={cheapest ? colors.primary : colors.textPrimary}>
                              {won(d.price)}
                            </Text>
                          </View>
                        </Card>
                      );
                    })}
                  </View>
                </Section>
              </>
            );
          }}
        </AsyncBoundary>

        <Section title="유연한 날짜 추천">
          <Card onPress={() => nav.navigate('FlexibleDates')}>
            <Text variant="caption" color={colors.textSecondary}>
              ±3일 범위에서 더 저렴한 날짜가 있어요
            </Text>
          </Card>
        </Section>

        <Button label="이 조건으로 알림 만들기" full onPress={() => nav.navigate('AlertConditionSetup')} />
      </Screen>
    </>
  );
}

function Summary({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text variant="micro" color={colors.textMuted}>{label}</Text>
      <Text variant="heading" weight="bold" color={color} style={{ marginVertical: 2 }}>{value}</Text>
      <Text variant="micro" color={colors.textMuted} center>{sub}</Text>
    </View>
  );
}
