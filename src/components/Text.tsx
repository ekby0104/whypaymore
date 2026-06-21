import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { colors, fontSize } from '@/theme';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'caption' | 'micro';

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  center?: boolean;
}

const weightMap = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export default function Text({
  variant = 'body',
  color = colors.textPrimary,
  weight = 'regular',
  center,
  style,
  ...rest
}: Props) {
  return (
    <RNText
      {...rest}
      style={[
        styles[variant],
        { color, fontWeight: weightMap[weight] },
        center && styles.center,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  display: { fontSize: fontSize.display, lineHeight: 34 },
  title: { fontSize: fontSize.title, lineHeight: 26 },
  heading: { fontSize: fontSize.heading, lineHeight: 22 },
  body: { fontSize: fontSize.body, lineHeight: 19 },
  caption: { fontSize: fontSize.caption, lineHeight: 17 },
  micro: { fontSize: fontSize.micro, lineHeight: 15 },
  center: { textAlign: 'center' },
});
