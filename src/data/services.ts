import { Service } from "@/types";

/**
 * "What I Build" — targeted at freelance/contract clients.
 * Keep descriptions understandable to a non-technical founder.
 */
export const services: Service[] = [
  {
    icon: "sparkles",
    title: "AI Applications",
    description:
      "AI-powered features and products built on real retrieval and reasoning, not just a chat widget bolted on top.",
    capabilities: [
      "RAG systems & document intelligence",
      "Conversational AI & assistants",
      "Speech transcription & translation",
      "LLM integrations into existing products",
    ],
  },
  {
    icon: "layers",
    title: "Full-Stack Products",
    description:
      "End-to-end web applications, from data model to deployed UI, built to be maintained by a real team.",
    capabilities: [
      "SaaS applications & customer portals",
      "Admin dashboards & internal platforms",
      "MVP development for new products",
      "Design-system-driven front ends",
    ],
  },
  {
    icon: "plug",
    title: "Backend & Integrations",
    description:
      "The systems that keep the product running: reliable APIs, sane data models, and integrations that don't break.",
    capabilities: [
      "REST APIs & service architecture",
      "Authentication & authorization",
      "Database design (SQL & vector)",
      "Third-party & asynchronous integrations",
    ],
  },
  {
    icon: "workflow",
    title: "Business Automation",
    description:
      "Software that replaces the spreadsheet-and-email workflow with something that scales past one person.",
    capabilities: [
      "Workflow & approval automation",
      "Replacing manual, repetitive processes",
      "Connecting disconnected internal tools",
      "Reporting & operational dashboards",
    ],
  },
];
