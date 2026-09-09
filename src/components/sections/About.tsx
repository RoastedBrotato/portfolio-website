import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { techStack } from "@/data/techStack";

export function About() {
  return (
    <Section id="about" label="About">
      <Reveal className="max-w-2xl">
        <div className="flex flex-col gap-5 text-base leading-relaxed text-foreground-muted">
          <p>
            I started as a backend engineer. A few years in, I got pulled into a project that needed
            real ML models, not just APIs, and that was the turn. When the current wave of AI models
            started landing, I went all in — Claude, OpenAI, Kimi, self-hosted Ollama, building RAG
            systems from scratch. What kept me hooked wasn&apos;t the hype, it was how fast you
            could go from idea to a working MVP.
          </p>
          <p>
            I don&apos;t like building on WordPress or templates — they cap what you can actually
            do, and I&apos;d rather ship something custom that&apos;s optimized around the real
            problem instead of around a theme. Framer is the one exception that&apos;s changed my
            mind; it made me pay a lot more attention to what these tools can actually do.
          </p>
          <p>
            I ran my own company in Qatar before moving to Pakistan for better access to the kind of
            startup teams I wanted to learn from. At this point I&apos;m only taking on roles and
            projects with people who care about the work — good engineering, a real environment,
            some creative energy. I&apos;ve already done the bad-management thing.
          </p>
          <p className="text-foreground-subtle">
            Outside of work: anime, metal, the gym, and as much hiking and trekking as I can get
            away with — there&apos;s a decent chance I&apos;m somewhere in the mountains while
            you&apos;re reading this.
          </p>
        </div>

        {/* Nested label column: 8rem is the site's inner-rail width (see README). */}
        <dl className="mt-12 grid grid-cols-1 gap-x-8 gap-y-5 border-t-2 border-border-strong pt-8 sm:grid-cols-[8rem_1fr]">
          {techStack.map((group) => (
            <div key={group.category} className="contents">
              <dt className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-accent">
                {group.category}
              </dt>
              <dd className="text-sm leading-relaxed text-foreground-muted">
                {group.items.join(", ")}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
