import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/Section";
import { RevealText, type RevealWord } from "@/components/ui/RevealText";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/data/config";

const headline: RevealWord[] = [
  { text: "I" },
  { text: "build" },
  { text: "software" },
  { text: "people" },
  { text: "open", emphasis: true },
  { text: "every" },
  { text: "day." },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />

      {/* Same rail grid as every other section — the hero's rail holds the role
          tag where a section would put its label, so one left edge runs the page. */}
      <Container className="relative grid min-h-[70svh] grid-cols-1 content-center gap-8 py-20 sm:py-28 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
        <div>
          <Reveal>
            <SectionLabel as="p">{siteConfig.role}</SectionLabel>
          </Reveal>
        </div>

        <div className="min-w-0">
          <RevealText
            as="h1"
            trigger="mount"
            delay={0.2}
            className="font-display text-h1 text-foreground max-w-3xl leading-[1.05] font-bold tracking-tight"
          >
            {headline}
          </RevealText>

          <Reveal delay={0.15}>
            <p className="text-foreground-muted mt-8 max-w-xl text-lg leading-relaxed">
              I take client projects from the first discovery call to production. Right now that
              means a coaching platform running with 10 active clients, and a RAG assistant that
              answers from a company&apos;s own documents.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button href="/#work" size="lg">
                See the work
                <ArrowRight size={16} />
              </Button>
              <Button href="/#contact" variant="secondary" size="lg">
                Get in touch
              </Button>
            </div>

            {/* items-start keeps the marker on the first line when the label wraps. */}
            <p className="text-foreground-subtle mt-12 flex items-start gap-2.5 font-mono text-xs leading-relaxed tracking-[0.15em] uppercase">
              <span className="bg-accent mt-[0.4em] h-2 w-2 shrink-0" />
              <span>
                {siteConfig.availability} · {siteConfig.location}
              </span>
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
