/** whypaymore.fig 와이어프레임에서 추출한 목 데이터 */

export interface Flight {
  id: string;
  depTime: string;
  arrTime: string;
  duration: string;
  stops: string;
  from: string;
  to: string;
  airline: string;
  price: number;
  /** 실데이터(MyRealTrip) 사용 시 실제 예약 페이지 링크 */
  reservationUrl?: string;
}

export const searchResults: Flight[] = [
  { id: 'f1', depTime: '06:30', arrTime: '09:15', duration: '2h 45m', stops: '직항', from: 'ICN', to: 'NRT', airline: '대한항공', price: 89900 },
  { id: 'f2', depTime: '08:00', arrTime: '10:50', duration: '2h 50m', stops: '직항', from: 'ICN', to: 'NRT', airline: '제주항공', price: 74500 },
  { id: 'f3', depTime: '11:20', arrTime: '14:20', duration: '3h 00m', stops: '직항', from: 'ICN', to: 'NRT', airline: '진에어', price: 68000 },
  { id: 'f4', depTime: '14:45', arrTime: '17:40', duration: '2h 55m', stops: '직항', from: 'ICN', to: 'NRT', airline: '아시아나항공', price: 102300 },
  { id: 'f5', depTime: '18:30', arrTime: '21:40', duration: '3h 10m', stops: '1회 경유', from: 'ICN', to: 'NRT', airline: '에어서울', price: 55700 },
];

export const popularRoutes = [
  { route: '인천 → 도쿄', price: 129000 },
  { route: '인천 → 오사카', price: 145000 },
  { route: '인천 → 방콕', price: 198000 },
];

export const recentAlerts = [
  { route: '인천 → 도쿄 · 왕복', detail: '154,000원 → 129,000원 달성', ago: '2일 전' },
  { route: '인천 → 오사카 · 편도', detail: '목표가 도달 알림 발송', ago: '4일 전' },
];

export const alertHistory = [
  { id: 'h1', route: '서울 → 도쿄 (NRT)', type: '가격 하락 알림', tone: 'primary', price: 124900, at: '2025.07.10 09:32' },
  { id: 'h2', route: '서울 → 오사카 (KIX)', type: '목표가 달성 알림', tone: 'success', price: 98000, at: '2025.07.09 14:15' },
  { id: 'h3', route: '서울 → 방콕 (BKK)', type: '특가 알림', tone: 'warning', price: 213500, at: '2025.07.08 22:44' },
  { id: 'h4', route: '서울 → 싱가포르 (SIN)', type: '가격 하락 알림', tone: 'primary', price: 187200, at: '2025.07.07 11:08' },
  { id: 'h5', route: '서울 → 도쿄 (HND)', type: '목표가 달성 알림', tone: 'success', price: 109000, at: '2025.07.06 18:55' },
] as const;

export const calendarDaily = [
  { date: '6월 11일 (수)', price: 98000 },
  { date: '6월 12일 (목)', price: 105000 },
  { date: '6월 18일 (수)', price: 112000 },
  { date: '6월 19일 (목)', price: 118000 },
  { date: '6월 25일 (수)', price: 121000 },
];

export const flexibleDates = [
  { date: '2025년 7월 3일 (목)', nights: '3박 5일', price: 189000, tag: '최저가', tone: 'primary', note: '비수기 구간 진입 시점으로 탑승률이 낮습니다.' },
  { date: '2025년 7월 10일 (목)', nights: '3박 5일', price: 204000, tag: '평균 대비 18% 저렴', tone: 'success', note: '연휴 직전 주로 예약률 상승 전입니다.' },
  { date: '2025년 7월 17일 (목)', nights: '3박 5일', price: 217000, tag: '평균 대비 11% 저렴', tone: 'success', note: '주중 출발로 주말 대비 좌석 여유가 많습니다.' },
  { date: '2025년 8월 5일 (화)', nights: '3박 5일', price: 231000, tag: '평균 대비 5% 저렴', tone: 'neutral', note: '성수기 후반부로 가격 안정화 구간에 해당합니다.' },
  { date: '2025년 8월 19일 (화)', nights: '3박 5일', price: 243000, tag: '평균 수준', tone: 'neutral', note: '성수기 마감 직전으로 잔여 좌석 확보가 유리합니다.' },
] as const;

export const priceExplore = [
  { date: '3월 14일 (금)', route: '인천 → 나리타 · 직항', price: 109000, tag: '최저가', tone: 'primary' },
  { date: '3월 15일 (토)', route: '인천 → 나리타 · 직항', price: 134000, tag: null, tone: 'neutral' },
  { date: '3월 16일 (일)', route: '인천 → 하네다 · 1회 경유', price: 98500, tag: '특가', tone: 'warning' },
  { date: '3월 17일 (월)', route: '인천 → 나리타 · 직항', price: 121000, tag: null, tone: 'neutral' },
  { date: '3월 18일 (화)', route: '인천 → 하네다 · 직항', price: 112500, tag: null, tone: 'neutral' },
] as const;

export const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;
