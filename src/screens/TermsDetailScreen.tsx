import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Header } from '@/components/layout';
import Text from '@/components/Text';
import { colors, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type R = RouteProp<RootStackParamList, 'TermsDetail'>;

const content = {
  terms: {
    title: '서비스 이용약관',
    sections: [
      { h: '제1조 (목적)', b: '본 약관은 최저가 항공권 알림 서비스 이용에 관한 회사와 회원 간의 권리·의무 및 책임사항을 규정합니다.' },
      { h: '제2조 (서비스의 내용)', b: '회사는 항공권 가격 검색, 최저가 알림, 가격 추이 분석 등의 정보를 제공합니다. 실제 발권 및 결제는 제휴 판매처에서 이루어집니다.' },
      { h: '제3조 (가격 정보의 책임)', b: '제공되는 가격은 수집 시점 기준이며 실제 구매 가격과 다를 수 있습니다. 회사는 가격 변동에 대해 책임지지 않습니다.' },
    ],
  },
  privacy: {
    title: '개인정보 수집·이용 동의',
    sections: [
      { h: '수집 항목', b: '이메일, 비밀번호, 알림 설정(노선·목표가), 기기 푸시 토큰' },
      { h: '이용 목적', b: '회원 식별, 최저가 알림 발송, 서비스 개선 및 통계 분석' },
      { h: '보유 기간', b: '회원 탈퇴 시까지. 관련 법령에 따라 일정 기간 보관될 수 있습니다.' },
    ],
  },
};

export default function TermsDetailScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<R>();
  const data = content[params.kind];
  return (
    <>
      <Header title={data.title} onBack={() => nav.goBack()} />
      <Screen>
        {data.sections.map((s) => (
          <View key={s.h} style={{ marginBottom: spacing.lg }}>
            <Text variant="heading" weight="semibold" style={{ marginBottom: spacing.xs }}>
              {s.h}
            </Text>
            <Text variant="caption" color={colors.textSecondary}>
              {s.b}
            </Text>
          </View>
        ))}
      </Screen>
    </>
  );
}
