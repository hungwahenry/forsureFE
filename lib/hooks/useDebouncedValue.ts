import * as React from 'react';

/** Returns `value` after `delay`ms of stability. */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
