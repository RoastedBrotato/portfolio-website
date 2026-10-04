import { LabEntry } from "@/types";

/**
 * /lab — experiments, creative challenges and AI-tool tests. Smaller and
 * rougher than Selected work on purpose: a sketch from an evening counts.
 *
 * To add an entry: put media under /public/lab/<slug>/ (same clip + poster
 * convention as src/data/work.ts — a still image works too), then add an object
 * below. Order doesn't matter; the page sorts by date, newest first.
 *
 * `placeholder: true` entries show in `next dev` only and never ship.
 */
export const lab: LabEntry[] = [
  {
    slug: "quarr-launch",
    title: "Quarr One launch page",
    date: "2026-10-04",
    note: "A launch page for a speaker that doesn't exist: four screens of pinned scroll turn the product, open it up and recolour it, then a waitlist that sends nothing.",
    tags: ["Scroll-driven", "R3F"],
    media: {
      type: "video",
      src: "/work/quarr-launch/preview.mp4",
      poster: "/work/quarr-launch/poster.jpg",
      alt: "Scrolling the launch page as the speaker turns and comes apart",
    },
    href: "/lab/launch",
  },
  {
    slug: "quarr-configurator",
    title: "Product configurator",
    date: "2026-10-03",
    note: "The same fictional speaker as a configurator: three colourways, an exploded view and a scripted camera move. Modelled from primitives and lit with Lightformers, so the only download is code.",
    tags: ["Interactive 3D", "R3F"],
    media: {
      type: "video",
      src: "/work/quarr-configurator/preview.mp4",
      poster: "/work/quarr-configurator/poster.jpg",
      alt: "A speaker turning in the configurator as its colourway changes",
    },
    href: "/lab/configurator",
  },
];

const includePlaceholders = process.env.NODE_ENV !== "production";

/** Newest first; placeholders in dev only. */
export function getLabEntries(): LabEntry[] {
  return lab
    .filter((entry) => includePlaceholders || !entry.placeholder)
    .sort((a, b) => b.date.localeCompare(a.date));
}
