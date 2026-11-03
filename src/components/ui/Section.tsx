import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/**
 * The one label style on the site: small, quiet, uppercase sans. It sits in
 * the rail beside a section (homepage and case study) so the left edge reads
 * as a running index without competing with the heading next to it.
 */
export function SectionLabel({ children, as: Tag = "h2" }: { children: string; as?: "h2" | "p" }) {
  return (
    <Tag className="text-foreground-subtle inline-flex items-center gap-2 text-xs font-medium tracking-[0.1em] uppercase">
      <span aria-hidden className="bg-accent h-1.5 w-1.5 rounded-full" />
      {children}
    </Tag>
  );
}

/** A running number beside a label, for pages that read as one sequence. */
export function SectionIndex({ value }: { value: number }) {
  return (
    <span className="text-foreground-subtle font-mono text-xs tabular-nums">
      {String(value).padStart(2, "0")}
    </span>
  );
}

/** Literal class names, so Tailwind sees them. Steps of the depth range in globals.css. */
const tones = {
  base: "",
  "plane-0": "bg-plane-0",
  "plane-1": "bg-plane-1",
  "plane-2": "bg-plane-2",
  "plane-3": "bg-plane-3",
} as const;

export type SectionTone = keyof typeof tones;

/** For section shells built by hand (full-bleed ones) that still sit on a plane. */
export function toneClass(tone: SectionTone = "base") {
  return tones[tone];
}

/**
 * Page-level section shell: label in the rail, content on the right.
 *
 * Every section on every page uses this grid, so the content column sits on one
 * left edge sitewide — including the closing CTA and the case studies.
 * Rail width and gutter come from --rail / --rail-gap in globals.css.
 *
 * `tone` puts the section on one of the near-black planes. Neighbouring
 * sections should differ by one step, never jump, so the change of pace is
 * felt rather than noticed.
 */
export function Section({
  id,
  label,
  index,
  aside,
  children,
  className,
  labelAs,
  tone = "base",
}: {
  id?: string;
  label: string;
  index?: number;
  /** Optional element rendered under the label in the rail (e.g. a resume link). */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  labelAs?: "h2" | "p";
  tone?: SectionTone;
}) {
  return (
    <section
      id={id}
      className={cn("defer-render scroll-mt-20 border-t py-16 sm:py-24", tones[tone], className)}
    >
      <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
        {/* justify-between splits label and aside on mobile; at lg the rail stacks
            and must reset to the top, or the aside drifts down a tall section. */}
        <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-start lg:justify-start lg:gap-5">
          <div className="flex items-center gap-3">
            {index !== undefined ? <SectionIndex value={index} /> : null}
            <SectionLabel as={labelAs}>{label}</SectionLabel>
          </div>
          {aside}
        </div>
        <div className="min-w-0">{children}</div>
      </Container>
    </section>
  );
}
