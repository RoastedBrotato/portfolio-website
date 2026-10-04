"use client";

import { LazyMotion, domAnimation } from "framer-motion";

/**
 * Framer Motion's reduced feature set. Every animated element on the site is
 * an `m.*` component, so the drag, pan and layout-projection code that the
 * full `motion.*` components pull in never ships. `strict` throws in
 * development if a `motion.*` component slips back in.
 *
 * domAnimation covers everything in use: animate / initial / exit, variants,
 * whileInView, whileHover and whileTap. Anything needing drag or `layoutId`
 * would need `domMax` instead — check the bundle cost before switching.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
