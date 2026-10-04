"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

/** The first number in a string, with its thousands separators: "$2,500", "10 active clients". */
const NUMBER = /\d[\d,]*(\.\d+)?/;

/**
 * Counts the first number in `value` up from zero, once, the first time it
 * scrolls into view (audit 6.2: 0.4 s, once). Everything around the number —
 * a currency sign, a unit, words — stays put.
 *
 * The server renders the final text, so there's no layout shift and nothing
 * missing without JS. It only resets to zero on the client if it starts below
 * the fold, where the reset can't be seen; anything already on screen at load,
 * or under reduced motion, just shows the number.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(NUMBER);
  const target = match ? Number(match[0].replace(/,/g, "")) : NaN;
  const [shown, setShown] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el || Number.isNaN(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setShown(0);
    let stop: (() => void) | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const controls = animate(0, target, {
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (n) => setShown(n),
        });
        stop = () => controls.stop();
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      stop?.();
    };
  }, [target]);

  if (!match || Number.isNaN(target)) return <span className={className}>{value}</span>;

  const decimals = match[1] ? match[1].length - 1 : 0;
  const grouped = match[0].includes(",");
  const formatted = shown.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });
  const start = match.index ?? 0;

  return (
    <span ref={ref} className={className}>
      {value.slice(0, start)}
      {/* Tabular figures so the line doesn't jitter as digits change width. */}
      <span className="tabular-nums">{formatted}</span>
      {value.slice(start + match[0].length)}
    </span>
  );
}
