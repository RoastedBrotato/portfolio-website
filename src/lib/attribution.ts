import type { Attribution } from "@/types";

/*
 * Lead attribution, captured on arrival and read back by the quote form.
 *
 * Two stores, because the two cases want different lifetimes:
 *
 *   - A visit carrying utm_* tags (a link-in-bio, a post, an ad) is the signal
 *     worth keeping. It goes to localStorage for 30 days, so someone who taps
 *     through from Instagram today and comes back by typing the URL on Friday
 *     is still credited to Instagram. A later tagged visit replaces it.
 *   - An untagged visit only records where this session started, in
 *     sessionStorage, and never overwrites a tagged record.
 *
 * Every storage access is wrapped: in-app browsers and private windows can
 * throw on access, and a lost attribution must never cost a lead.
 */

const TAGGED_KEY = "attribution";
const SESSION_KEY = "attribution:session";
const TAGGED_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type Stored = Attribution & { at: number };
type Which = "localStorage" | "sessionStorage";

// The store is resolved inside the try: in some in-app browsers merely reading
// `window.localStorage` throws, before getItem is ever reached.
function read(which: Which, key: string): Stored | null {
  try {
    const raw = window[which].getItem(key);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function write(which: Which, key: string, value: Stored): void {
  try {
    window[which].setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked — nothing to do.
  }
}

/** Call once per page load. Cheap and idempotent. */
export function captureAttribution(): void {
  const params = new URLSearchParams(window.location.search);
  const landing = {
    landingPage: window.location.pathname + window.location.search,
    referrer: document.referrer || undefined,
    at: Date.now(),
  };

  const utmSource = params.get("utm_source") ?? undefined;
  const utmMedium = params.get("utm_medium") ?? undefined;
  const utmCampaign = params.get("utm_campaign") ?? undefined;

  if (utmSource || utmMedium || utmCampaign) {
    write("localStorage", TAGGED_KEY, { ...landing, utmSource, utmMedium, utmCampaign });
    return;
  }

  // First page of this session only; client-side navigations don't count as landings.
  if (!read("sessionStorage", SESSION_KEY)) write("sessionStorage", SESSION_KEY, landing);
}

/** The best attribution available: a live tagged visit, else this session's landing. */
export function readAttribution(): Attribution {
  const tagged = read("localStorage", TAGGED_KEY);
  if (tagged && Date.now() - tagged.at < TAGGED_TTL_MS) return tagged;
  return read("sessionStorage", SESSION_KEY) ?? {};
}
