import { useCallback, useEffect, useRef, useState } from 'react';

// Pure UX timer; server enforces its own 60s cooldown server-side.
export function useResendCooldown(initialSeconds = 60) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [secondsLeft]);

  const start = useCallback(
    (seconds = initialSeconds) => setSecondsLeft(seconds),
    [initialSeconds],
  );
  const reset = useCallback(() => setSecondsLeft(0), []);

  return {
    secondsLeft,
    canResend: secondsLeft <= 0,
    start,
    reset,
  };
}
