/**
 * MyRealTrip(마이리얼트립) MCP 서버 기반 실시간 항공권 클라이언트.
 *
 * MCP(Model Context Protocol) 서버를 JSON-RPC(stateless HTTP)로 직접 호출한다.
 * 별도 API 키가 필요 없으며, EXPO_PUBLIC_USE_MYREALTRIP=true 일 때 활성화된다.
 * (테스트 환경에서는 자동 비활성화 → 목 데이터 사용)
 */
import type { Flight } from '@/data/mock';
import type { SearchParams, FareParams, FareDate } from './api';

const ENDPOINT = 'https://mcp-servers.myrealtrip.com/mcp';

/** 실데이터 사용 여부: 플래그가 켜져 있고 테스트 환경이 아닐 때 */
export const usingLiveApi =
  process.env.EXPO_PUBLIC_USE_MYREALTRIP === 'true' && !process.env.JEST_WORKER_ID;

const DOMESTIC = new Set(['GMP', 'CJU', 'PUS', 'TAE', 'KWJ', 'RSU', 'USN', 'WJU', 'KPO', 'HIN', 'MWX']);

// --- 입력 정규화 ---
export function iata(s?: string): string | undefined {
  if (!s) return undefined;
  const m = s.match(/\(([A-Za-z]{3})\)/) || s.match(/^([A-Za-z]{3})$/);
  return m ? m[1].toUpperCase() : undefined;
}
export function ymd(s?: string): string | undefined {
  if (!s) return undefined;
  const m = s.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
  return m ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}` : undefined;
}
const hhmm = (t?: string) => (t && t.length === 4 ? `${t.slice(0, 2)}:${t.slice(2)}` : t ?? '--:--');
const durStr = (min?: number) => {
  const m = min ?? 0;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
};
const adultsFrom = (s?: string) => {
  const n = s?.match(/\d+/)?.[0];
  return n ? Math.max(1, parseInt(n, 10)) : 1;
};

/** MyRealTrip 항공편 items → 앱 Flight[] (순수 함수, 테스트 대상) */
export function mapItemsToFlights(items: any[]): Flight[] {
  return (items ?? []).map((it) => {
    const legs: any[] = it.legs ?? [];
    const first = legs[0] ?? {};
    const last = legs[legs.length - 1] ?? {};
    return {
      id: String(it.id),
      depTime: hhmm(first.departTime),
      arrTime: hhmm(last.arriveTime),
      duration: durStr(it.travelInfo?.totalDurationMinutes),
      stops: it.travelInfo?.isDirect ? '직항' : `${it.travelInfo?.stops ?? 0}회 경유`,
      from: it.route?.origin ?? first.origin ?? '',
      to: it.route?.destination ?? last.destination ?? '',
      airline: it.airline?.name ?? it.airline?.code ?? '',
      price: it.price?.total ?? 0,
      reservationUrl: it.reservationUrl,
    };
  });
}

async function callTool(name: string, args: Record<string, unknown>): Promise<any> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: { name, arguments: args },
    }),
  });
  if (!res.ok) throw new Error('항공권 정보를 불러오지 못했습니다.');
  const json = await res.json();
  if (json.error) throw new Error(json.error.message ?? '항공권 검색에 실패했습니다.');
  const text = json.result?.content?.[0]?.text;
  if (!text) throw new Error('항공권 검색 결과가 없습니다.');
  return JSON.parse(text);
}

/** 실시간 항공권 검색 (국내/국제 자동 분기) */
export async function searchLiveFlights(params: SearchParams): Promise<Flight[]> {
  const origin = iata(params.from);
  const destination = iata(params.to);
  const departDate = ymd(params.date);
  if (!origin || !destination || !departDate) {
    throw new Error('검색 조건(출발지·도착지·날짜)이 올바르지 않습니다.');
  }
  const domestic = DOMESTIC.has(origin) && DOMESTIC.has(destination);
  const tool = domestic ? 'searchDomesticFlights' : 'searchInternationalFlights';
  const tripType = params.tripType === 'ROUND_TRIP' ? 'ROUND_TRIP' : 'ONE_WAY';

  let cabinClass: 'ECONOMY' | 'BUSINESS' | 'FIRST' = 'ECONOMY';
  if (params.seatClass?.includes('비즈니스')) cabinClass = 'BUSINESS';
  else if (params.seatClass?.includes('퍼스트')) cabinClass = domestic ? 'BUSINESS' : 'FIRST';

  const payload = await callTool(tool, {
    origin,
    destination,
    departDate,
    tripType,
    cabinClass,
    directFlightOnly: !!params.directOnly,
    maxResults: 50,
    passengers: { adults: adultsFrom(params.adults) },
  });
  return mapItemsToFlights(payload?.result?.items ?? []);
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
/** '2026-08-21' → '8월 21일 (금)' */
export function fareLabel(iso: string): string {
  const m = iso.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return `${Number(m[2])}월 ${Number(m[3])}일 (${WEEKDAYS[d.getDay()]})`;
}

/** flightsFareCalendar items → 날짜별 최저가 (날짜당 최저가 1건, 날짜 오름차순) */
export function mapFareItems(items: any[]): FareDate[] {
  const byDate = new Map<string, { date: string; price: number; airline?: string }>();
  for (const it of items ?? []) {
    if (!it) continue;
    const d = it.departureDate;
    const p = it.totalPrice;
    if (typeof d !== 'string' || typeof p !== 'number') continue;
    const cur = byDate.get(d);
    if (!cur || p < cur.price) byDate.set(d, { date: d, price: p, airline: it.airline });
  }
  return [...byDate.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((x) => ({ date: fareLabel(x.date), price: x.price, airline: x.airline }));
}

/** 날짜별 최저가 캘린더 */
export async function searchFareCalendar(params: FareParams): Promise<FareDate[]> {
  const from = iata(params.from);
  const to = iata(params.to);
  const departureDate = ymd(params.date);
  if (!from || !to || !departureDate) {
    throw new Error('검색 조건(출발지·도착지·날짜)이 올바르지 않습니다.');
  }
  const international = !(DOMESTIC.has(from) && DOMESTIC.has(to));
  const payload = await callTool('flightsFareCalendar', {
    from,
    to,
    departureDate,
    period: params.period ?? 4,
    international,
    airlines: ['*'],
  });
  return mapFareItems(payload?.result?.items ?? []);
}
