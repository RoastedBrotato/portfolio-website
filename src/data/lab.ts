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
    slug: "experiment-01",
    title: "TODO — Experiment 01",
    date: "2026-10-01",
    note: "TODO: what you tried, with what tool, and what came of it.",
    tags: ["TODO"],
    placeholder: true,
  },
  {
    slug: "experiment-02",
    title: "TODO — Experiment 02",
    date: "2026-09-20",
    note: "TODO: what you tried, with what tool, and what came of it.",
    tags: ["TODO"],
    placeholder: true,
  },
];

const includePlaceholders = process.env.NODE_ENV !== "production";

/** Newest first; placeholders in dev only. */
export function getLabEntries(): LabEntry[] {
  return lab
    .filter((entry) => includePlaceholders || !entry.placeholder)
    .sort((a, b) => b.date.localeCompare(a.date));
}
