import { ProofItem } from "@/types";

/**
 * The proof strip — what the homepage shows in the reviews slot while there are
 * no approved reviews. As soon as one is approved, the section switches to
 * reviews on its own; nothing here needs removing.
 *
 * Only verifiable facts belong here, each with a link to check it.
 */
export const proof: ProofItem[] = [
  {
    stat: "10 active clients",
    detail: "Moementum is live in production, with clients logging training every day.",
    href: "https://moementum.fit",
    linkLabel: "moementum.fit",
  },
  {
    stat: "Open source",
    detail: "KnowledgeOS, a multi-tenant RAG platform — the full codebase is public.",
    href: "https://github.com/RoastedBrotato/AIKnowledgeAssistant",
    linkLabel: "GitHub",
  },
  {
    stat: "TODO — live site",
    detail: "TODO: another live client site, once it's launched and you can link to it.",
    placeholder: true,
  },
];

const includePlaceholders = process.env.NODE_ENV !== "production";

export function getProof(): ProofItem[] {
  return proof.filter((item) => includePlaceholders || !item.placeholder);
}
