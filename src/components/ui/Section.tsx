import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/**
 * The one label style on the site: a solid red block. Used in every section rail
 * (homepage and case study) so the left edge reads as a single running index.
 */
export function SectionLabel({ children, as: Tag = "h2" }: { children: string; as?: "h2" | "p" }) {
  return (
    <Tag className="bg-accent text-accent-foreground inline-block px-2.5 py-1 font-mono text-xs font-bold tracking-[0.16em] uppercase">
      {children}
    </Tag>
  );
}

/**
 * Page-level section shell.
 *
 * Every section on every page uses this grid, so the content column sits on one
 * left edge sitewide — including the hero, the closing CTA and the case studies.
 * Rail width and gutter come from --rail / --rail-gap in globals.css.
 */
export function Section({
  id,
  label,
  aside,
  children,
  className,
  labelAs,
}: {
  id?: string;
  label: string;
  /** Optional element rendered under the label in the rail (e.g. a resume link). */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  labelAs?: "h2" | "p";
}) {
  return (
    <section
      id={id}
      className={cn("border-border-strong scroll-mt-20 border-t-2 py-20 sm:py-28", className)}
    >
      <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
        {/* justify-between splits label and aside on mobile; at lg the rail stacks
            and must reset to the top, or the aside drifts down a tall section. */}
        <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-start lg:justify-start lg:gap-5">
          <SectionLabel as={labelAs}>{label}</SectionLabel>
          {aside}
        </div>
        <div className="min-w-0">{children}</div>
      </Container>
    </section>
  );
}
