import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { Section, type SectionTone } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { siteConfig } from "@/data/config";

/** The second door: for the visitor who isn't ready to ask for a quote yet. */
const warmingUp = [
  { label: "Blog", detail: "How I work, and the occasional yap.", href: "/blog", external: false },
  { label: "Lab", detail: "What I'm messing with this month.", href: "/lab", external: false },
  { label: "Instagram", detail: "The work, as it ships.", href: siteConfig.instagram, external: true },
].filter((door) => door.href);

/**
 * The closing ask, as two doors. "Ready" goes to /quote, the one form on the
 * site. "Still warming up" goes to the blog, the Lab and Instagram, so a visitor
 * who isn't buying today still has somewhere to go that sounds like me.
 */
export function ContactCTA({ index, tone }: { index?: number; tone?: SectionTone }) {
  return (
    <Section id="contact" label="Contact" index={index} tone={tone}>
      <RevealText
        as="h2"
        trigger="inView"
        className="font-display text-h1 text-foreground max-w-3xl leading-[1.05] font-bold tracking-tight"
      >
        {[{ text: "Let's" }, { text: "make" }, { text: "it" }, { text: "work.", emphasis: true }]}
      </RevealText>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal delay={0.1}>
          <p className="text-foreground-subtle font-mono text-xs tracking-[0.14em] uppercase">
            If you&apos;re ready
          </p>
          <p className="text-foreground-muted mt-4 max-w-md text-lg leading-relaxed">
            Tell me what you&apos;re building. You&apos;ll hear back within a working day, from
            me, the person who builds it.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href="/quote" size="lg">
              Get a quote
              <ArrowRight size={16} />
            </Button>
            <BookCallButton placement="contact" size="lg" variant="secondary" />
          </div>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-foreground-muted decoration-accent hover:text-foreground mt-8 inline-block text-sm underline decoration-2 underline-offset-4 transition-colors"
          >
            {siteConfig.email}
          </a>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="text-foreground-subtle font-mono text-xs tracking-[0.14em] uppercase">
            If you&apos;re still warming up
          </p>
          <p className="text-foreground-muted mt-4 max-w-md text-lg leading-relaxed">
            Read how I work and what I&apos;m messing with, then come back when it&apos;s time.
          </p>
          <ul className="divide-border border-border-strong mt-8 max-w-md divide-y border-y-2">
            {warmingUp.map((door) => {
              const inner = (
                <>
                  <span>
                    <span className="text-foreground group-hover:text-accent block font-mono text-sm font-bold tracking-[0.12em] uppercase transition-colors">
                      {door.label}
                    </span>
                    <span className="text-foreground-muted mt-1 block text-sm">{door.detail}</span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    aria-hidden
                    className="text-accent shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </>
              );
              const className = "group flex items-center justify-between gap-6 py-4";
              return (
                <li key={door.label}>
                  {door.external ? (
                    <a
                      href={door.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link href={door.href} className={className}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
