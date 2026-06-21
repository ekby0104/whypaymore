import { ReactNode } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AlertsProvider, useAlerts } from './AlertsContext';

const wrapper = ({ children }: { children: ReactNode }) => <AlertsProvider>{children}</AlertsProvider>;

describe('AlertsContext', () => {
  it('기본 시드 알림으로 시작한다', async () => {
    const { result } = renderHook(() => useAlerts(), { wrapper });
    await waitFor(() => expect(result.current.alerts.length).toBeGreaterThanOrEqual(2));
  });

  it('addAlert 로 새 알림을 맨 앞에 추가한다', async () => {
    const { result } = renderHook(() => useAlerts(), { wrapper });
    await waitFor(() => expect(result.current.alerts.length).toBeGreaterThanOrEqual(2));
    const before = result.current.alerts.length;

    act(() => {
      result.current.addAlert({ from: '서울 (ICN)', to: '파리 (CDG)', targetPrice: 500000, tripType: '왕복' });
    });

    expect(result.current.alerts.length).toBe(before + 1);
    expect(result.current.alerts[0].to).toBe('파리 (CDG)');
    expect(result.current.alerts[0].active).toBe(true);
    expect(result.current.alerts[0].id).toBeTruthy();
  });

  it('togglePause 로 활성 상태를 뒤집는다', async () => {
    const { result } = renderHook(() => useAlerts(), { wrapper });
    await waitFor(() => expect(result.current.alerts.length).toBeGreaterThanOrEqual(2));
    const id = result.current.alerts[0].id;
    const wasActive = result.current.alerts[0].active;

    act(() => result.current.togglePause(id));

    expect(result.current.getAlert(id)?.active).toBe(!wasActive);
  });

  it('updateAlert 로 목표가를 수정한다', async () => {
    const { result } = renderHook(() => useAlerts(), { wrapper });
    await waitFor(() => expect(result.current.alerts.length).toBeGreaterThanOrEqual(2));
    const id = result.current.alerts[0].id;

    act(() => result.current.updateAlert(id, { targetPrice: 99000 }));

    expect(result.current.getAlert(id)?.targetPrice).toBe(99000);
  });

  it('removeAlert 로 알림을 삭제한다', async () => {
    const { result } = renderHook(() => useAlerts(), { wrapper });
    await waitFor(() => expect(result.current.alerts.length).toBeGreaterThanOrEqual(2));
    const id = result.current.alerts[0].id;

    act(() => result.current.removeAlert(id));

    expect(result.current.getAlert(id)).toBeUndefined();
  });
});
