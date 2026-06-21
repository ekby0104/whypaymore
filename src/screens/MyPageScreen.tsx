import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, ScreenTitle, Card } from '@/components/layout';
import Text from '@/components/Text';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const items: { label: string; sub: string; to: keyof RootStackParamList }[] = [
  { label: '계정 정보 관리', sub: '프로필 · 보안 · 이메일', to: 'AccountInfo' },
  { label: '알림 목록 관리', sub: '알림 유형별 · 채널 설정', to: 'AlertListManage' },
  { label: '앱 설정', sub: '알림 빈도 · 통화 · 테마', to: 'AppSettings' },
];

export default function MyPageScreen() {
  const nav = useNavigation<Nav>();
  return (
    <Screen safeTop>
      <ScreenTitle title="마이페이지" />

      <View style={{ gap: spacing.sm }}>
        {items.map((it) => (
          <Card key={it.label} onPress={() => nav.navigate(it.to as any)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text variant="heading" weight="semibold">
                  {it.label}
                </Text>
                <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                  {it.sub}
                </Text>
              </View>
              <Text variant="title" color={colors.textMuted}>
                ›
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
