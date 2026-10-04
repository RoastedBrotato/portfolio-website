/**
 * Which price list a visitor sees: Pakistan (PKR) or international (USD).
 *
 * Decided in the browser, not on the server, so every page stays statically
 * prerendered. The rule, in order:
 *   1. an explicit choice from the price switch (localStorage), so a traveller
 *      or an expat can always see the other list;
 *   2. otherwise the device's time zone: Asia/Karachi means Pakistan.
 *
 * Time zone rather than IP geolocation on purpose: a VPN, which plenty of
 * people in Pakistan run, doesn't change it, and it needs no server or edge
 * function. It's a display choice only; the fixed price is agreed in the
 * proposal either way.
 *
 * The result is written to <html data-region> before first paint (see
 * REGION_SCRIPT), and CSS shows the matching [data-show] elements.
 */
import type { Region } from "@/data/pricing";

export const REGION_STORAGE_KEY = "pricing-region";
const PAKISTAN_TIME_ZONE = "Asia/Karachi";

/*
 * Runs inline in <head>, synchronously, before the body is painted — so a
 * visitor in Pakistan never sees the dollar prices flash first. Keep it in
 * step with detectRegion() below; they must agree.
 */
export const REGION_SCRIPT = `(function(){try{var r=localStorage.getItem("${REGION_STORAGE_KEY}");if(r!=="pk"&&r!=="intl"){r=Intl.DateTimeFormat().resolvedOptions().timeZone==="${PAKISTAN_TIME_ZONE}"?"pk":"intl"}document.documentElement.setAttribute("data-region",r)}catch(e){}})()`;

/** The same decision as REGION_SCRIPT, for client code. */
export function detectRegion(): Region {
  try {
    const saved = localStorage.getItem(REGION_STORAGE_KEY);
    if (saved === "pk" || saved === "intl") return saved;
  } catch {
    // Storage blocked: fall through to the time zone.
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone === PAKISTAN_TIME_ZONE ? "pk" : "intl";
}

/** The region currently on <html>; "intl" until the script has run. */
export function currentRegion(): Region {
  return document.documentElement.getAttribute("data-region") === "pk" ? "pk" : "intl";
}

/** Switch the visible price list, and remember the choice. */
export function chooseRegion(region: Region) {
  document.documentElement.setAttribute("data-region", region);
  try {
    localStorage.setItem(REGION_STORAGE_KEY, region);
  } catch {
    // Private mode: the switch still works for this page view.
  }
}
