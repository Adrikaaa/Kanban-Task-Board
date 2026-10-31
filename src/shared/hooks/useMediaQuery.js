import { useCallback, useSyncExternalStore } from "react";

export let useMediaQuery = (query) => {
  let subscribe = useCallback(
    (onChange) => {
      let media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
};
