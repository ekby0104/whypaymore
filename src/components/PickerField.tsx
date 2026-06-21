import { useState } from 'react';
import { Modal, View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SelectField } from './Input';
import Button from './Button';
import Text from './Text';
import { colors, radius, spacing } from '@/theme';

export interface Option {
  label: string;
  value: string;
}

/** 탭하면 옵션 목록 바텀시트가 뜨는 선택 입력 */
export function PickerField({
  label,
  value,
  options,
  onSelect,
  placeholder,
}: {
  label?: string;
  value?: string;
  options: Option[];
  onSelect: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <SelectField
        label={label}
        value={selected?.label ?? value}
        placeholder={placeholder}
        onPress={() => setOpen(true)}
      />
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            {label ? (
              <Text variant="heading" weight="semibold" style={{ marginBottom: spacing.md }}>
                {label}
              </Text>
            ) : null}
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              {options.map((o) => {
                const active = o.value === value;
                return (
                  <Pressable
                    key={o.value}
                    onPress={() => {
                      onSelect(o.value);
                      setOpen(false);
                    }}
                    style={[styles.row, active && styles.rowActive]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                  >
                    <Text
                      variant="body"
                      color={active ? colors.primary : colors.textPrimary}
                      weight={active ? 'semibold' : 'regular'}
                    >
                      {o.label}
                    </Text>
                    {active ? (
                      <Text variant="body" color={colors.primary}>
                        ✓
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={{ height: spacing.sm }} />
            <Button label="닫기" variant="secondary" full onPress={() => setOpen(false)} />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  rowActive: { backgroundColor: colors.primarySoft },
});
