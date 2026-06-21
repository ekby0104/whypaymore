import { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Pressable, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { useAuth } from '@/auth/AuthContext';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const pages = [
  { emoji: '🔍', title: '원하는 노선을 검색하세요', desc: '출발지·도착지·날짜만 입력하면 최저가를 찾아드립니다' },
  { emoji: '🔔', title: '목표가에 알림을 받으세요', desc: '설정한 가격 이하로 내려가면 즉시 알려드립니다' },
  { emoji: '📉', title: '가격 흐름을 한눈에', desc: '캘린더·트렌드로 가장 저렴한 시기를 분석해 드립니다' },
];

export default function OnboardingScreen() {
  const nav = useNavigation<Nav>();
  const { completeOnboarding } = useAuth();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const ref = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPage(Math.round(e.nativeEvent.contentOffset.x / width));
  };
  const goTerms = () => {
    completeOnboarding();
    nav.replace('TermsAgreement');
  };
  const next = () => {
    if (page < pages.length - 1) {
      ref.current?.scrollTo({ x: width * (page + 1), animated: true });
    } else {
      goTerms();
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.lg }]}>
      <View style={styles.skipRow}>
        <Pressable onPress={goTerms} hitSlop={12}>
          <Text variant="caption" color={colors.textSecondary}>건너뛰기</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
      >
        {pages.map((p) => (
          <View key={p.title} style={[styles.page, { width }]}>
            <Text style={{ fontSize: 64 }}>{p.emoji}</Text>
            <Text variant="title" weight="bold" center style={{ marginTop: spacing.xl }}>
              {p.title}
            </Text>
            <Text variant="body" color={colors.textSecondary} center style={{ marginTop: spacing.md }}>
              {p.desc}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {pages.map((_, i) => (
          <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
        ))}
      </View>

      <View style={{ paddingHorizontal: spacing.xl }}>
        <Button label={page === pages.length - 1 ? '시작하기' : '다음'} full onPress={next} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  skipRow: { alignItems: 'flex-end', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  page: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginVertical: spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.borderStrong },
  dotActive: { backgroundColor: colors.primary, width: 20 },
});
