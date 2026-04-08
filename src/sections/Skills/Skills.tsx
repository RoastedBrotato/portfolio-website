import { useEffect, useRef } from "react";
import { animate, set } from "animejs";
import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { skills } from "../../data/narrative";
import { startSkillsNetwork } from "../../animations/skills-network";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export function Skills() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    set(canvas, { opacity: 0 });
    const cleanup = startSkillsNetwork(canvas, skills);
    return cleanup;
  }, []);

  useScrollReveal(rootRef, (root) => {
    const canvas = root.querySelector(".skills-canvas");
    if (canvas) {
      animate(canvas, {
        opacity: [0, 1],
        duration: 1200,
        easing: "outCubic"
      });
    }
  }, reduceMotion);

  return (
    <section className="content-section skills-section" id="skills" ref={rootRef}>
      <SectionHeading
        eyebrow="Skills"
        title="A blended stack of interface craft, technical execution, and product sense."
        description="These are placeholders for now, grouped visually as a capability field rather than a badge wall."
      />
      <canvas
        ref={canvasRef}
        className="skills-canvas"
        aria-hidden="true"
      />
    </section>
  );
}
