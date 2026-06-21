/**
 * 디자인 토큰 — whypaymore.fig 와이어프레임에서 추출.
 * 배경 #F5F5F5(meta), 폰트 Inter, 위계 28/20/16/13/12/11.
 */

export const colors = {
  bg: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceAlt: '#FAFAFA',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',

  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primarySoft: '#EFF6FF',

  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  success: '#16A34A',
  successSoft: '#F0FDF4',
  warning: '#D97706',
  warningSoft: '#FFFBEB',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
} as const;

/** 와이어프레임의 폰트 크기 위계 */
export const fontSize = {
  display: 28, // 홈 헤드라인
  title: 20, // 화면 타이틀 / 가격
  heading: 16, // 섹션 헤더
  body: 13,
  caption: 12, // 본문/라벨
  micro: 11, // 타임스탬프
} as const;

export const layout = {
  screenWidth: 390,
  gutter: 24,
} as const;
