import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/work/WorkCard";
import type { WorkItem } from "@/types";

/** The creative pieces, first thing after the hero. The lead entry runs full width. */
export function SelectedWork({ items }: { items: WorkItem[] }) {
  return (
    <Section id="work" label="Selected work">
      <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
        {items.map((item, i) => (
          <Reveal
            key={item.slug}
            delay={i === 0 ? 0 : Math.min((i % 2) * 0.08, 0.16)}
            className={i === 0 ? "sm:col-span-2" : undefined}
          >
            <WorkCard item={item} wide={i === 0} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
