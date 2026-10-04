"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const EASE = [0.16, 1, 0.3, 1] as const;

export type RevealWord = { text: string; emphasis?: boolean };

function toWords(children: string | RevealWord[]): RevealWord[] {
  if (typeof children === "string") {
    return children.split(" ").map((text) => ({ text }));
  }
  return children;
}

/**
 * Per-word mask-and-lift text reveal — same mechanic Hero.tsx used inline
 * for its on-load headline, generalized so it can also run on scroll
 * (trigger="inView") for headings further down the page.
 */
export function RevealText({
  children,
  as: Tag = "span",
  className,
  trigger = "inView",
  delay = 0,
  stagger = 0.05,
}: {
  children: string | RevealWord[];
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
  className?: string;
  trigger?: "mount" | "inView";
  delay?: number;
  stagger?: number;
}) {
  const reduceMotion = useReducedMotion();
  const words = toWords(children);

  /*
   * On-load reveals run in CSS, not Framer: the keyframes start at first paint,
   * so a headline is never held invisible waiting for JavaScript to hydrate.
   * On a slow phone connection that wait was the page's LCP. Reduced motion
   * is handled by the global rule in globals.css, which collapses the
   * animation to its end state.
   */
  if (trigger === "mount") {
    return (
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={i} className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-bottom">
            <span
              className="reveal-word inline-block"
              style={{ animationDelay: `${delay + i * stagger}s` }}
            >
              {word.emphasis ? <em className="italic text-accent">{word.text}</em> : word.text}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        ))}
      </Tag>
    );
  }

  if (reduceMotion) {
    return (
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={i}>
            {word.emphasis ? <em className="italic text-accent">{word.text}</em> : word.text}
            {/* A plain space here: these spans are inline, so a non-breaking
                one (needed in the inline-block branch below) stops the line
                wrapping and pushes long headings off the side of a phone. */}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Tag>
    );
  }

  const motionProps = {
    initial: { y: "110%" },
    whileInView: { y: 0 },
    viewport: { once: true, margin: "-100px 0px" },
  };

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-bottom"
        >
          <m.span
            className="inline-block"
            {...motionProps}
            transition={{ duration: 0.75, delay: delay + i * stagger, ease: EASE }}
          >
            {word.emphasis ? <em className="italic text-accent">{word.text}</em> : word.text}
            {i < words.length - 1 ? " " : ""}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}
