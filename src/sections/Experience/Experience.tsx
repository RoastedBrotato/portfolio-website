import { useEffect, useRef } from "react";
import { animate, set, stagger } from "animejs";
import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { experienceList } from "../../data/narrative";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { easeOut } from "../../animations/presets";

export function Experience() {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;
    const items = root.querySelectorAll(".experience-item");
    set(items, { opacity: 0, translateX: -28 });
  }, [reduceMotion]);

  useScrollReveal(rootRef, (root) => {
    const items = root.querySelectorAll(".experience-item");
    animate(items, {
      opacity: [0, 1],
      translateX: [-28, 0],
      duration: 700,
      easing: easeOut,
      delay: stagger(100, { start: 200 })
    });
  }, reduceMotion);

  return (
    <section className="content-section experience-section" id="experience" ref={rootRef}>
      <SectionHeading
        eyebrow="Experience"
        title="The experience section is scaffolded now and can be tightened once you send the resume details."
        description="I've kept the visual treatment strong enough to evaluate the page rhythm without pretending placeholder content is final."
      />

      <div className="experience-list">
        {experienceList.map((item) => (
          <article className="experience-item" key={`${item.company}-${item.title}`}>
            <p className="meta">{item.period}</p>
            <h3>{item.title}</h3>
            <p className="company">{item.company}</p>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
