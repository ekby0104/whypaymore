import { useState } from 'react';
import { View, Modal } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Card, Tag } from '@/components/layout';
import { AsyncBoundary } from '@/components/Async';
import { Checkbox } from '@/components/Input';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { colors, spacing, radius } from '@/theme';
import { won } from '@/data/mock';
import { api, AIRLINES, usingLiveApi, type SearchParams } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type R = RouteProp<RootStackParamList, 'SearchResults'>;

const sorts: { key: NonNullable<SearchParams['sort']>; label: string }[] = [
  { key: 'price', label: '최저가순' },
  { key: 'duration', label: '소요시간순' },
  { key: 'departure', label: '출발시간순' },
];

const city = (s: string) => s.replace(/\s*\(.*\)/, '');

export default function SearchResultsScreen() {
  const nav = useNavigation<Nav>();
  const { query } = useRoute<R>().params;

  const [sort, setSort] = useState<SearchParams['sort']>('price');
  const [directOnly, setDirectOnly] = useState(false);
  const [morningOnly, setMorningOnly] = useState(false);
  const [lccOnly, setLccOnly] = useState(false);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [airlineModal, setAirlineModal] = useState(false);

  const state = useAsync(
    () =>
      api.searchFlights({
        from: query.from,
        to: query.to,
        date: query.departDate,
        adults: query.passengers,
        seatClass: query.seatClass,
        tripType: query.tripType === '왕복' ? 'ROUND_TRIP' : 'ONE_WAY',
        sort,
        directOnly,
        morningOnly,
        lccOnly,
        airlines,
      }),
    [sort, directOnly, morningOnly, lccOnly, airlines.join(','), query.from, query.to, query.departDate],
  );

  const anyFilter = directOnly || morningOnly || lccOnly || airlines.length > 0;
  const reset = () => {
    setDirectOnly(false);
    setMorningOnly(false);
    setLccOnly(false);
    setAirlines([]);
  };
  const toggleAirline = (a: string) =>
    setAirlines((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const summary = `${city(query.from)} → ${city(query.to)} · ${query.departDate} · ${query.passengers} · ${query.seatClass}`;

  return (
    <>
      <Header title="검색 결과" onBack={() => nav.goBack()} />
      <Screen>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
          <Text variant="caption" color={colors.textSecondary} style={{ flex: 1 }}>
            {summary}
          </Text>
          <Tag label={usingLiveApi ? '실시간' : '목 데이터'} tone={usingLiveApi ? 'success' : 'neutral'} />
        </View>

        {/* 정렬 */}
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
          {sorts.map((s) => (
            <Button
              key={s.key}
              label={s.label}
              variant={sort === s.key ? 'chip-active' : 'chip'}
              onPress={() => setSort(s.key)}
            />
          ))}
        </View>

        {/* 필터 */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
          <Button label="직항만" variant={directOnly ? 'chip-active' : 'chip'} onPress={() => setDirectOnly((v) => !v)} />
          <Button label="오전 출발" variant={morningOnly ? 'chip-active' : 'chip'} onPress={() => setMorningOnly((v) => !v)} />
          <Button label="저비용(LCC)" variant={lccOnly ? 'chip-active' : 'chip'} onPress={() => setLccOnly((v) => !v)} />
          <Button
            label={airlines.length > 0 ? `항공사 ${airlines.length}` : '항공사'}
            variant={airlines.length > 0 ? 'chip-active' : 'chip'}
            onPress={() => setAirlineModal(true)}
          />
          {anyFilter ? <Button label="초기화 ✕" variant="chip" onPress={reset} /> : null}
        </View>

        <AsyncBoundary
          state={state}
          loadingLabel="항공권을 검색 중입니다…"
          isEmpty={(d) => d.length === 0}
          emptyMessage="조건에 맞는 항공권이 없습니다. 필터를 조정해 보세요."
        >
          {(flights) => (
            <>
              <Text variant="caption" weight="medium" style={{ marginBottom: spacing.md }}>
                항공권 {flights.length}개
              </Text>
              <View style={{ gap: spacing.sm }}>
                {flights.map((f) => (
                  <Card key={f.id} onPress={() => nav.navigate('FlightDetail', { flightId: f.id })}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ alignItems: 'center' }}>
                        <Text variant="title" weight="semibold">{f.depTime}</Text>
                        <Text variant="micro" color={colors.textMuted}>{f.from}</Text>
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <Text variant="micro" color={colors.textSecondary}>{f.duration}</Text>
                        <View style={{ width: 60, height: 1, backgroundColor: colors.border, marginVertical: 4 }} />
                        <Tag label={f.stops} tone={f.stops === '직항' ? 'success' : 'neutral'} />
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <Text variant="title" weight="semibold">{f.arrTime}</Text>
                        <Text variant="micro" color={colors.textMuted}>{f.to}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text variant="title" weight="bold" color={colors.primary}>{won(f.price)}</Text>
                        <Text variant="micro" color={colors.textMuted}>{f.airline}</Text>
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            </>
          )}
        </AsyncBoundary>
      </Screen>

      {/* 항공사 다중 선택 모달 */}
      <Modal visible={airlineModal} transparent animationType="slide" onRequestClose={() => setAirlineModal(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              padding: spacing.xl,
              gap: spacing.lg,
            }}
          >
            <Text variant="heading" weight="semibold">항공사 선택</Text>
            <View style={{ gap: spacing.md }}>
              {AIRLINES.map((a) => (
                <Checkbox key={a} label={a} checked={airlines.includes(a)} onToggle={() => toggleAirline(a)} />
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <Button label="전체 해제" variant="secondary" full onPress={() => setAirlines([])} />
              </View>
              <View style={{ flex: 1 }}>
                <Button label="적용" full onPress={() => setAirlineModal(false)} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
