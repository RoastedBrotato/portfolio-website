import { Download } from "lucide-react";
import { Section, type SectionTone } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { techStack } from "@/data/techStack";
import { siteConfig } from "@/data/config";

/** The bio, on /about. Location and the resume sit in the rail. */
export function About() {
  return (
    <Section
      id="bio"
      label="Bio"
      aside={
        <div className="flex flex-col gap-3 lg:items-start">
          <p className="text-foreground-subtle font-mono text-xs tracking-[0.12em] uppercase">
            {siteConfig.location}
          </p>
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            Resume
            <Download size={14} />
          </a>
        </div>
      }
    >
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
            startup teams I wanted to learn from. At this point I&apos;m only taking on projects with
            people who care about the work — good engineering, a real environment,
            some creative energy. I&apos;ve already done the bad-management thing.
          </p>
          <p className="text-foreground-subtle">
            Outside of work: anime, metal, the gym, and as much hiking and trekking as I can get
            away with — there&apos;s a decent chance I&apos;m somewhere in the mountains while
            you&apos;re reading this.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/** The tools, grouped. Its own section on /about rather than a footnote to the bio. */
export function Stack({ tone }: { tone?: SectionTone }) {
  return (
    <Section id="stack" label="Stack" tone={tone}>
      <Reveal className="max-w-2xl">
        {/* The label column sizes to its longest label ("Infrastructure"): a
            fixed 8rem let it run into the list beside it. */}
        <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-[max-content_1fr] sm:gap-y-5">
          {techStack.map((group) => (
            <div key={group.category} className="contents">
              <dt className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-accent">
                {group.category}
              </dt>
              <dd className="pb-3 text-sm leading-relaxed text-foreground-muted sm:pb-0">
                {group.items.join(", ")}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
