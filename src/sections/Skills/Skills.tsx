import { useEffect, useRef } from "react";
import { animate, set } from "animejs";
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
    <section className="content-section scene scene-skills" id="skills" ref={rootRef}>
      <div className="skills-copy">
        <p className="meta" data-reveal>Skills</p>
        <h2 data-reveal>Interface craft. Technical depth. Product sense.</h2>
        <p data-reveal>A capability map — not a badge wall.</p>
      </div>
      <canvas
        ref={canvasRef}
        className="skills-canvas"
        aria-hidden="true"
      />
    </section>
  );
}
