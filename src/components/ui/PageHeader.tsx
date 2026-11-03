import { Container } from "@/components/ui/Container";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/Section";

/**
 * The standalone-page header: the label in the rail, an h1 in the display
 * serif and an intro. Same shape as the /blog and /reviews headers, so a page
 * built on it lines up with them.
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
    <header className="relative border-b">
      <Container className="relative grid grid-cols-1 gap-8 py-16 sm:py-24 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
        <div className="flex flex-col items-start gap-5">
          <SectionLabel as="p">{label}</SectionLabel>
          {aside}
        </div>

        <div className="min-w-0">
          <RevealText
            as="h1"
            trigger="mount"
            className="font-display text-h1 text-foreground max-w-3xl"
          >
            {title}
          </RevealText>
          <p className="text-foreground-muted mt-6 max-w-[52ch] text-lg leading-relaxed">{intro}</p>
          {children}
        </div>
      </Container>
    </header>
  );
}
