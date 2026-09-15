"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

/**
 * The live Lenis instance, or null when smooth scroll is off — which is the
 * case under prefers-reduced-motion, and on the first render before the effect
 * below has run. Anything that needs to hold the page still (a modal, the
 * mobile menu) has to go through this rather than through `overflow: hidden`:
 * Lenis preventDefault()s the wheel and scrolls the window programmatically,
 * and programmatic scrolling is not something `overflow: hidden` blocks.
 */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Inertia smooth-scroll for the whole document. Renders children in a stable
 * provider (no conditional wrapper swap) so toggling prefers-reduced-motion
 * mid-session can't trigger a remount of the app tree — only the Lenis
 * instance itself is created/torn down.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current: Lenis | null = null;
    let observer: ResizeObserver | null = null;

    function setup() {
      if (query.matches) return;
      const instance = new Lenis({ anchors: true, autoRaf: true });
      current = instance;
      setLenis(instance);

      /*
       * Lenis clamps every wheel gesture to a cached scroll limit and refreshes
       * it from its own ResizeObserver on <html>, debounced by 250ms. A page
       * that is still growing when that measurement is taken leaves the limit
       * short, and a short limit is invisible until you hit it: the wheel just
       * stops partway down while the scrollbar and arrow keys — native paths
       * Lenis never intercepts — still reach the bottom.
       *
       * Long articles are where this bites, because their height keeps moving
       * after hydration: web fonts swap in and reflow the prose, lazily loaded
       * images claim their space. So re-measure, undebounced, on the two things
       * that actually signal it. <body> rather than <html> because body is the
       * box that grows; observing it also closes the 250ms window in which
       * Lenis's own observer has fired but not yet re-read the limit.
       */
      observer = new ResizeObserver(() => instance.resize());
      observer.observe(document.body);

      // Can resolve after teardown, so check we're still the live instance.
      document.fonts?.ready
        .then(() => {
          if (current === instance) instance.resize();
        })
        .catch(() => {});
    }

    function teardown() {
      observer?.disconnect();
      observer = null;
      current?.destroy();
      current = null;
      setLenis(null);
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

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
