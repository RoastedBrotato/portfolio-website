"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { HeroGrid } from "@/components/HeroGrid";
import { useSceneTier } from "@/lib/useSceneTier";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// three.js only downloads for devices that get the scene.
const HeroScene = dynamic(() => import("@/components/scene/HeroScene"), { ssr: false });

/** Fades the field into the next section and keeps the edges quiet. */
const EDGE_MASK =
  "[mask-image:linear-gradient(to_bottom,black_55%,transparent),linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [mask-composite:intersect]";

/**
 * Picks and mounts the hero's backdrop.
 *
 * The page paints first: the static grid in Hero.tsx is the poster, and the
 * tier is only decided once the main thread is idle after hydration, so the
 * scene never competes with LCP. The scene fades in on its first rendered
 * frame. Devices that get the fallback get the 2D grid instead (or, under
 * reduced motion, just the static grid that's already there).
 */
export function HeroBackdrop() {
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const tier = useSceneTier((next) => {
    if (next.kind === "fallback") track("hero_scene_fallback", { reason: next.reason });
  });

  if (!tier) return null;

  if (tier.kind === "fallback") {
    return reduceMotion ? null : (
      <HeroGrid className="pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out",
        EDGE_MASK,
        ready ? "opacity-100" : "opacity-0",
      )}
    >
      <HeroScene
        quality={tier.quality}
        onReady={() => {
          setReady(true);
          track("hero_scene_loaded", { tier: tier.quality });
        }}
      />
    </div>
  );
}
