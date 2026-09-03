"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const EASE = [0.16, 1, 0.3, 1] as const;

const MOTION_TAG = {
  div: motion.div,
  section: motion.section,
} as const;

/** Fade + rise a section's content in as it scrolls into view. */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  as?: keyof typeof MOTION_TAG;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const Tag = as;

  if (reduceMotion) return <Tag className={className}>{children}</Tag>;

  const MotionTag = MOTION_TAG[as];

  return (
    <MotionTag
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px 0px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
