"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Funnel depth for the homepage (audit 8.9): reports `scroll_depth` once per
 * page view for each section id as it comes into view, so Plausible shows how
 * far ad traffic actually gets — hero → work → services → proof → contact.
 */
export function ScrollDepth({ sections }: { sections: string[] }) {
  useEffect(() => {
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!entry.isIntersecting || seen.has(id)) continue;
          seen.add(id);
          track("scroll_depth", { section: id });
          observer.unobserve(entry.target);
        }
      },
      // A section counts once a third of the viewport is into it.
      { rootMargin: "0px 0px -33% 0px" },
    );
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return null;
}
