"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/**
 * One delegated click listener for every `data-track` link on the site, so
 * server-rendered links (the footer, a pricing card) are tracked without each
 * becoming a client component. Capture phase, so it still sees the click when
 * a handler further down stops propagation.
 */
export function AnalyticsListener() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const el = target?.closest<HTMLElement>("[data-track]");
      if (!el) return;

      track(el.dataset.track as AnalyticsEvent, {
        label: el.dataset.trackLabel,
        path: window.location.pathname,
      });
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
