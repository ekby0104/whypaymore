import type { Option } from '@/components/PickerField';

export const AIRPORTS: Option[] = [
  '인천 (ICN)', '김포 (GMP)', '부산 (PUS)', '제주 (CJU)',
  '도쿄 (NRT)', '오사카 (KIX)', '후쿠오카 (FUK)', '오키나와 (OKA)',
  '방콕 (BKK)', '다낭 (DAD)', '싱가포르 (SIN)', '홍콩 (HKG)',
  '파리 (CDG)', '런던 (LHR)', '뉴욕 (JFK)', '로스앤젤레스 (LAX)',
].map((s) => ({ label: s, value: s }));

export const PASSENGERS: Option[] = [1, 2, 3, 4, 5, 6].map((n) => ({
  label: `성인 ${n}명`,
  value: `성인 ${n}명`,
}));

export const SEATS: Option[] = ['이코노미', '프리미엄 이코노미', '비즈니스', '퍼스트'].map((s) => ({
  label: s,
  value: s,
}));

export const TRIP_TYPES: Option[] = [
  { label: '편도', value: '편도' },
  { label: '왕복', value: '왕복' },
];

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const pad = (n: number) => String(n).padStart(2, '0');

/** 오늘+startOffset 부터 count 일치의 날짜 옵션 ('YYYY.MM.DD (요일)') */
export function dateOptions(startOffset = 1, count = 120): Option[] {
  const out: Option[] = [];
  for (let i = startOffset; i < startOffset + count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const v = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
    out.push({ label: `${v} (${WEEKDAYS[d.getDay()]})`, value: v });
  }
  return out;
}

export function futureDate(days: number): string {
  return dateOptions(days, 1)[0].value;
}
