import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
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

    // Initial reveal: dots pop in from center outward
    animate(dots, {
      scale: [0, 1],
      opacity: [0, 1],
      duration: 600,
      easing: "outBack(1.5)",
      delay: stagger(45, { grid: [COLS, ROWS], from: "center" })
    }).then(() => {
      // Then loop a continuous ripple wave forever
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
    <section className="content-section showcase-section" id="showcase" ref={rootRef}>
      <SectionHeading
        eyebrow="Showcase"
        title="Motion, interaction studies, and visual experiments can sit here once we decide how far to push the site."
        description="For now this acts as a visual breathing point between the process story and the more practical credentials below."
      />

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
