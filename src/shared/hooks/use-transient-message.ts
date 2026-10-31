import { useCallback, useEffect, useRef, useState } from 'react';

export interface TransientMessage {
  /** Current message, or `null` once it has timed out. */
  readonly message: string | null;
  readonly show: (message: string) => void;
}

/**
 * Holds a short-lived message (toast text). Showing a new message restarts the
 * timer, and the timer is cleared on unmount so it never fires late.
 */
export function useTransientMessage(durationMs = 2400): TransientMessage {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  const show = useCallback(
    (next: string) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      setMessage(next);
      timer.current = setTimeout(() => setMessage(null), durationMs);
    },
    [durationMs],
  );

  return { message, show };
}
