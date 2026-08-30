"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const STRENGTH = 0.35;

export function Magnetic({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * STRENGTH);
    y.set((e.clientY - rect.top - rect.height / 2) * STRENGTH);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
}
