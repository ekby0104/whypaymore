import type { PriceAlert } from './AlertsContext';

/** 목표가 도달 여부 (현재 최저가 <= 목표가) */
export function isReached(alert: Pick<PriceAlert, 'targetPrice'>, lowest: number): boolean {
  return lowest > 0 && lowest <= alert.targetPrice;
}

/** 알림을 보내야 하는가 (도달 + 직전에 보낸 가격과 다름 → 중복 방지) */
export function shouldNotify(alert: PriceAlert, lowest: number): boolean {
  return alert.active && isReached(alert, lowest) && lowest !== alert.lastNotifiedPrice;
}

export interface CheckResult {
  id: string;
  lowest: number;
  reached: boolean;
  notified: boolean;
}

export interface MonitorDeps {
  /** 노선의 현재 최저가를 조회 (실패 시 throw) */
  fetchLowest: (alert: PriceAlert) => Promise<number>;
  /** 알림 상태 갱신 */
  update: (id: string, patch: Partial<PriceAlert>) => void;
  /** 목표가 도달 알림 발송 */
  notify: (alert: PriceAlert, lowest: number) => Promise<void> | void;
  /** 현재 시각 문자열 */
  now: () => string;
}

/** 활성 알림들의 가격을 확인하고, 도달 시 알림 발송 + 상태 갱신 */
export async function runAlertCheck(alerts: PriceAlert[], deps: MonitorDeps): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  for (const alert of alerts) {
    if (!alert.active) continue;
    let lowest = 0;
    try {
      lowest = await deps.fetchLowest(alert);
    } catch {
      continue; // 조회 실패한 알림은 건너뜀
    }
    const reached = isReached(alert, lowest);
    const notify = shouldNotify(alert, lowest);
    deps.update(alert.id, { lastCheckedPrice: lowest, lastCheckedAt: deps.now(), reached });
    if (notify) {
      await deps.notify(alert, lowest);
      deps.update(alert.id, { lastNotifiedPrice: lowest });
    }
    results.push({ id: alert.id, lowest, reached, notified: notify });
  }
  return results;
}
