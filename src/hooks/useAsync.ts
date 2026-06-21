import { useCallback, useEffect, useState } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  reload: () => void;
}

/**
 * Promise 를 반환하는 함수를 호출해 loading/error/data 상태를 관리한다.
 * deps 가 바뀌면 자동 재호출하며, reload() 로 수동 재시도할 수 있다.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // fn 은 매 렌더 새로 생성되므로 deps 기준으로 고정한다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  const execute = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);
    run()
      .then((res) => {
        if (active) setData(res);
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [run]);

  useEffect(execute, [execute]);

  return { data, loading, error, reload: execute };
}
