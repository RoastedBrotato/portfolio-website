"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertia smooth-scroll for the whole document. Renders children in a stable
 * fragment (no conditional wrapper swap) so toggling prefers-reduced-motion
 * mid-session can't trigger a remount of the app tree — only the Lenis
 * instance itself is created/torn down.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    function setup() {
      if (query.matches) return;
      lenis = new Lenis({ anchors: true, autoRaf: true });
    }

    function teardown() {
      lenis?.destroy();
      lenis = null;
    }

    setup();
    const onChange = () => {
      teardown();
      setup();
    };
    query.addEventListener("change", onChange);

    return () => {
      query.removeEventListener("change", onChange);
      teardown();
    };
  }, []);

  return <>{children}</>;
}
