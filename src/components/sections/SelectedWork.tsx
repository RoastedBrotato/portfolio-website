import { Container } from "@/components/ui/Container";
import { SectionIndex, SectionLabel } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LeadWorkCard, WorkCard } from "@/components/work/WorkCard";
import type { WorkItem } from "@/types";
import { cn } from "@/lib/utils";

/**
 * The creative pieces — Immersive weight. The lead entry runs full-bleed, edge
 * to edge with no rail; the rest sit in a two-up grid underneath.
 */
export function SelectedWork({
  items,
  index,
  id = "work",
  className,
}: {
  items: WorkItem[];
  index?: number;
  id?: string;
  className?: string;
}) {
  const [lead, ...rest] = items;
  if (!lead) return null;

  return (
    <section
      id={id}
      className={cn("border-border-strong defer-render scroll-mt-20 border-t-2 pt-20 pb-20 sm:pt-28 sm:pb-28", className)}
    >
      <Container className="mb-10 flex items-center gap-3 sm:mb-14">
        {index !== undefined ? <SectionIndex value={index} /> : null}
        <SectionLabel>Selected work</SectionLabel>
      </Container>

      <Reveal>
        <LeadWorkCard item={lead} />
      </Reveal>

      {rest.length > 0 ? (
        <Container className="mt-20 grid grid-cols-1 gap-x-8 gap-y-16 sm:mt-28 sm:grid-cols-2">
          {rest.map((item, i) => (
            <Reveal key={item.slug} delay={Math.min((i % 2) * 0.08, 0.16)}>
              <WorkCard item={item} />
            </Reveal>
          ))}
        </Container>
      ) : null}
    </section>
  );
}
