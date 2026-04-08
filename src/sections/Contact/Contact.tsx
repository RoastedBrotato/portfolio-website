import { useEffect, useRef } from "react";
import { animate, set, stagger } from "animejs";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { easeOut } from "../../animations/presets";

export function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;
    const els = root.querySelectorAll(".contact-kicker, h2, p, .contact-links");
    set(els, { opacity: 0, translateY: 24 });
  }, [reduceMotion]);

  useScrollReveal(rootRef, (root) => {
    const els = root.querySelectorAll(".contact-kicker, h2, p, .contact-links");
    animate(els, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 750,
      easing: easeOut,
      delay: stagger(130)
    });
  }, reduceMotion);

  return (
    <section className="content-section contact-section" id="contact" ref={rootRef}>
      <p className="contact-kicker">Contact</p>
      <h2>If you need someone to untangle the brief and ship the thing, let's talk.</h2>
      <p>
        Placeholder links for now. Once you send the final contact details, this section can
        become the clean close to the page.
      </p>
      <div className="contact-links">
        <a href="mailto:hello@example.com">hello@example.com</a>
        <a href="https://github.com/example">GitHub</a>
        <a href="https://linkedin.com/in/example">LinkedIn</a>
      </div>
    </section>
  );
}
