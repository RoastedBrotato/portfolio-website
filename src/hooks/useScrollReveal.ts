import { useEffect, type RefObject } from "react";

export function useScrollReveal(
  ref: RefObject<Element | null>,
  onVisible: (root: Element) => void,
  reduceMotion = false
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onVisible(el);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // onVisible is intentionally excluded — it's always a stable inline closure
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);
}
