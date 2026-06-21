import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header, Card } from '@/components/layout';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const benefits = [
  { title: '실시간 가격 추적', desc: '원하는 노선의 가격 변화를 놓치지 않습니다' },
  { title: '빠른 구매 기회', desc: '최저가 시점에 즉시 알림을 받고 예약합니다' },
  { title: '맞춤형 알림', desc: '설정한 알림만 받으므로 불필요한 알림이 없습니다' },
];

export default function PushPermissionScreen() {
  const nav = useNavigation<Nav>();
  return (
    <>
      <Header title="푸시 알림 권한 안내" onBack={() => nav.goBack()} />
      <Screen>
        <Text variant="title" weight="bold">푸시 알림을 허용하세요</Text>
        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}>
          최저가 항공권이 나타나면 즉시 알려드립니다
        </Text>

        <View style={{ gap: spacing.md }}>
          {benefits.map((b) => (
            <Card key={b.title}>
              <Text variant="caption" weight="semibold" color={colors.primary}>{b.title}</Text>
              <Text variant="caption" color={colors.textSecondary}>{b.desc}</Text>
            </Card>
          ))}
        </View>

        <View style={{ height: spacing.xxl }} />
        <View style={{ gap: spacing.sm }}>
          <Button label="푸시 알림 허용" full onPress={() => nav.goBack()} />
          <Button label="나중에" variant="default" full onPress={() => nav.goBack()} />
        </View>
      </Screen>
    </>
  );
}
