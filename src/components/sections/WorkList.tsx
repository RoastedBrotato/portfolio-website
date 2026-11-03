import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { HoverList, type ListItem } from "@/components/work/HoverList";
import type { WorkItem } from "@/types";
import { cn } from "@/lib/utils";

/** Strip the case-study prose before it reaches the client. */
function toListItem(item: WorkItem): ListItem {
  const { slug, title, kind, location, href, caseStudy, media, shots } = item;
  return { slug, title, kind, location, href, caseStudy, media, shots };
}

/**
 * The featured work as names. The names are the section; the sites show up
 * under the pointer, so the list stays one screen tall.
 */
export function WorkList({ items, id = "work", className }: { items: WorkItem[]; id?: string; className?: string }) {
  if (items.length === 0) return null;

  return (
    <section id={id} className={cn("scroll-mt-20 py-16 sm:py-24", className)}>
      <Container>
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-foreground text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.85]">work</h2>
            <div className="flex flex-col items-start gap-3 sm:items-end sm:pb-2">
              <p className="text-foreground-muted max-w-[34ch] text-base sm:text-right">
                Five sites live for clients in Qatar and Pakistan. Move over a name to see it.
              </p>
              <Link
                href="/work"
                className="text-foreground hover:text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                All work, including the engineering
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="mt-10 sm:mt-12">
          <HoverList items={items.map(toListItem)} />
        </Reveal>
      </Container>
    </section>
  );
}
