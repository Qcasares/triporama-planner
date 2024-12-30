declare module 'useDebounce' {
  import { DependencyList } from 'react';

  export const useDebounce: (
    effect: () => void,
    deps: DependencyList,
    delay: number
  ) => void;
}
