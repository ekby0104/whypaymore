import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import { colors } from '@/theme';

/** 세션 복원 중 표시되는 로딩 스플래시 (네비게이션 라우트 아님) */
export default function SplashScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.logo}>
        <Text variant="title" weight="bold" color={colors.textInverse}>
          ₩
        </Text>
      </View>
      <Text variant="title" weight="bold" style={{ marginTop: 16 }}>
        최저가 항공권 알림
      </Text>
      <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 6 }}>
        Why Pay More?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
