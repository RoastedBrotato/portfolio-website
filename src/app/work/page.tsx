import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { EngineeringRange } from "@/components/sections/EngineeringRange";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { getWork } from "@/data/work";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Selected creative work — immersive landing pages, brand sites and interactive 3D — and the full-stack and AI case studies underneath.",
  path: "/work",
});

/*
 * The destination for "Work" in the nav: the creative pieces first, then the
 * engineering case studies. A type filter belongs here once there are enough
 * pieces of more than one kind to need it.
 */
export default function WorkPage() {
  const work = getWork();

  return (
    <>
      <PageHeader
        label="Work"
        title="Work"
        intro="Creative builds first, and the production engineering behind them — apps, RAG systems and backends shipped end to end."
      />
      {work.length > 0 ? <SelectedWork items={work} id="selected" /> : null}
      <EngineeringRange label="Engineering" tone="plane-1" />
      <ContactCTA />
    </>
  );
}
