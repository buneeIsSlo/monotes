import { useCallback, useRef } from "react";

/**
 * Returns a debounced version of the provided function.
 * Clears pending timeout on each call, only executes after delay.
 */
export function useDebounced<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delayMs: number
) {
  const timer = useRef<number | null>(null);

  const debouncedFn = useCallback(
    (...args: TArgs) => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => fn(...args), delayMs);
    },
    [fn, delayMs]
  );

  const cancel = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  return { debouncedFn, cancel };
}
