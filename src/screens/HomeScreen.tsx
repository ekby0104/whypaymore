import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Section, Card, Tag } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { colors, spacing } from '@/theme';
import { popularRoutes, recentAlerts, won } from '@/data/mock';
import { useAlerts } from '@/alerts/AlertsContext';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const city = (s: string) => s.replace(/\s*\(.*\)/, '');

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { alerts } = useAlerts();
  const activeCount = alerts.filter((a) => a.active).length;
  const top = alerts[0];
  return (
    <Screen safeTop>
      <View style={{ marginBottom: spacing.xl }}>
        <Text variant="display" weight="bold">
          어디로 떠나실 건가요?
        </Text>
        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
          최저가 항공권을 빠르게 찾고 알림을 받아보세요
        </Text>
      </View>

      <Button label="항공권 검색하기" full onPress={() => nav.navigate('FlightSearch')} />

      <View style={{ height: spacing.xl }} />

      <Section title="내 최저가 알림">
        <Card onPress={() => nav.navigate('Tabs', { screen: 'AlertTab' })}>
          {top ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="caption" weight="semibold">
                  {city(top.from)} → {city(top.to)}
                </Text>
                <Tag label={`활성 ${activeCount}개`} tone="primary" />
              </View>
              <Text variant="caption" color={colors.textSecondary}>
                목표가 {won(top.targetPrice)} 이하
              </Text>
            </>
          ) : (
            <Text variant="caption" color={colors.textSecondary}>
              등록된 알림이 없어요. 눌러서 만들어 보세요.
            </Text>
          )}
        </Card>
      </Section>

      <Section title="지금 뜨는 가격 탐색">
        <View style={{ gap: spacing.sm }}>
          {popularRoutes.map((r) => (
            <Card key={r.route} onPress={() => nav.navigate('PriceCalendar')}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="caption" weight="medium">
                  {r.route}
                </Text>
                <Text variant="caption" weight="semibold" color={colors.primary}>
                  최저 {won(r.price)}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </Section>

      <Section title="최근 알림 이력">
        <View style={{ gap: spacing.sm }}>
          {recentAlerts.map((a) => (
            <Card key={a.route} onPress={() => nav.navigate('Tabs', { screen: 'HistoryTab' })}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="caption" weight="medium">
                  {a.route}
                </Text>
                <Text variant="micro" color={colors.textMuted}>
                  {a.ago}
                </Text>
              </View>
              <Text variant="caption" color={colors.textSecondary}>
                {a.detail}
              </Text>
            </Card>
          ))}
        </View>
      </Section>

      <Card onPress={() => nav.navigate('Tabs', { screen: 'MyTab' })}>
        <Text variant="caption" weight="medium">
          내 계정 및 설정
        </Text>
        <Text variant="caption" color={colors.textSecondary}>
          알림 수신 · 저장된 노선 관리
        </Text>
      </Card>
    </Screen>
  );
}
