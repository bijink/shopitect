import { useEffect, DependencyList } from 'react';

export default function useDebounceEffect(
   fn: () => void,
   waitTime: number,
   deps?: DependencyList | any,
) {
   useEffect(() => {
      const t = setTimeout(() => {
         fn.apply(undefined, deps);
      }, waitTime);

      return () => {
         clearTimeout(t);
      };
   }, deps);
}
