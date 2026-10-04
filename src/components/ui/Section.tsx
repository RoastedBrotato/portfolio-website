import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/**
 * The one label style on the site: a solid red block. Used in every section rail
 * (homepage and case study) so the left edge reads as a single running index.
 */
export function SectionLabel({ children, as: Tag = "h2" }: { children: string; as?: "h2" | "p" }) {
  return (
    <Tag className="bg-accent text-accent-foreground inline-block px-2.5 py-1 font-mono text-xs leading-[1.5] font-bold tracking-[0.16em] uppercase">
      {children}
    </Tag>
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
 * Page-level section shell — the "Editorial" weight: label in the rail,
 * content on the right, entrance reveals only.
 *
 * Every section on every page uses this grid, so the content column sits on one
 * left edge sitewide — including the hero, the closing CTA and the case studies.
 * Rail width and gutter come from --rail / --rail-gap in globals.css.
 *
 * `tone` puts the section on one of the near-black planes. Neighbouring
 * sections should differ by one step, never jump, so the change of pace is
 * felt rather than noticed. `index` prints a running section number beside the
 * label ("01"), for pages that read as one sequence.
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
      className={cn(
        "border-border-strong defer-render scroll-mt-20 border-t-2 py-20 sm:py-28",
        tones[tone],
        className,
      )}
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

/** The mono "01" that runs down the rail beside each label. */
export function SectionIndex({ value }: { value: number }) {
  return (
    <span aria-hidden className="text-foreground-muted font-mono text-xs font-bold tracking-[0.16em]">
      {String(value).padStart(2, "0")}
    </span>
  );
}
