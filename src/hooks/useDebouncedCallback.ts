import { useEffect, useMemo, useRef } from 'react';

type Callback<T extends (...args: any[]) => void> = T;

export const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: Callback<T>,
  delay: number
) => {
  const cbRef = useRef(callback);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return useMemo(
    () =>
      ((...args: Parameters<T>) => {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
          cbRef.current(...args);
        }, delay);
      }) as Callback<T>,
    [delay]
  );
};
