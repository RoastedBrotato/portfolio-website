import { useEffect, useRef } from "react";
import { animate, set } from "animejs";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { easeOut } from "../../animations/presets";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;

    const children = Array.from(root.children);
    set(children, { opacity: 0, translateY: 18 });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animate(children, {
              opacity: [0, 1],
              translateY: [18, 0],
              duration: 650,
              easing: easeOut,
              delay: (_, i) => i * 120
            });
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div className="section-heading" ref={rootRef}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
