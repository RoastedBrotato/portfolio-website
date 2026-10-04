/**
 * Everything on /services, plus the option lists the quote form is built from.
 * Edit here; nothing else on the site hard-codes a price, a package name or a
 * budget band.
 *
 * Prices are regional: visitors in Pakistan see PKR, everyone else USD (how
 * the region is decided: src/lib/region.ts). International projects carry
 * transfer and platform fees, currency conversion and calls across time
 * zones, so their prices are set to cover that.
 *
 * Anything left as TODO_PRICE renders as the literal "TODO_PRICE" in
 * `next dev` (so it's impossible to miss) and as "Quote on request" in a build
 * (so it can never ship). Replace it with a whole number in that region's
 * currency.
 *
 * Lines marked DRAFT are starting points written for you to correct.
 */

export const TODO_PRICE = "TODO_PRICE";

export type Region = "pk" | "intl";

/** How each region's prices are written. */
export const regions: Record<Region, { label: string; currency: string; locale: string }> = {
  pk: { label: "Pakistan", currency: "PKR", locale: "en-PK" },
  intl: { label: "International", currency: "USD", locale: "en-US" },
};

/** International first: it's what renders without JavaScript. */
export const regionList: Region[] = ["intl", "pk"];

/** A whole number per region, in that region's currency, or TODO_PRICE. */
export type RegionalPrice = Record<Region, number | typeof TODO_PRICE>;

export type PackageId = "immersive-landing" | "brand-experience" | "interactive-3d";

export interface Package {
  id: PackageId;
  name: string;
  /** One line: what the client walks away with. */
  outcome: string;
  includes: string[];
  timeline: string;
  startingFrom: RegionalPrice;
  /** Gets the accent treatment. At most one. */
  highlighted?: boolean;
}

export const packages: Package[] = [
  {
    id: "immersive-landing",
    name: "Immersive Landing Page",
    // DRAFT
    outcome: "One page that makes people stop scrolling — built to launch a product, offer or campaign.",
    // DRAFT
    includes: [
      "Concept, art direction and copy structure",
      "One long-form page with scroll-driven motion",
      "Responsive build, tuned for mobile and in-app browsers",
      "Analytics and a lead or waitlist form wired in",
      "One round of revisions per milestone",
    ],
    timeline: "2–3 weeks", // DRAFT
    startingFrom: { pk: 150_000, intl: 2_500 }, // DRAFT — market rate, Oct 2026
  },
  {
    id: "brand-experience",
    name: "Brand Website / Experience",
    // DRAFT
    outcome: "A multi-page site with a point of view, that your team can update without me.",
    // DRAFT
    includes: [
      "Discovery, sitemap and art direction",
      "Up to 6 custom-designed pages",
      "Page transitions and interaction design",
      "CMS for the content your team edits",
      "SEO, analytics and performance pass",
      "Handover walkthrough and docs",
    ],
    timeline: "4–6 weeks", // DRAFT
    startingFrom: { pk: 400_000, intl: 6_000 }, // DRAFT — market rate, Oct 2026
    highlighted: true,
  },
  {
    id: "interactive-3d",
    name: "Interactive 3D / Product Showcase",
    // DRAFT
    outcome: "Your product in real-time 3D — explorable, configurable and fast on a phone.",
    // DRAFT
    includes: [
      "3D scene built from your models or CAD (or modelled from reference)",
      "Real-time WebGL with interaction and camera choreography",
      "Optional configurator: colours, materials, variants",
      "Mobile performance budget and fallbacks",
      "Embeddable in an existing site or standalone",
    ],
    timeline: "4–8 weeks", // DRAFT
    startingFrom: { pk: 550_000, intl: 8_000 }, // DRAFT — market rate, Oct 2026
  },
];

/** The fourth card. No price by design — it's the "doesn't fit a box" path. */
export const customQuote = {
  id: "custom" as const,
  name: "Custom quote",
  // DRAFT
  outcome:
    "Something that doesn't fit a package — a web app, an AI feature, an installation, or a mix.",
  // DRAFT
  includes: [
    "Scoped after a discovery call",
    "Fixed price per milestone, agreed up front",
    "Full-stack and AI work included in the range",
  ],
};

