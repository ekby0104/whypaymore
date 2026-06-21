import { isReached, shouldNotify, runAlertCheck, type MonitorDeps } from './monitor';
import type { PriceAlert } from './AlertsContext';

const base: PriceAlert = {
  id: 'a1',
  from: '인천 (ICN)',
  to: '도쿄 (NRT)',
  targetPrice: 150000,
  tripType: '왕복',
  active: true,
  createdAt: '2025.01.01',
};

describe('isReached / shouldNotify', () => {
  it('현재가가 목표가 이하이면 도달', () => {
    expect(isReached(base, 130000)).toBe(true);
    expect(isReached(base, 150000)).toBe(true);
    expect(isReached(base, 160000)).toBe(false);
    expect(isReached(base, 0)).toBe(false);
  });

  it('비활성/이미 알린 가격은 알림 안 함', () => {
    expect(shouldNotify(base, 130000)).toBe(true);
    expect(shouldNotify({ ...base, active: false }, 130000)).toBe(false);
    expect(shouldNotify({ ...base, lastNotifiedPrice: 130000 }, 130000)).toBe(false);
  });
});

describe('runAlertCheck', () => {
  function makeDeps(lowest: number | Error): { deps: MonitorDeps; updates: any[]; notified: PriceAlert[] } {
    const updates: any[] = [];
    const notified: PriceAlert[] = [];
    const deps: MonitorDeps = {
      fetchLowest: async () => {
        if (lowest instanceof Error) throw lowest;
        return lowest;
      },
      update: (id, patch) => updates.push({ id, patch }),
      notify: (a) => {
        notified.push(a);
      },
      now: () => '2026-06-21 12:00',
    };
    return { deps, updates, notified };
  }

  it('도달 시 상태 갱신 + 알림 발송', async () => {
    const { deps, updates, notified } = makeDeps(130000);
    const results = await runAlertCheck([base], deps);
    expect(results).toEqual([{ id: 'a1', lowest: 130000, reached: true, notified: true }]);
    expect(notified).toHaveLength(1);
    expect(updates[0].patch).toMatchObject({ lastCheckedPrice: 130000, reached: true });
    expect(updates.some((u) => u.patch.lastNotifiedPrice === 130000)).toBe(true);
  });

  it('미도달 시 알림 없이 상태만 갱신', async () => {
    const { deps, notified } = makeDeps(200000);
    const results = await runAlertCheck([base], deps);
    expect(results[0]).toMatchObject({ reached: false, notified: false });
    expect(notified).toHaveLength(0);
  });

  it('비활성 알림은 건너뛴다', async () => {
    const { deps } = makeDeps(100000);
    const results = await runAlertCheck([{ ...base, active: false }], deps);
    expect(results).toHaveLength(0);
  });

  it('조회 실패한 알림은 건너뛴다', async () => {
    const { deps } = makeDeps(new Error('network'));
    const results = await runAlertCheck([base], deps);
    expect(results).toHaveLength(0);
  });
});
