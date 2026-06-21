import { ReactNode } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing } from '@/theme';
import Text from './Text';

/** 화면 컨테이너 — 스크롤 + 안전영역 */
export function Screen({
  children,
  scroll = true,
  padded = true,
  safeTop = false,
  style,
}: {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  /** 헤더 없는 탭 루트 화면에서 상단 안전영역(노치/상태바)을 확보 */
  safeTop?: boolean;
  style?: ViewStyle;
}) {
  const insets = useSafeAreaInsets();
  const topPad = (safeTop ? insets.top : 0) + (padded ? spacing.lg : 0);
  const content = (
    <View style={[padded && styles.paddedX, { paddingTop: topPad }, style]}>{children}</View>
  );
  if (!scroll) {
    return <View style={[styles.screen, { paddingBottom: insets.bottom }]}>{content}</View>;
  }
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      {content}
    </ScrollView>
  );
}

/** 스택 화면 헤더 (뒤로 가기 + 타이틀) — SharedHeader 대응 */
export function Header({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  // 돌아갈 화면이 있을 때만 뒤로가기 노출 (스택 첫 화면에서 GO_BACK 경고 방지)
  const showBack = !!onBack && navigation.canGoBack();
  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      {showBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={12}
          style={styles.headerBtn}
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
        >
          <Text variant="title" weight="medium">
            ‹
          </Text>
        </Pressable>
      ) : (
        <View style={styles.headerBtn} />
      )}
      <Text variant="heading" weight="semibold" style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.headerBtn}>{right}</View>
    </View>
  );
}

/** 대형 타이틀 (탭 루트 화면) */
export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.screenTitle}>
      <Text variant="title" weight="bold">
        {title}
      </Text>
      {subtitle ? (
        <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      {title ? (
        <Text variant="heading" weight="semibold" style={styles.sectionTitle}>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

export function Card({
  children,
  onPress,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  const inner = <View style={[styles.card, style]}>{children}</View>;
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {inner}
      </Pressable>
    );
  }
  return inner;
}

/** 라벨-값 한 줄 */
export function Row({
  label,
  value,
  valueColor = colors.textPrimary,
  onPress,
}: {
  label: string;
  value?: string;
  valueColor?: string;
  onPress?: () => void;
}) {
  const content = (
    <View style={styles.row}>
      <Text variant="caption" color={colors.textSecondary}>
        {label}
      </Text>
      {value ? (
        <Text variant="caption" weight="medium" color={valueColor}>
          {value}
        </Text>
      ) : null}
    </View>
  );
  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

export function Tag({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'primary' | 'success' | 'danger' | 'warning';
}) {
  const t = toneMap[tone];
  return (
    <View style={[styles.tag, { backgroundColor: t.bg }]}>
      <Text variant="micro" weight="medium" color={t.fg}>
        {label}
      </Text>
    </View>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

const toneMap = {
  neutral: { bg: colors.surfaceAlt, fg: colors.textSecondary },
  primary: { bg: colors.primarySoft, fg: colors.primary },
  success: { bg: colors.successSoft, fg: colors.success },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  warning: { bg: colors.warningSoft, fg: colors.warning },
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  paddedX: { paddingHorizontal: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerBtn: { width: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center' },
  screenTitle: { marginBottom: spacing.lg },
  section: { marginBottom: spacing.xl },
  sectionTitle: { marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  pressed: { opacity: 0.8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
});
