import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="about" className="scroll-mt-20 border-t border-border py-28 sm:py-40">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <SectionHeading eyebrow="About" title="How I ended up here" />
        <Reveal
          delay={0.1}
          className="flex flex-col gap-6 text-base leading-relaxed text-foreground-muted sm:text-lg"
        >
          <p>
            I started as a backend engineer. A few years in, I got pulled into a project that
            needed real ML models, not just APIs, and that was the turn. When the current wave of
            AI models started landing, I went all in — Claude, OpenAI, Kimi, self-hosted Ollama,
            building RAG systems from scratch. What kept me hooked wasn&apos;t the hype, it was
            how fast you could go from idea to a working MVP.
          </p>
          <p>
            I don&apos;t like building on WordPress or templates — they cap what you can actually
            do, and I&apos;d rather ship something custom that&apos;s optimized around the real
            problem instead of around a theme. Framer is the one exception that&apos;s changed my
            mind; it made me pay a lot more attention to what these tools can actually do.
          </p>
          <p>
            I ran my own company in Qatar before moving to Pakistan for better access to the kind
            of startup teams I wanted to learn from. At this point I&apos;m only taking on roles
            and projects with people who care about the work — good engineering, a real
            environment, some creative energy. I&apos;ve already done the bad-management thing.
          </p>
          <p className="text-sm text-foreground-subtle">
            Outside of work: anime, metal, the gym, and as much hiking and trekking as I can get
            away with — there&apos;s a decent chance I&apos;m somewhere in the mountains while
            you&apos;re reading this.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
