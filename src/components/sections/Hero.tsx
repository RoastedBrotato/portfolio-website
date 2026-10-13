import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/Section";
import { RevealText, type RevealWord } from "@/components/ui/RevealText";
import { HeroBackdrop } from "@/components/scene/HeroBackdrop";
import { siteConfig } from "@/data/config";

// The thesis (docs/voice.md). The italic red word always carries the second
// beat: the part that has to work.
const headline: RevealWord[] = [
  { text: "Make" },
  { text: "it" },
  { text: "interesting." },
  { text: "Make" },
  { text: "it" },
  { text: "work.", emphasis: true },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />
      <HeroBackdrop />
      {/* Keeps the copy on a dark plane whatever the scene is doing behind it:
          from the bottom on phones, from the left where the text sits on lg. */}
      <div
        aria-hidden
        className="from-background/85 via-background/40 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent lg:bg-gradient-to-r lg:via-background/30"
      />

      {/* Same rail grid as every other section — the hero's rail holds the role
          tag where a section would put its label, so one left edge runs the page. */}
      <Container className="relative grid min-h-[calc(100svh-4rem)] grid-cols-1 content-center sm:min-h-[calc(100svh-5rem)] gap-8 py-20 sm:py-28 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
        <div className="flex flex-col gap-5">
          <div className="fade-up">
            <SectionLabel as="p">{siteConfig.role}</SectionLabel>
          </div>
          {/* The scene is the thesis demonstrated, so it gets a caption. Pointer
              devices only: on a phone the light drifts on its own. */}
          <p
            className="text-foreground-subtle fade-up hidden max-w-[12rem] font-mono text-[11px] leading-relaxed tracking-[0.12em] uppercase lg:block"
            style={{ animationDelay: "0.9s" }}
          >
            The light follows your pointer. The frame rate holds.
          </p>
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

          {/* CSS, not <Reveal>: this paragraph is the LCP element on a phone,
              so it must not wait for hydration to become visible. */}
          <div className="fade-up" style={{ animationDelay: "0.35s" }}>
            {/* One sentence: what it is and who builds it. Availability and
                location live in the footer. */}
            <p className="text-foreground-muted mt-8 max-w-xl text-lg leading-relaxed">
              {siteConfig.tagline}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button href="/work" size="lg">
                See the work
                <ArrowRight size={16} />
              </Button>
              <Button href="/quote" variant="secondary" size="lg">
                Get a quote
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
