import { useCallback, useRef } from "react";

const useDebounce = (debounceTime: number) => {
  const timeout = useRef<number | undefined>(undefined);

  const reset = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }
  }, []);

  const set = useCallback((callback: () => void) => {
    reset();
    timeout.current = setTimeout(callback, debounceTime);
  }, []);

  return { set, reset };
};

export default useDebounce;
