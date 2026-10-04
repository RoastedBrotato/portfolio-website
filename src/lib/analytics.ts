/*
 * Custom analytics events. Provider-agnostic on purpose: everything on the site
 * goes through `track()`, and only this file knows the provider is Plausible.
 *
 * Links don't need a client component to be tracked — give them
 * `data-track="<event>"` (and optionally `data-track-label`) and the delegated
 * listener in AnalyticsListener.tsx reports the click.
 */

export type AnalyticsEvent =
  | "pricing_view"
  | "quote_start"
  | "quote_submit"
  | "booking_click"
  | "social_click"
  /** The hero's 3D scene rendered its first frame; `tier` is full / lite / still. */
  | "hero_scene_loaded"
  /** The device got the 2D hero instead; `reason` says why. */
  | "hero_scene_fallback"
  /** A homepage section scrolled into view, once per visit; `section` names it. */
  | "scroll_depth"
  /** Step one of the quote form completed — intent recorded even if they bounce. */
  | "quote_step"
  /** The visitor switched price lists; `region` is the one they chose. */
  | "pricing_region";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

/** Fire-and-forget. A no-op when the script isn't loaded (dev, adblockers). */
export function track(event: AnalyticsEvent, props?: Props): void {
  if (typeof window === "undefined" || !window.plausible) return;

  const clean = props
    ? Object.fromEntries(
        Object.entries(props).filter((entry): entry is [string, string | number | boolean] =>
          entry[1] !== undefined && entry[1] !== "",
        ),
      )
    : undefined;

  window.plausible(event, clean ? { props: clean } : undefined);
}

/** Spread onto any link: `<a {...trackAttrs("booking_click", "hero")}>`. */
export function trackAttrs(event: AnalyticsEvent, label?: string) {
  return { "data-track": event, ...(label ? { "data-track-label": label } : {}) };
}
