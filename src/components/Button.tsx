import { Pressable, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import Text from './Text';

/** 와이어프레임 Button 컴포넌트 변형 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'default'
  | 'danger'
  | 'chip'
  | 'chip-active';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  full?: boolean;
  style?: ViewStyle;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  full,
  style,
}: Props) {
  const v = styleMap[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        v.container,
        full && styles.full,
        variant.startsWith('chip') && styles.chip,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text.color} size="small" />
      ) : (
        <Text
          variant={variant.startsWith('chip') ? 'caption' : 'body'}
          weight="semibold"
          color={v.text.color}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styleMap: Record<ButtonVariant, { container: ViewStyle; text: { color: string } }> = {
  primary: { container: { backgroundColor: colors.primary }, text: { color: colors.textInverse } },
  secondary: {
    container: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong },
    text: { color: colors.textPrimary },
  },
  default: { container: { backgroundColor: colors.surfaceAlt }, text: { color: colors.textSecondary } },
  danger: { container: { backgroundColor: colors.danger }, text: { color: colors.textInverse } },
  chip: {
    container: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    text: { color: colors.textSecondary },
  },
  'chip-active': {
    container: { backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.primary },
    text: { color: colors.primary },
  },
};

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  chip: { height: 34, borderRadius: radius.pill, paddingHorizontal: spacing.lg },
  full: { alignSelf: 'stretch' },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.45 },
});
