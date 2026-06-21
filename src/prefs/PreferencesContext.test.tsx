import { ReactNode } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { PreferencesProvider, usePreferences, defaultPrefs } from './PreferencesContext';

const wrapper = ({ children }: { children: ReactNode }) => (
  <PreferencesProvider>{children}</PreferencesProvider>
);

describe('PreferencesContext', () => {
  it('기본값으로 시작한다', async () => {
    const { result } = renderHook(() => usePreferences(), { wrapper });
    await waitFor(() => expect(result.current.prefs).toEqual(defaultPrefs));
  });

  it('toggleType 으로 유형 토글을 뒤집는다', async () => {
    const { result } = renderHook(() => usePreferences(), { wrapper });
    await waitFor(() => expect(result.current.prefs).toBeTruthy());
    const before = result.current.prefs.types.deadline;

    act(() => result.current.toggleType('deadline'));

    expect(result.current.prefs.types.deadline).toBe(!before);
  });

  it('toggleChannel 은 다른 채널에 영향을 주지 않는다', async () => {
    const { result } = renderHook(() => usePreferences(), { wrapper });
    await waitFor(() => expect(result.current.prefs).toBeTruthy());

    act(() => result.current.toggleChannel('inApp'));

    expect(result.current.prefs.channels.inApp).toBe(true);
    expect(result.current.prefs.channels.push).toBe(defaultPrefs.channels.push);
  });

  it('update 로 통화/테마를 변경한다', async () => {
    const { result } = renderHook(() => usePreferences(), { wrapper });
    await waitFor(() => expect(result.current.prefs).toBeTruthy());

    act(() => result.current.update({ currency: 'USD', theme: 'dark' }));

    expect(result.current.prefs.currency).toBe('USD');
    expect(result.current.prefs.theme).toBe('dark');
  });
});
