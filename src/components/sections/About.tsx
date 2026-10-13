import { Download } from "lucide-react";
import { Section, type SectionTone } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { techStack } from "@/data/techStack";
import { siteConfig } from "@/data/config";

/* The texture. A list, not a paragraph, so it reads as facts rather than filler. */
const offTheClock = [
  "Islamabad, Pakistan. Decent chance I'm in the mountains instead while you read this.",
  "Anime, metal, the gym, and as much hiking and trekking as I can get away with.",
  "Working toward a setup where I can travel and work at the same time. The digital nomad plan.",
  "Up for a yap session over coffee if you're in town.",
];

/* Three statements, the way I actually work. The homepage says the first one. */
const wired = [
  {
    title: "I build the whole thing.",
    body: "The interface and the systems behind it, from the first call to launch. You talk to the person who builds it, so nothing is lost in a handoff.",
  },
  {
    title: "Pretty isn't the hard part.",
    body: "I'd rather ship something slightly less flashy that still works on a mid-range phone in a year than something that looks great in the mockup and falls over after launch.",
  },
  {
    title: "I tinker.",
    body: "Gadgets, new models, whatever shipped this week. Most of it goes in the Lab. Some of it ends up in client work, which is the point.",
  },
];

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
          <p className="text-foreground text-lg">
            I&apos;m Waleed. A backend engineer who got bored and learned to make things move.
          </p>
          <p>
            I spent five years on donation systems at Qatar Charity, got pulled into a project
            that needed real ML models rather than just APIs, and when the current wave of AI
            models landed I went all in: Claude, OpenAI, Kimi, self-hosted Ollama, RAG systems
            built from scratch. What kept me there wasn&apos;t the hype. It was how fast an idea
            could become a working thing.
          </p>
          <p>
            These days I build websites: landing pages, brand sites, and the motion and 3D that
            make them worth remembering, with the backend wired properly, because I&apos;m the one
            who gets called when it isn&apos;t. Anything that isn&apos;t a website, like software,
            automation or brand work, goes through Sufun, my studio.
          </p>
          <p>
            I don&apos;t build on WordPress or templates. They cap what you can do, and I&apos;d
            rather ship something built around the actual problem than around a theme. Framer is
            the one exception that changed my mind.
          </p>
          <p>
            I ran my own company in Qatar before moving to Pakistan to be nearer the startup teams
            I wanted to learn from. I take on projects with people who care about the work: good
            engineering, a real environment, some creative energy. I&apos;ve already done the
            bad-management thing.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-14 max-w-2xl">
        <p className="text-foreground-subtle font-mono text-xs tracking-[0.14em] uppercase">
          Off the clock
        </p>
        <ul className="mt-4 flex flex-col gap-2.5">
          {offTheClock.map((line) => (
            <li
              key={line}
              className="text-foreground-muted flex items-start gap-3 text-base leading-relaxed"
            >
              <span aria-hidden className="bg-accent mt-[0.6em] h-1.5 w-1.5 shrink-0" />
              {line}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

/** Three short statements on /about: how I work, in the voice of the blog. */
export function Wired({ tone }: { tone?: SectionTone }) {
  return (
    <Section id="wired" label="How I'm wired" tone={tone}>
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3">
        {wired.map((item, i) => (
          <Reveal key={item.title} delay={Math.min(i * 0.08, 0.16)}>
            <span className="text-accent font-mono text-xs font-bold tracking-[0.16em]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-foreground mt-3 text-2xl leading-[1.1] font-bold tracking-tight">
              {item.title}
            </h3>
            <p className="text-foreground-muted mt-3 text-base leading-relaxed">{item.body}</p>
          </Reveal>
        ))}
      </div>
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
