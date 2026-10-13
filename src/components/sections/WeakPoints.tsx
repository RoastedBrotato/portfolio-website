import { Section, type SectionTone } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";

/*
 * The enemy, named (docs/voice.md): the site that looked great in the mockup
 * and fell over after launch. Four symptoms the reader will recognise, each a
 * headline and one line, then the one "why me" argument the site makes.
 */
const symptoms = [
  {
    title: "Looks great. Runs terribly.",
    detail: "The website looks polished, but it's slow, fragile, or difficult to maintain.",
  },
  {
    title: "The feature works. Until you need to change it.",
    detail:
      "The first version works. Adding an integration or a new feature becomes unreasonably difficult.",
  },
  {
    title: "Everything depends on one fragile setup.",
    detail: "The site becomes difficult to deploy, troubleshoot, or hand to anyone else.",
  },
  {
    title: "Paid once. Paid again to fix it.",
    detail: "The original delivery creates repair costs instead of moving the business forward.",
  },
];

/**
 * The "Make it work" beat on the homepage, between Selected work and the
 * packages: show the interesting, name what usually goes wrong, say who fixes
 * it, then make it buyable.
 */
export function WeakPoints({ index, tone }: { index?: number; tone?: SectionTone }) {
  return (
    <Section id="problems" label="Make it work" index={index} tone={tone}>
      <RevealText
        as="h2"
        trigger="inView"
        className="font-display text-h2 text-foreground max-w-2xl leading-[1.05] font-bold tracking-tight"
      >
        {[
          { text: "Pretty" },
          { text: "is" },
          { text: "easy" },
          { text: "to" },
          { text: "promise.", emphasis: true },
        ]}
      </RevealText>

      <Reveal delay={0.1}>
        <p className="text-foreground-muted mt-6 max-w-xl text-lg leading-relaxed">
          Building something that performs, scales and stays maintainable takes engineering.
          When it&apos;s missing, this is what the first year looks like. Sound familiar?
        </p>
      </Reveal>

      {/* Quiet on purpose: body type, no numbers, no display headings, so the
          list reads as complaints rather than as a second set of packages. */}
      <Reveal delay={0.15}>
        <p className="text-foreground-subtle mt-12 font-mono text-xs tracking-[0.14em] uppercase">
          What usually goes wrong
        </p>
        <ul className="mt-5 flex max-w-xl flex-col gap-5">
          {symptoms.map((symptom) => (
            <li key={symptom.title} className="flex items-start gap-3">
              <span aria-hidden className="bg-accent mt-[0.55em] h-1.5 w-1.5 shrink-0" />
              <p className="text-base leading-relaxed">
                <span className="text-foreground font-bold">{symptom.title}</span>{" "}
                <span className="text-foreground-muted">{symptom.detail}</span>
              </p>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* The answer: one person, no handoffs. Also where the person shows up
          on the homepage, once, with one line of texture. */}
      <Reveal delay={0.1}>
        <div className="mt-12 max-w-2xl">
          <p className="text-foreground-subtle font-mono text-xs tracking-[0.14em] uppercase">
            Where I come in
          </p>
          <p className="text-foreground mt-4 text-xl leading-relaxed sm:text-2xl">
            Most sites pass through a designer, a developer, whoever does the backend, and later
            the person hired to fix it. Each handoff loses something.
          </p>
          <p className="text-foreground-muted mt-4 text-lg leading-relaxed">
            I work across the interface and the systems behind it, so the decisions that make a
            site look good don&apos;t come at the expense of how it actually works. I&apos;m
            Waleed: a backend engineer who got bored and learned to make things move.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
