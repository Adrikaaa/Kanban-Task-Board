import { useCallback, useEffect, useState } from "react";

const DEFAULT_DURATION = 4000;

export let useToast = () => {
  let [toast, setToast] = useState(null);

  let showToast = useCallback((message, tone = "info", duration = DEFAULT_DURATION) => {
    setToast({ id: Date.now(), message, tone, duration });
  }, []);

  let dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast) return;
    let timer = setTimeout(() => setToast(null), toast.duration);
    return () => clearTimeout(timer);
  }, [toast]);

  return { toast, showToast, dismissToast };
};
