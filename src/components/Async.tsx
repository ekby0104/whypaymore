import { ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import Text from './Text';
import Button from './Button';
import type { AsyncState } from '@/hooks/useAsync';

export function Loading({ label }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} />
      {label ? (
        <Text variant="caption" color={colors.textMuted} style={{ marginTop: spacing.md }}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 40 }}>⚠️</Text>
      <Text variant="caption" color={colors.textSecondary} center style={{ marginTop: spacing.md }}>
        {message ?? '문제가 발생했습니다.'}
      </Text>
      {onRetry ? (
        <View style={{ marginTop: spacing.lg }}>
          <Button label="다시 시도" variant="secondary" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

export function Empty({ message }: { message: string }) {
  return (
    <View style={styles.center}>
      <Text variant="caption" color={colors.textMuted}>
        {message}
      </Text>
    </View>
  );
}

/** AsyncState 를 받아 로딩/에러/데이터를 자동 분기 렌더링한다. */
export function AsyncBoundary<T>({
  state,
  children,
  loadingLabel,
  isEmpty,
  emptyMessage = '데이터가 없습니다.',
}: {
  state: AsyncState<T>;
  children: (data: T) => ReactNode;
  loadingLabel?: string;
  isEmpty?: (data: T) => boolean;
  emptyMessage?: string;
}) {
  if (state.loading && state.data === null) return <Loading label={loadingLabel} />;
  if (state.error) return <ErrorState message={state.error.message} onRetry={state.reload} />;
  if (state.data !== null) {
    if (isEmpty?.(state.data)) return <Empty message={emptyMessage} />;
    return <>{children(state.data)}</>;
  }
  return null;
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxl * 2 },
});
