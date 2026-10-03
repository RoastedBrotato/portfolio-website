import { Container } from "@/components/ui/Container";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/Section";

/**
 * The standalone-page header: grid backdrop, the label in the rail, an h1 and
 * an intro. Same shape as the /blog and /reviews headers, so a page built on it
 * lines up with them.
 */
export function PageHeader({
  label,
  title,
  intro,
  aside,
  children,
}: {
  label: string;
  title: string;
  intro: React.ReactNode;
  /** Rendered under the label in the rail. */
  aside?: React.ReactNode;
  /** Rendered under the intro, e.g. the page's CTAs. */
  children?: React.ReactNode;
}) {
  return (
    <header className="border-border-strong relative overflow-hidden border-b-2">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />
      <Container className="relative grid grid-cols-1 gap-8 py-20 sm:py-28 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
        <div className="flex flex-col items-start gap-5">
          <SectionLabel as="p">{label}</SectionLabel>
          {aside}
        </div>

        <div className="min-w-0">
          <RevealText
            as="h1"
            trigger="mount"
            className="font-display text-h1 text-foreground max-w-3xl leading-[1.05] font-bold tracking-tight"
          >
            {title}
          </RevealText>
          <p className="text-foreground-muted mt-6 max-w-xl text-lg leading-relaxed">{intro}</p>
          {children}
        </div>
      </Container>
    </header>
  );
}
