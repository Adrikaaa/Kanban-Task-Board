import { useEffect, useState } from "react";

// Clearing the value (empty string) applies immediately so "Clear filters"
// does not briefly show stale results.
export let useDebouncedValue = (value, delay = 200) => {
  let [debounced, setDebounced] = useState(value);

  useEffect(() => {
    let timer = setTimeout(() => setDebounced(value), value === "" ? 0 : delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return value === "" ? "" : debounced;
};