/** "Something else" is the catch-all at the bottom of the quote form's select. */
export const projectTypes = [
  ...packages.map((pkg) => ({ value: pkg.id, label: pkg.name })),
  { value: customQuote.id, label: "Custom project" },
  { value: "other", label: "Something else" },
] as const;

export type ProjectType = (typeof projectTypes)[number]["value"];

// DRAFT — each region's bands should bracket that region's real prices once
// they're in. The labels carry the currency because they're also what the
// lead notification and the inbox show. `value` is what's stored with the
// lead: the international values predate regional pricing, so they stay as
// they are and older leads still label correctly.
const unsure = { value: "unsure", label: "Not sure yet" } as const;

export const budgetRangesByRegion = {
  intl: [
    { value: "under-2k", label: "Under USD 2,000" },
    { value: "2k-5k", label: "USD 2,000 – 5,000" },
    { value: "5k-10k", label: "USD 5,000 – 10,000" },
    { value: "10k-plus", label: "USD 10,000+" },
    unsure,
  ],
  pk: [
    { value: "pk-under-150k", label: "Under PKR 150,000" },
    { value: "pk-150k-400k", label: "PKR 150,000 – 400,000" },
    { value: "pk-400k-1m", label: "PKR 400,000 – 1,000,000" },
    { value: "pk-1m-plus", label: "PKR 1,000,000+" },
    unsure,
  ],
} as const satisfies Record<Region, readonly { value: string; label: string }[]>;

/** Every band from both regions — what the server validates and labels against. */
export const budgetRanges = [
  ...budgetRangesByRegion.intl,
  ...budgetRangesByRegion.pk.filter((range) => range.value !== "unsure"),
];

export const timelines = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-month", label: "Within a month" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "flexible", label: "Flexible" },
] as const;

export const referralSources = [
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "search", label: "Google / search" },
  { value: "referral", label: "Someone referred me" },
  { value: "other", label: "Somewhere else" },
] as const;

/** "How a project works" on /services. */
export const processSteps = [
  {
    title: "Discovery call",
    // DRAFT
    description:
      "30 minutes on what you're launching, who it's for and what success looks like. No prep needed.",
  },
  {
    title: "Concept and scope",
    // DRAFT
    description:
      "A short written proposal: the idea, references, what's in and out, milestones and a fixed price.",
  },
  {
    title: "Build in milestones",
    // DRAFT
    description:
      "Work ships to a private preview link as it's built. You review each milestone before the next starts.",
  },
  {
    title: "Launch and handover",
    // DRAFT
    description:
      "I deploy, check it on real devices, and hand over the code, accounts and a walkthrough. Two weeks of fixes included.",
  },
];

// DRAFT — every answer here is a placeholder for your actual policy.
export const faqs = [
  {
    question: "What does “starting from” include?",
    answer:
      "Everything listed on the card. The final price depends on scope — more pages, a 3D model to build from scratch, or a CMS — and is fixed in the proposal before any work starts.",
  },
  {
    question: "How do payments work?",
    answer:
      "A deposit to book the slot, then the balance split across milestones. Every amount is in the proposal up front.",
  },
  {
    question: "Do you work with clients outside Pakistan?",
    answer:
      "Yes — most projects are remote, priced in USD. Calls are scheduled around your timezone.",
  },
  {
    question: "Why are prices different in Pakistan?",
    answer:
      "Projects outside Pakistan carry costs local ones don't: international transfer and payment-platform fees, currency conversion, and calls across time zones. International prices are set to cover those, so the work itself costs the same. The price list follows where you are; the switch on this page shows the other one.",
  },
  {
    question: "Will it be fast on mobile?",
    answer:
      "That's part of the build, not an extra. Motion and 3D are budgeted for mid-range phones and in-app browsers, with lighter fallbacks where a device can't keep up.",
  },
  {
    question: "Who owns the code?",
    answer: "You do, once the final invoice is paid — repository, hosting and all.",
  },
];

/**
 * A price for display, in the given region's currency. `null` means "don't
 * show a number" — the caller renders "Quote on request" instead.
 */
export function formatPrice(price: number | typeof TODO_PRICE, region: Region): string | null {
  if (price === TODO_PRICE) {
    return process.env.NODE_ENV === "production" ? null : TODO_PRICE;
  }
  const { currency, locale } = regions[region];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
