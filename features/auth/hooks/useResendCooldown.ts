import { useEffect, useRef, useState } from 'react';

/**
 * Tracks a countdown after sending an OTP. Call `start()` once you've
 * dispatched a request-code mutation; the hook ticks down `secondsLeft`
 * to 0 and exposes a `canResend` flag.
 *
 * Server enforces a 60s cooldown too — this is purely UX so the resend
 * button is visibly disabled and shows the timer.
 */
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

  return {
    secondsLeft,
    canResend: secondsLeft <= 0,
    start: (seconds = initialSeconds) => setSecondsLeft(seconds),
    reset: () => setSecondsLeft(0),
  };
}
