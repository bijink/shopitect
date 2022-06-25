import { useEffect, DependencyList } from 'react';

export default function useDebounceEffect(
   fn: () => void,
   waitTime: number,
   deps?: DependencyList,
) {
   useEffect(() => {
      const t = setTimeout(() => {
         // fn.apply(undefined, deps);
         fn.apply(undefined);
      }, waitTime);

      return () => {
         clearTimeout(t);
      };
   }, deps);
}
