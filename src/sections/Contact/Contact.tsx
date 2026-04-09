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
    <section className="scene scene-contact contact-section" id="contact" ref={rootRef}>
      <div className="contact-shell">
        <div className="contact-lead">
          <p className="contact-kicker">Get in touch</p>
          <h2>Got a project in mind?</h2>
          <p>
            Available for freelance projects, full-time roles, and the right kind of collaboration.
            Reach out and let&apos;s see if there&apos;s a fit.
          </p>
        </div>

        <div className="contact-actions">
          <div className="contact-links">
            <a href="mailto:hello@example.com">hello@example.com</a>
            <a href="https://github.com/example" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/example" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
          <div className="contact-meta">
            <span>Based in Qatar</span>
            <span>Open to remote &amp; on-site</span>
          </div>
        </div>

        <div className="contact-footer-bar">
          <span>© {new Date().getFullYear()} Waleed</span>
          <nav className="contact-footer-nav" aria-label="Footer navigation">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
          </nav>
          <span>Qatar · Creative Developer</span>
        </div>
      </div>
    </section>
  );
}
