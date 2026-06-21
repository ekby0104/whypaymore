import { api, setFailureRate, LCC_AIRLINES } from './api';

afterEach(() => setFailureRate(0));

describe('api.searchFlights', () => {
  it('직항만 필터는 경유편을 제외한다', async () => {
    const r = await api.searchFlights({ directOnly: true });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((f) => f.stops === '직항')).toBe(true);
  });

  it('오전 출발 필터는 12시 이전 항공편만 남긴다', async () => {
    const r = await api.searchFlights({ morningOnly: true });
    expect(r.every((f) => parseInt(f.depTime.slice(0, 2), 10) < 12)).toBe(true);
  });

  it('LCC 필터는 저비용항공사만 남긴다', async () => {
    const r = await api.searchFlights({ lccOnly: true });
    expect(r.every((f) => LCC_AIRLINES.includes(f.airline))).toBe(true);
  });

  it('항공사 필터는 선택한 항공사만 남긴다', async () => {
    const r = await api.searchFlights({ airlines: ['진에어'] });
    expect(r.every((f) => f.airline === '진에어')).toBe(true);
  });

  it('가격 오름차순 정렬', async () => {
    const r = await api.searchFlights({ sort: 'price' });
    const prices = r.map((f) => f.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('실패율 1이면 ApiError 로 reject 된다', async () => {
    setFailureRate(1);
    await expect(api.searchFlights()).rejects.toThrow();
  });
});

describe('api.getFlight', () => {
  it('id 로 단일 항공편을 반환한다', async () => {
    const f = await api.getFlight('f1');
    expect(f?.id).toBe('f1');
  });
});
