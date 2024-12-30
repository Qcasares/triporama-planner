import { useEffect, useRef, useState } from 'react';

export const useDebouncedEffect = (
  effect: () => void,
  deps: unknown[],
  delay: number
) => {
  const callback = useRef(effect);

  useEffect(() => {
    callback.current = effect;
  }, [effect]);

  useEffect(() => {
    const handler = setTimeout(() => callback.current(), delay);
    return () => clearTimeout(handler);
  }, [delay, ...deps]); // Moved delay to start of array to avoid spread warning
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useDebouncedEffect(
    () => {
      setDebouncedValue(value);
    },
    [value],
    delay
  );

  return debouncedValue;
};
