import { useEffect } from "react";
import { animate, set, stagger } from "animejs";

/**
 * Global scroll-reveal system.
 * Elements with [data-reveal] fade and translate up when they enter the viewport.
 * Call once at the app root.
 */
export function useReveal(reduceMotion = false) {
  useEffect(() => {
    if (reduceMotion) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!targets.length) return;

    set(targets, { opacity: 0, translateY: 48 });

    const revealed = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && !revealed.has(e.target))
          .map((e) => e.target);

        if (!visible.length) return;

        visible.forEach((el) => revealed.add(el));

        animate(visible, {
          opacity: [0, 1],
          translateY: [48, 0],
          duration: 800,
          easing: "outCubic",
          delay: stagger(80)
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reduceMotion]);
}
