import { useMemo, useRef } from "react";

export type ValueRef<T> = {
  readonly get: T;
  set: (newValue: T, skipUpdate?: boolean) => void;
};

type UseValueExtraParams<T> = {
  onUpdate?: (value: T) => void;
};

const useValue = <T>(
  defaultValue: T,
  params: UseValueExtraParams<T> = {}
): ValueRef<T> => {
  const value = useRef<T>(defaultValue);

  const valueRef: ValueRef<T> = useMemo(
    () => ({
      get get(): T {
        return value.current;
      },
      set: (newValue: T, skipUpdate = false) => {
        value.current = newValue;
        !skipUpdate && params.onUpdate?.(newValue);
      },
    }),
    []
  );

  return valueRef;
};

export default useValue;
