/**
 * Engineering work that has no case study (yet): the rows under the
 * "The part that has to work" strip. Each is a live thing someone can check,
 * with one line on what it is and one on my part in it. `mine` marks a
 * company of my own, so it is never mistaken for a client.
 *
 * Moementum isn't here because it has a full case study in projects.ts.
 */
export interface ShippedItem {
  title: string;
  /** What it is, for someone who has never heard of it. */
  what: string;
  /** My part, specifically. */
  part: string;
  href: string;
  linkLabel: string;
  /** My own company, not a client. Rendered as a tag. */
  mine?: boolean;
}

export const shipped: ShippedItem[] = [
  {
    title: "Al Sufun",
    what: "My studio: websites and automation for businesses in Qatar and Pakistan.",
    part: "I built the site, and prototyped the AI-assisted features behind the services it offers.",
    href: "https://www.alsufun.com/",
    linkLabel: "alsufun.com",
    mine: true,
  },
  {
    title: "Qatar Charity",
    what: "The web and mobile donation flows of one of the region's largest charities.",
    part: "Five years on the team: new features, performance work, integrations, and the bug fixes that keep donations going through.",
    href: "https://qcharity.org/",
    linkLabel: "qcharity.org",
  },
  {
    title: "Al Mahhar Holding",
    what: "A corporate site whose investor pages have to be current and up.",
    part: "Built the site and put a headless CMS behind the investor pages, so the team publishes updates without a developer and nothing goes down to do it.",
    href: "https://www.almahharholding.com/en",
    linkLabel: "almahharholding.com",
  },
];
