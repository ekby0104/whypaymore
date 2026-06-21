import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header } from '@/components/layout';
import Button from '@/components/Button';
import { PickerField } from '@/components/PickerField';
import { AIRPORTS, PASSENGERS, SEATS, dateOptions, futureDate } from '@/data/options';
import { spacing } from '@/theme';
import type { RootStackParamList, SearchQuery } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const trips: SearchQuery['tripType'][] = ['편도', '왕복', '다구간'];

export default function FlightSearchScreen() {
  const nav = useNavigation<Nav>();
  const [q, setQ] = useState<SearchQuery>({
    tripType: '왕복',
    from: '인천 (ICN)',
    to: '도쿄 (NRT)',
    departDate: futureDate(14),
    returnDate: futureDate(21),
    passengers: '성인 1명',
    seatClass: '이코노미',
  });
  const set = <K extends keyof SearchQuery>(k: K, v: SearchQuery[K]) => setQ((p) => ({ ...p, [k]: v }));

  return (
    <>
      <Header title="항공권 검색" onBack={() => nav.goBack()} />
      <Screen>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
          {trips.map((t) => (
            <Button
              key={t}
              label={t}
              variant={q.tripType === t ? 'chip-active' : 'chip'}
              onPress={() => set('tripType', t)}
            />
          ))}
        </View>

        <View style={{ gap: spacing.lg }}>
          <PickerField label="출발 도시" value={q.from} options={AIRPORTS} onSelect={(v) => set('from', v)} />
          <PickerField label="도착 도시" value={q.to} options={AIRPORTS} onSelect={(v) => set('to', v)} />
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <PickerField label="출발일" value={q.departDate} options={dateOptions(1)} onSelect={(v) => set('departDate', v)} />
            </View>
            {q.tripType === '왕복' ? (
              <View style={{ flex: 1 }}>
                <PickerField label="귀국일" value={q.returnDate} options={dateOptions(1)} onSelect={(v) => set('returnDate', v)} />
              </View>
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <PickerField label="승객 수" value={q.passengers} options={PASSENGERS} onSelect={(v) => set('passengers', v)} />
            </View>
            <View style={{ flex: 1 }}>
              <PickerField label="좌석 등급" value={q.seatClass} options={SEATS} onSelect={(v) => set('seatClass', v)} />
            </View>
          </View>
        </View>

        <View style={{ height: spacing.xl }} />
        <Button label="항공권 검색하기" full onPress={() => nav.navigate('SearchResults', { query: q })} />
      </Screen>
    </>
  );
}
