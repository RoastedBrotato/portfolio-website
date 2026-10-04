"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import type { Region } from "@/data/pricing";
import { chooseRegion, currentRegion, detectRegion } from "@/lib/region";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-region"] });
  return () => observer.disconnect();
}

/**
 * The visitor's price region, for client code that can't just lean on the
 * [data-show] CSS (the quote form's budget options, for one). "intl" during
 * the server render, then whatever the inline script decided.
 */
export function useRegion(): Region {
  return useSyncExternalStore(subscribe, currentRegion, () => "intl");
}

/**
 * Mounted once in the root layout. In production the inline script has
 * already set <html data-region> and this does nothing visible. In
 * development, Strict Mode's remount resets <html> to the attributes React
 * owns, dropping data-region; this puts it back before paint.
 */
export function RegionSync() {
  useLayoutEffect(() => {
    if (!document.documentElement.hasAttribute("data-region")) {
      document.documentElement.setAttribute("data-region", detectRegion());
    }
  });
  return null;
}

/**
 * Says which price list is showing and offers the other. Both versions of
 * every label are in the HTML and CSS picks one, so there's nothing to swap
 * after hydration.
 */
export function RegionSwitch({ className }: { className?: string }) {
  return (
    <p className={cn("text-foreground-subtle flex flex-wrap items-center gap-x-3 gap-y-1 text-sm", className)}>
      <span data-show="pk">Prices in PKR, for clients in Pakistan.</span>
      <span data-show="intl">Prices in USD, for clients outside Pakistan.</span>
      <button
        type="button"
        onClick={() => {
          const next = currentRegion() === "pk" ? "intl" : "pk";
          chooseRegion(next);
          track("pricing_region", { region: next });
        }}
        className="text-foreground decoration-accent hover:text-accent underline decoration-2 underline-offset-4 transition-colors"
      >
        <span data-show="pk">Show international prices</span>
        <span data-show="intl">In Pakistan? Show PKR prices</span>
      </button>
    </p>
  );
}
