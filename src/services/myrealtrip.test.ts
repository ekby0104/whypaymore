import { mapItemsToFlights, mapFareItems, fareLabel, iata, ymd } from './myrealtrip';

describe('MyRealTrip 입력 정규화', () => {
  it('iata 는 도시 라벨에서 공항 코드를 뽑는다', () => {
    expect(iata('인천 (ICN)')).toBe('ICN');
    expect(iata('NRT')).toBe('NRT');
    expect(iata('도쿄')).toBeUndefined();
  });
  it('ymd 는 YYYY-MM-DD 로 정규화한다', () => {
    expect(ymd('2026.07.01')).toBe('2026-07-01');
    expect(ymd('2026-7-1')).toBe('2026-07-01');
  });
});

describe('mapItemsToFlights', () => {
  const items = [
    {
      id: '1:1',
      airline: { code: 'ZE', name: '이스타항공' },
      route: { origin: 'ICN', destination: 'NRT' },
      travelInfo: { totalDurationMinutes: 145, stops: 0, isDirect: true },
      legs: [{ departTime: '0725', arriveTime: '0950', origin: 'ICN', destination: 'NRT' }],
      price: { currency: 'KRW', total: 137500 },
      reservationUrl: 'https://flights.myrealtrip.com/air/x',
    },
    {
      id: '2:1',
      airline: { code: '7C', name: '제주항공' },
      route: { origin: 'ICN', destination: 'NRT' },
      travelInfo: { totalDurationMinutes: 310, stops: 1, isDirect: false },
      legs: [
        { departTime: '1830', arriveTime: '2100' },
        { departTime: '2200', arriveTime: '2340' },
      ],
      price: { total: 120000 },
    },
  ];

  it('실시간 항공편을 앱 Flight 형태로 매핑한다', () => {
    const flights = mapItemsToFlights(items);
    expect(flights[0]).toMatchObject({
      id: '1:1',
      depTime: '07:25',
      arrTime: '09:50',
      duration: '2h 25m',
      stops: '직항',
      from: 'ICN',
      to: 'NRT',
      airline: '이스타항공',
      price: 137500,
      reservationUrl: 'https://flights.myrealtrip.com/air/x',
    });
  });

  it('경유편의 stops·마지막 도착시각을 처리한다', () => {
    const flights = mapItemsToFlights(items);
    expect(flights[1]).toMatchObject({
      stops: '1회 경유',
      arrTime: '23:40',
      airline: '제주항공',
      price: 120000,
    });
  });

  it('빈 입력은 빈 배열을 반환한다', () => {
    expect(mapItemsToFlights([])).toEqual([]);
  });
});

describe('mapFareItems (가격 캘린더)', () => {
  it('날짜당 최저가 1건으로 묶고 날짜 오름차순 정렬한다', () => {
    const items = [
      { departureDate: '2026-07-10', totalPrice: 180000, airline: 'KE' },
      { departureDate: '2026-07-05', totalPrice: 150000, airline: 'OZ' },
      { departureDate: '2026-07-05', totalPrice: 130000, airline: '7C' }, // 같은 날 더 저렴
    ];
    const fares = mapFareItems(items);
    expect(fares).toHaveLength(2);
    expect(fares[0].price).toBe(130000); // 7/5 최저가
    expect(fares[1].price).toBe(180000); // 7/10
  });

  it('fareLabel 은 ISO 날짜를 M월 D일 (요일) 로 바꾼다', () => {
    expect(fareLabel('2026-07-05')).toMatch(/^7월 5일 \(.\)$/);
  });

  it('잘못된 항목은 건너뛴다', () => {
    expect(mapFareItems([{ departureDate: '2026-07-05' }, {}, null as any])).toEqual([]);
  });
});
