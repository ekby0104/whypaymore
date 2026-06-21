import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Section, Card } from '@/components/layout';
import Text from '@/components/Text';
import { Toggle } from '@/components/Input';
import { usePreferences, type Preferences } from '@/prefs/PreferencesContext';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const alertTypes: { key: keyof Preferences['types']; title: string; desc: string }[] = [
  { key: 'lowest', title: '최저가 도달 알림', desc: '설정한 목표 가격 이하로 내려가면 알림' },
  { key: 'change', title: '가격 변동 알림', desc: '직전 조회 대비 가격이 변경되면 알림' },
  { key: 'deadline', title: '마감 임박 알림', desc: '잔여 좌석이 적거나 특가 종료 전 알림' },
  { key: 'weekly', title: '주간 요약 알림', desc: '매주 관심 노선의 가격 동향 요약 제공' },
];
const channelMeta: { key: keyof Preferences['channels']; label: string }[] = [
  { key: 'push', label: '푸시 알림' },
  { key: 'email', label: '이메일 알림' },
  { key: 'inApp', label: '앱 내 알림' },
];

export default function AlertListManageScreen() {
  const nav = useNavigation<Nav>();
  const { prefs, update, toggleType, toggleChannel } = usePreferences();

  return (
    <>
      <Header title="알림 목록 관리" onBack={() => nav.goBack()} />
      <Screen>
        <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <Text variant="caption" weight="medium">전체 알림 활성화</Text>
          <Toggle on={prefs.allAlerts} onToggle={() => update({ allAlerts: !prefs.allAlerts })} accessibilityLabel="전체 알림 활성화" />
        </Card>

        <Section title="알림 유형별 설정">
          <View style={{ gap: spacing.sm }}>
            {alertTypes.map((t) => (
              <Card key={t.key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, paddingRight: spacing.md }}>
                  <Text variant="heading" weight="semibold">{t.title}</Text>
                  <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>{t.desc}</Text>
                </View>
                <Toggle on={prefs.allAlerts && prefs.types[t.key]} onToggle={() => toggleType(t.key)} accessibilityLabel={t.title} />
              </Card>
            ))}
          </View>
        </Section>

        <Section title="알림 채널 설정">
          <Card>
            {channelMeta.map((c) => (
              <View
                key={c.key}
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm }}
              >
                <Text variant="caption">{c.label}</Text>
                <Toggle on={prefs.channels[c.key]} onToggle={() => toggleChannel(c.key)} accessibilityLabel={c.label} />
              </View>
            ))}
          </Card>
        </Section>
      </Screen>
    </>
  );
}
