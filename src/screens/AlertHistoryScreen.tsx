import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, ScreenTitle, Card, Tag } from '@/components/layout';
import { AsyncBoundary } from '@/components/Async';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { colors, spacing } from '@/theme';
import { won } from '@/data/mock';
import { api } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function AlertHistoryScreen() {
  const nav = useNavigation<Nav>();
  const state = useAsync(() => api.getAlertHistory(), []);
  return (
    <Screen safeTop>
      <ScreenTitle title="알림 이력" />

      <Card style={{ marginBottom: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant="caption">푸시 알림이 꺼져 있나요?</Text>
        <Button label="설정하기" variant="chip-active" onPress={() => nav.navigate('PushPermission')} />
      </Card>

      <AsyncBoundary
        state={state}
        loadingLabel="알림 이력을 불러오는 중…"
        isEmpty={(d) => d.length === 0}
        emptyMessage="아직 받은 알림이 없습니다."
      >
        {(history) => (
          <View style={{ gap: spacing.sm }}>
            {history.map((h) => (
              <Card key={h.id} onPress={() => nav.navigate('AlertHistoryDetail', { id: h.id })}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text variant="caption" weight="medium">{h.route}</Text>
                  <Text variant="caption" weight="semibold" color={colors.primary}>{won(h.price)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag label={h.type} tone={h.tone as any} />
                  <Text variant="micro" color={colors.textMuted}>{h.at}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}
      </AsyncBoundary>
    </Screen>
  );
}
