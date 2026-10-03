import { WorkItem } from "@/types";

/**
 * "Selected work" — the creative pieces, shown first on the homepage.
 *
 * To add a piece:
 * 1. Drop the media under /public/work/<slug>/ — a short clip (preview.mp4,
 *    ~5–10s, muted, H.264, ≤1.5MB, 1280px wide is plenty) and a poster frame
 *    (poster.jpg, same aspect, 16:10 crops best).
 * 2. Add an entry below. Order here is order on the page; the first entry gets
 *    the wide slot.
 * 3. For a full write-up, add a project to src/data/projects.ts and point
 *    `caseStudy` at "/work/<slug>".
 *
 * Entries with `placeholder: true` show up in `next dev` so you can see the
 * layout filled, and are dropped from every build — nothing invented ships.
 */
export const work: WorkItem[] = [
  {
    slug: "piece-01",
    title: "TODO — Piece 01",
    description: "TODO: one line on what it is and what makes it interesting.",
    tags: ["TODO"],
    placeholder: true,
  },
  {
    slug: "piece-02",
    title: "TODO — Piece 02",
    description: "TODO: one line on what it is and what makes it interesting.",
    tags: ["TODO"],
    placeholder: true,
  },
  {
    slug: "piece-03",
    title: "TODO — Piece 03",
    description: "TODO: one line on what it is and what makes it interesting.",
    tags: ["TODO"],
    placeholder: true,
  },
];

const includePlaceholders = process.env.NODE_ENV !== "production";

/** What actually renders: placeholders in dev, real entries only in a build. */
export function getWork(): WorkItem[] {
  return work.filter((item) => includePlaceholders || !item.placeholder);
}
