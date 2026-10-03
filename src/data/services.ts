import { Service } from "@/types";

/**
 * "What I can build" — the short version, for a founder skimming the page.
 * One line each; /pricing and the case studies carry the detail. The first
 * three mirror the packages in src/data/pricing.ts.
 */
// DRAFT — edit freely.
export const services: Service[] = [
  {
    title: "Immersive landing pages",
    description:
      "One page, built to launch something — scroll-driven motion and a clear next step, fast on a phone.",
  },
  {
    title: "Brand websites and experiences",
    description:
      "Multi-page sites with a point of view: art direction, page transitions and a CMS your team can actually use.",
  },
  {
    title: "Interactive 3D and product showcases",
    description:
      "Real-time WebGL your customers can turn, configure and explore — budgeted for mid-range phones.",
  },
  {
    title: "Full-stack and AI engineering",
    description:
      "The part underneath: web apps, RAG over your own documents, APIs and automation — see the engineering range above.",
  },
];
