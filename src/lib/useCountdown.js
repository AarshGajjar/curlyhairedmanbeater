import { useEffect, useRef, useState } from 'react';

/**
 * Pausable 1s countdown.
 * - `seconds`  : starting value
 * - `running`  : whether the timer should be ticking at all
 * - `resetKey` : change this to restart from `seconds` (e.g. new set / new side)
 * - `onDone`   : called once when it hits 0
 */
export function useCountdown({ seconds, running, resetKey, onDone }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [paused, setPaused] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    setTimeLeft(seconds);
    setPaused(false);
  }, [seconds, running, resetKey]);

  useEffect(() => {
    if (!running || paused) return undefined;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(id);
          queueMicrotask(() => doneRef.current?.());
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, paused, seconds, resetKey]);

  return { timeLeft, paused, toggle: () => setPaused(p => !p) };
}
