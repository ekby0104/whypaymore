/**
 * 데이터 서비스 계층.
 *
 * - EXPO_PUBLIC_USE_MYREALTRIP=true 이면 MyRealTrip MCP 로 실시간 항공권 검색
 * - 아니면 목 데이터로 폴백 (지연·실패 시뮬레이션 포함)
 *
 * 화면은 이 계층의 `api.*` 만 호출하므로, 데이터 출처가 바뀌어도 화면 코드는 동일하다.
 */
import {
  searchResults,
  popularRoutes,
  recentAlerts,
  alertHistory,
  calendarDaily,
  flexibleDates,
  priceExplore,
  type Flight,
} from '@/data/mock';
import { usingLiveApi, searchLiveFlights, searchFareCalendar } from './myrealtrip';

/** 네트워크 지연 시뮬레이션 (ms) — 목 모드에서만 사용 */
const LATENCY = 600;
/** 0~1, 목 호출 실패 확률. 에러 UI 테스트용. 기본 0 */
export let FAILURE_RATE = 0;
export function setFailureRate(r: number) {
  FAILURE_RATE = r;
}

function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new ApiError('네트워크 오류가 발생했습니다. 다시 시도해 주세요.'));
      } else {
        resolve(value);
      }
    }, ms);
  });
}

export class ApiError extends Error {}

/** 화면에 노출되는 전체 항공사 / 저비용항공사(LCC) 목록 (목 데이터 기준) */
export const AIRLINES = ['대한항공', '아시아나항공', '제주항공', '진에어', '에어서울'];
export const LCC_AIRLINES = ['제주항공', '진에어', '에어서울'];

export interface SearchParams {
  from?: string;
  to?: string;
  date?: string;
  /** 승객 라벨(예: '성인 1명') — 실제 API 의 adults 수 추출에 사용 */
  adults?: string;
  /** 'ONE_WAY' | 'ROUND_TRIP' — 실데이터 호출에 사용 */
  tripType?: 'ONE_WAY' | 'ROUND_TRIP';
  /** 좌석 등급 라벨(예: '이코노미','비즈니스') — 실데이터 cabinClass 매핑 */
  seatClass?: string;
  sort?: 'price' | 'duration' | 'departure';
  directOnly?: boolean;
  morningOnly?: boolean;
  lccOnly?: boolean;
  airlines?: string[];
}

/** 날짜별 최저가 (가격 캘린더/트렌드용) */
export interface FareDate {
  date: string;
  price: number;
  airline?: string;
}
export interface FareParams {
  from?: string;
  to?: string;
  date?: string;
  period?: number;
}

const hour = (t: string) => parseInt(t.slice(0, 2), 10);

/** 공통 필터·정렬 (목/실데이터 모두 동일 적용) */
function applyFiltersAndSort(input: Flight[], params: SearchParams): Flight[] {
  let list = [...input];
  if (params.directOnly) list = list.filter((f) => f.stops === '직항');
  if (params.morningOnly) list = list.filter((f) => hour(f.depTime) < 12);
  if (params.lccOnly) list = list.filter((f) => LCC_AIRLINES.includes(f.airline));
  if (params.airlines && params.airlines.length > 0)
    list = list.filter((f) => params.airlines!.includes(f.airline));

  if (params.sort === 'price') list.sort((a, b) => a.price - b.price);
  else if (params.sort === 'duration') list.sort((a, b) => a.duration.localeCompare(b.duration));
  else if (params.sort === 'departure') list.sort((a, b) => a.depTime.localeCompare(b.depTime));
  return list;
}

/** 직전 검색 결과 (상세 화면의 단일 조회에 사용) */
let lastResults: Flight[] = [...searchResults];

/** 실데이터 사용 여부 (UI 안내용) */
export { usingLiveApi };

export const api = {
  async searchFlights(params: SearchParams = {}): Promise<Flight[]> {
    const base = usingLiveApi
      ? await searchLiveFlights(params)
      : await delay([...searchResults]);
    lastResults = base;
    return applyFiltersAndSort(base, params);
  },

  getFlight(id: string): Promise<Flight | undefined> {
    const found = lastResults.find((f) => f.id === id) ?? searchResults.find((f) => f.id === id);
    return usingLiveApi ? Promise.resolve(found) : delay(found);
  },

  /** 날짜별 최저가 — 라이브면 flightsFareCalendar, 아니면 목 */
  getFareCalendar(params: FareParams = {}): Promise<FareDate[]> {
    if (usingLiveApi) return searchFareCalendar(params);
    return delay(calendarDaily.map((c) => ({ date: c.date, price: c.price })));
  },

  // 아래 데이터는 현재 목 전용
  getPopularRoutes() {
    return delay(popularRoutes);
  },
  getRecentAlerts() {
    return delay(recentAlerts, 400);
  },
  getAlertHistory() {
    return delay([...alertHistory]);
  },
  getCalendarDaily() {
    return delay(calendarDaily);
  },
  getFlexibleDates() {
    return delay([...flexibleDates]);
  },
  getPriceExplore() {
    return delay([...priceExplore]);
  },
};
