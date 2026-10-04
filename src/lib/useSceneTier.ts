"use client";

import { useEffect, useState } from "react";
import { detectSceneTier, type SceneTier } from "@/lib/sceneTier";

/**
 * The device's scene tier, decided once the main thread is idle after
 * hydration so a scene never competes with first paint. `null` until then.
 */
export function useSceneTier(onDecide?: (tier: SceneTier) => void): SceneTier | null {
  const [tier, setTier] = useState<SceneTier | null>(null);

  useEffect(() => {
    const decide = () => {
      const next = detectSceneTier();
      setTier(next);
      onDecide?.(next);
    };

    // Safari has no requestIdleCallback; a short delay after hydration stands in.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(decide, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(decide, 300);
    return () => window.clearTimeout(id);
    // Decided once per mount; a new callback identity shouldn't re-run it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return tier;
}
