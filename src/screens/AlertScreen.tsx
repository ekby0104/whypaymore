import { useState, useEffect, useCallback } from 'react';
import { View, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, ScreenTitle, Card, Row, Tag } from '@/components/layout';
import { Empty } from '@/components/Async';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { useAlerts, type PriceAlert } from '@/alerts/AlertsContext';
import { runAlertCheck } from '@/alerts/monitor';
import { sendLocalNotification } from '@/services/notifications';
import { api } from '@/services/api';
import { futureDate } from '@/data/options';
import { colors, spacing, radius } from '@/theme';
import { won } from '@/data/mock';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

async function fetchLowest(a: PriceAlert): Promise<number> {
  const fares = await api.getFareCalendar({ from: a.from, to: a.to, date: futureDate(7) });
  const prices = fares.map((f) => f.price).filter((p) => p > 0);
  if (prices.length === 0) throw new Error('가격 없음');
  return Math.min(...prices);
}

export default function AlertScreen() {
  const nav = useNavigation<Nav>();
  const { alerts, togglePause, removeAlert, updateAlert } = useAlerts();
  const [toDelete, setToDelete] = useState<PriceAlert | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkMsg, setCheckMsg] = useState<string | null>(null);

  const runCheck = useCallback(async () => {
    setChecking(true);
    try {
      const results = await runAlertCheck(alerts, {
        fetchLowest,
        update: updateAlert,
        notify: (a, lowest) =>
          sendLocalNotification(
            '목표가 도달! ✈️',
            `${city(a.from)} → ${city(a.to)} 최저 ${won(lowest)} (목표 ${won(a.targetPrice)} 이하)`,
          ),
        now: () => new Date().toLocaleString('ko-KR'),
      });
      const hit = results.filter((r) => r.reached).length;
      setCheckMsg(
        results.length === 0
          ? '확인할 활성 알림이 없어요.'
          : hit > 0
            ? `🎉 목표가 도달 ${hit}건! 알림을 보냈어요.`
            : '아직 목표가에 도달한 알림이 없어요.',
      );
    } finally {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts.length]);

  // 화면 첫 진입 시 1회 자동 확인
  useEffect(() => {
    void runCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen safeTop>
      <ScreenTitle title="최저가 항공권 알림" subtitle={`활성 ${alerts.filter((a) => a.active).length}개 · 전체 ${alerts.length}개`} />

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View style={{ flex: 1 }}>
          <Button label="+ 새 알림 만들기" variant="secondary" full onPress={() => nav.navigate('AlertConditionSetup')} />
        </View>
        <View style={{ flex: 1 }}>
          <Button label="지금 가격 확인" full loading={checking} onPress={runCheck} />
        </View>
      </View>
      {checkMsg ? (
        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
          {checkMsg}
        </Text>
      ) : null}
      <View style={{ height: spacing.xl }} />

      {alerts.length === 0 ? (
        <Empty message="등록된 알림이 없어요. 새 알림을 만들어 보세요." />
      ) : (
        <View style={{ gap: spacing.md }}>
          {alerts.map((a) => (
            <Card key={a.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="heading" weight="semibold">
                  {city(a.from)} → {city(a.to)}
                </Text>
                <View style={{ flexDirection: 'row', gap: spacing.xs }}>
                  {a.reached ? <Tag label="목표가 도달" tone="primary" /> : null}
                  <Tag label={a.active ? '활성 중' : '일시중지'} tone={a.active ? 'success' : 'neutral'} />
                </View>
              </View>
              <Row label="목표 가격" value={`${won(a.targetPrice)} 이하`} />
              {a.lastCheckedPrice ? (
                <Row
                  label="현재 최저가"
                  value={won(a.lastCheckedPrice)}
                  valueColor={a.reached ? colors.success : colors.textPrimary}
                />
              ) : null}
              <Row label="여행" value={`${a.tripType} · ${a.departDate ?? '-'}`} />
              <Row label="인원/등급" value={`${a.passengers ?? '성인 1명'} · ${a.seatClass ?? '이코노미'}`} />

              <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <Button label="수정" variant="secondary" full onPress={() => nav.navigate('AlertConditionEdit', { alertId: a.id })} />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    label={a.active ? '일시중지' : '재개'}
                    variant="default"
                    full
                    onPress={() => togglePause(a.id)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button label="삭제" variant="danger" full onPress={() => setToDelete(a)} />
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* 삭제 확인 */}
      <Modal visible={toDelete !== null} transparent animationType="fade" onRequestClose={() => setToDelete(null)}>
        <View style={backdrop}>
          <View style={sheet}>
            <Text variant="heading" weight="semibold">알림 삭제</Text>
            <Text variant="caption" color={colors.textSecondary} style={{ marginVertical: spacing.md }}>
              {toDelete ? `${city(toDelete.from)} → ${city(toDelete.to)} 알림을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?` : ''}
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <Button label="취소" variant="secondary" full onPress={() => setToDelete(null)} />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  label="삭제"
                  variant="danger"
                  full
                  onPress={() => {
                    if (toDelete) removeAlert(toDelete.id);
                    setToDelete(null);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const city = (s: string) => s.replace(/\s*\(.*\)/, '');

const backdrop = {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center' as const,
  paddingHorizontal: spacing.xl,
};
const sheet = {
  backgroundColor: colors.surface,
  borderRadius: radius.lg,
  padding: spacing.xl,
};
