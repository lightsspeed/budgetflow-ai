import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  decimals?: number;
  locale?: string;
  enabled?: boolean;
}

/** Animates a number from 0 to `end` over `duration` ms with easing. */
export function useCountUp({
  end,
  duration = 1200,
  prefix = "",
  suffix = "",
  decimals = 0,
  locale = "en-IN",
  enabled = true,
}: UseCountUpOptions): string {
  const [display, setDisplay] = useState<number>(0);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const prevEnd = useRef<number>(end);

  useEffect(() => {
    if (!enabled) {
      setDisplay(end);
      return;
    }

    const startValue = prevEnd.current !== end ? display : 0;
    prevEnd.current = end;
    const startNum = startValue;
    const diff = end - startNum;

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(startNum + diff * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };

    startRef.current = null;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, enabled, duration]);

  const formatted = display.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${prefix}${formatted}${suffix}`;
}
