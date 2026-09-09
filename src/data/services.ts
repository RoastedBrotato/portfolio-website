import { Service } from "@/types";

/**
 * "What I can build" — the short version, for a founder skimming the page.
 * One line each; the case studies carry the detail.
 */
export const services: Service[] = [
  {
    title: "AI applications",
    description:
      "RAG over your own documents, assistants, transcription and translation — retrieval that actually cites its sources, not a chat widget bolted on.",
  },
  {
    title: "Full-stack products",
    description:
      "SaaS apps, client portals, internal dashboards, MVPs — data model through deployed UI, built so a team can pick it up after me.",
  },
  {
    title: "Backend and integrations",
    description:
      "APIs, auth, database design, and the third-party plumbing that quietly breaks at 2am if nobody thought about it.",
  },
  {
    title: "Business automation",
    description:
      "Replacing the spreadsheet-and-email workflow with something that survives past the one person who understands it.",
  },
];
