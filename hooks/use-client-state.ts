"use client";

import { useEffect, useState } from "react";

// localStorage isn't available during SSR, so pages hydrate their data in an
// effect after mount (SSR markup renders the loading state and never
// disagrees with the client). This is the one sanctioned
// setState-in-an-effect in the app — every storage-backed page goes through
// it. `load` must be referentially stable (a module function, or wrapped in
// useCallback when it closes over route params).
// `undefined` means "not hydrated yet" — pages render their loading state on
// it without conflating it with a legitimately-missing record (e.g. null).
export function useClientState<T>(load: () => T) {
  const [value, setValue] = useState<T | undefined>(undefined);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- storage hydration must happen post-mount
    setValue(load());
  }, [load]);
  return [value, setValue] as const;
}
