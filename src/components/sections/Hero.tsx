import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/Section";
import { RevealText, type RevealWord } from "@/components/ui/RevealText";
import { Reveal } from "@/components/ui/Reveal";
import { HeroSpotlight } from "@/components/HeroSpotlight";
import { siteConfig } from "@/data/config";

// DRAFT — the headline and the paragraph below are yours to rewrite. The audit's
// alternatives: "Websites that move. Engineering that holds." / "Immersive sites, built like software."
const headline: RevealWord[] = [
  { text: "Websites" },
  { text: "people" },
  { text: "remember,", emphasis: true },
  { text: "engineered" },
  { text: "to" },
  { text: "last." },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />
      <HeroSpotlight />

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
            {/* One sentence, under 20 words: the hero's job is the claim and the
                two ways forward. Availability and location live in the footer. */}
            <p className="text-foreground-muted mt-8 max-w-xl text-lg leading-relaxed">
              Immersive landing pages, brand sites and interactive 3D, built on years of shipping
              full-stack and AI systems.
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
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
