import { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, TextInputProps } from 'react-native';
import { colors, radius, spacing, fontSize } from '@/theme';
import Text from './Text';

/** 와이어프레임 Input 컴포넌트: text / password / area / select / search */
interface BaseProps {
  label?: string;
  placeholder?: string;
}

export function TextField({
  label,
  value,
  type = 'text',
  area,
  ...rest
}: BaseProps & TextInputProps & { type?: 'text' | 'password' | 'email'; area?: boolean }) {
  return (
    <View style={styles.group}>
      {label ? (
        <Text variant="caption" color={colors.textSecondary} style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        value={value}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={type === 'password'}
        keyboardType={type === 'email' ? 'email-address' : 'default'}
        autoCapitalize="none"
        multiline={area}
        style={[styles.input, area && styles.area]}
        {...rest}
      />
    </View>
  );
}

export function SelectField({
  label,
  value,
  placeholder,
  onPress,
}: BaseProps & { value?: string; onPress?: () => void }) {
  return (
    <View style={styles.group}>
      {label ? (
        <Text variant="caption" color={colors.textSecondary} style={styles.label}>
          {label}
        </Text>
      ) : null}
      <Pressable onPress={onPress} style={[styles.input, styles.selectRow]}>
        <Text variant="body" color={value ? colors.textPrimary : colors.textMuted}>
          {value || placeholder}
        </Text>
        <Text variant="body" color={colors.textMuted}>
          ⌄
        </Text>
      </Pressable>
    </View>
  );
}

export function SearchField(props: BaseProps & TextInputProps) {
  return (
    <View style={[styles.input, styles.searchRow]}>
      <Text variant="body" color={colors.textMuted}>
        🔍
      </Text>
      <TextInput
        placeholder={props.placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.searchInput}
        {...props}
      />
    </View>
  );
}

/** check / radio / toggle */
export function Checkbox({
  checked,
  onToggle,
  label,
  radio,
}: {
  checked: boolean;
  onToggle?: () => void;
  label?: string;
  radio?: boolean;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={styles.checkRow}
      accessibilityRole={radio ? 'radio' : 'checkbox'}
      accessibilityLabel={label}
      accessibilityState={{ checked }}
    >
      <View
        style={[
          radio ? styles.radio : styles.check,
          checked && !radio && styles.checkOn,
          checked && radio && styles.radioOn,
        ]}
      >
        {checked && !radio ? <Text variant="micro" color={colors.textInverse}>✓</Text> : null}
        {checked && radio ? <View style={styles.radioDot} /> : null}
      </View>
      {label ? <Text variant="caption">{label}</Text> : null}
    </Pressable>
  );
}

export function Toggle({
  on,
  onToggle,
  accessibilityLabel,
}: {
  on: boolean;
  onToggle?: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.toggle, on && styles.toggleOn]}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: on }}
    >
      <View style={[styles.knob, on && styles.knobOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.xs },
  label: { marginBottom: 2 },
  input: {
    minHeight: 44,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.body,
    color: colors.textPrimary,
    justifyContent: 'center',
  },
  area: { minHeight: 88, textAlignVertical: 'top' },
  selectRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  searchInput: { flex: 1, fontSize: fontSize.body, color: colors.textPrimary },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  check: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  radioOn: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.borderStrong,
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: { backgroundColor: colors.primary },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.surface },
  knobOn: { alignSelf: 'flex-end' },
});
