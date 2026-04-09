import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const COLS = 13;
const ROWS = 7;
const DOT_COUNT = COLS * ROWS;

export function Showcase() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useScrollReveal(rootRef, () => {
    const grid = gridRef.current;
    if (!grid) return;

    const dots = grid.querySelectorAll(".dot-cell");

    animate(dots, {
      scale: [0, 1],
      opacity: [0, 1],
      duration: 600,
      easing: "outBack(1.5)",
      delay: stagger(45, { grid: [COLS, ROWS], from: "center" })
    }).then(() => {
      animate(dots, {
        scale: [0.6, 1.3, 0.6],
        opacity: [0.25, 1, 0.25],
        duration: 2600,
        easing: "inOutSine",
        delay: stagger(80, { grid: [COLS, ROWS], from: "center" }),
        loop: true
      });
    });
  }, reduceMotion);

  return (
    <section className="content-section scene scene-showcase" id="showcase" ref={rootRef}>
      <div className="showcase-copy">
        <p className="meta" data-reveal>Showcase</p>
        <h2 data-reveal>Motion with authorship.</h2>
      </div>

      <div
        ref={gridRef}
        className="dot-grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        aria-hidden="true"
      >
        {Array.from({ length: DOT_COUNT }, (_, i) => (
          <div key={i} className="dot-cell" />
        ))}
      </div>
    </section>
  );
}
