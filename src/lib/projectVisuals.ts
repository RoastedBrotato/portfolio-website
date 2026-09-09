type Variant = "ai" | "realtime" | "business";

/** Fallback abstract visual used when a project has no cover image yet. */
const bySlug: Record<string, Variant> = {
  "moementum-fit": "business",
  "ai-knowledge-assistant": "ai",
  "ai-meeting-intelligence": "ai",
};

export function visualVariantFor(slug: string): Variant {
  return bySlug[slug] ?? "ai";
}
