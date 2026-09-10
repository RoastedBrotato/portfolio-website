"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

/*
 * A band of oversized type that slides sideways as the page scrolls past it.
 *
 * The movement is scroll-linked rather than time-based: nothing animates on its
 * own, so the reader drives it and the band is dead still if they stop. Words
 * alternate solid and outlined because a solid wall of type at this size fights
 * the cards that sit on top of it.
 */

const PHRASES = ["Testimonials", "Reviews"];
/** Enough copies that neither edge of the row is ever inside the viewport. */
const REPEATS = 4;

/**
 * Percentages of the row's own width. Starting negative means the first word is
 * already cut off by the left edge, which reads as a slice of something longer
 * rather than as a heading that happens to start here.
 */
const START = "-12%";
const END = "-46%";

export function ScrollMarquee({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // "start end" → the band's top meets the viewport bottom; "end start" → its
  // bottom meets the viewport top. So progress spans the band's full pass.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [START, END]);

  const words = Array.from({ length: REPEATS }).flatMap((_, repeat) =>
    PHRASES.map((phrase, i) => ({
      phrase,
      key: `${repeat}-${i}`,
      outlined: i % 2 === 1,
    })),
  );

  const row = (
    <div className="font-display flex w-max items-baseline gap-[0.35em] text-[clamp(3.25rem,14vw,13rem)] leading-[0.95] font-bold tracking-tight whitespace-nowrap">
      {words.map(({ phrase, key, outlined }) => (
        <span key={key} className="flex items-baseline gap-[0.35em]">
          <span className={outlined ? "text-outline" : "text-foreground"}>{phrase}</span>
          <span aria-hidden className="bg-accent h-[0.07em] w-[0.26em] shrink-0 self-center" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none select-none overflow-hidden", className)}
    >
      {reduceMotion ? (
        <div style={{ transform: `translateX(${START})` }}>{row}</div>
      ) : (
        <motion.div style={{ x }}>{row}</motion.div>
      )}
    </div>
  );
}
