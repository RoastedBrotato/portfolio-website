"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The hero's interactive element: a soft accent glow on the grid lines that
 * follows the pointer, and fades out when it leaves.
 *
 * Pure CSS doing the drawing — a second grid, in the accent colour, masked by a
 * radial gradient centred on two custom properties. The script only moves
 * those properties, at most once per frame. A gradient has no edges, so there
 * is nothing to leave behind: when the pointer stops, the glow simply sits
 * where it is; when it leaves the hero, the layer fades to nothing.
 *
 * Mouse and pen only — on touch there is no hover to follow, so the static grid
 * is the whole hero. Reduced motion renders nothing.
 */
export function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const layer = ref.current;
    const host = layer?.parentElement;
    if (reduceMotion || !layer || !host) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    function apply() {
      frame = 0;
      layer!.style.setProperty("--spot-x", `${x}px`);
      layer!.style.setProperty("--spot-y", `${y}px`);
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      const rect = host!.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      layer!.style.opacity = "1";
      if (!frame) frame = requestAnimationFrame(apply);
    }

    function onLeave() {
      layer!.style.opacity = "0";
    }

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="hero-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
    />
  );
}
