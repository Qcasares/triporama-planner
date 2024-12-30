<<<<<<< HEAD
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
=======
import { useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function useDebouncedEffect(
  effect: () => void | (() => void),
  deps: any[],
  delay: number
) {
  useEffect(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...deps, delay]);
}
>>>>>>> 54d26a7fbcfd1dc051a190048cdf74c5ea0cb4ac
