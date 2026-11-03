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
          <p className="text-foreground-subtle text-sm">
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
            I build custom rather than on templates: a site shaped around the business and what it
            sells, not around a theme. Framer is the one tool that&apos;s made me rethink that, and
            I keep an eye on what it can do.
          </p>
          <p>
            I ran my own studio in Qatar, AlSufun, and still build for clients in Doha; I&apos;m
            now based in Islamabad, closer to the startup teams I wanted to learn from. The
            projects I take on have one thing in common: the people behind them care how the work
            turns out.
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
              <dt className="text-sm font-medium text-accent">
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
