"use client";

import { useEffect, useState } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const INTERACTIVE = "a, button, [role='button'], input, select, textarea, summary, label, [data-cursor]";

/**
 * The red square, as a cursor companion (audit 6.2). Desktop with a fine
 * pointer only, and never under reduced motion. It follows the pointer on a
 * spring and grows over anything clickable; over an element with
 * `data-cursor="View"` it opens into a label.
 *
 * The native cursor stays: this sits beside it, so nobody loses the pointer
 * they know, and keyboard focus rings are untouched.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    }
    function onOver(event: PointerEvent) {
      const target = (event.target as Element | null)?.closest(INTERACTIVE) as HTMLElement | null;
      setHovering(Boolean(target));
      setLabel(target?.dataset.cursor ?? null);
    }
    function onLeave() {
      setVisible(false);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <m.div
      aria-hidden
      style={{ x: springX, y: springY }}
      className="pointer-events-none fixed top-0 left-0 z-[90]"
    >
      <div
        className={cn(
          "bg-accent text-accent-foreground flex items-center justify-center font-mono text-[10px] font-bold tracking-[0.14em] uppercase transition-[width,height,opacity,transform] duration-200 ease-out",
          // Offset so the square sits just below-right of the native pointer.
          "translate-x-3 translate-y-3",
          visible ? "opacity-100" : "opacity-0",
          label ? "h-7 w-14" : hovering ? "h-4 w-4" : "h-2 w-2",
        )}
      >
        {label}
      </div>
    </m.div>
  );
}
