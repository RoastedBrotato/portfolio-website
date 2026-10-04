import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionLabel } from "@/components/ui/Section";
import { MediaPreview } from "@/components/work/MediaPreview";
import type { WorkItem } from "@/types";

/**
 * The creative case-study template (audit 5.2): image-led, light on text.
 * Full-bleed hero clip, a one-paragraph brief, the stills and clips in a
 * vertical sequence with captions that stick beside them, a short "how it was
 * built", the result, and the next piece.
 */
export function CreativeStudyLayout({ item, next }: { item: WorkItem; next?: WorkItem }) {
  const study = item.study!;
  const [lead, ...sequence] = study.sequence;
  const liveIsInternal = item.href?.startsWith("/");

  return (
    <article>
      {/* Immersive opener: the lead clip edge to edge, the title over its foot. */}
      <header>
        <div className="relative">
          <MediaPreview media={lead?.media ?? item.media} sizes="100vw" priority className="border-x-0 border-t-0 aspect-[4/5] sm:aspect-[21/9]" />
          <div aria-hidden className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t to-transparent" />
        </div>
        <Container className="relative -mt-[0.6em] text-title lg:pl-[calc(var(--rail)+var(--rail-gap)+2rem)]">
          <h1 className="font-display text-foreground leading-[0.95] font-bold tracking-tight">{item.title}</h1>
        </Container>
        <Container className="grid grid-cols-1 gap-8 pt-8 pb-16 sm:pb-20 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
          <div className="flex flex-col items-start gap-5">
            <SectionLabel as="p">{item.tags[0] ?? "Work"}</SectionLabel>
            <Link
              href="/work"
              className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors"
            >
              <ArrowLeft size={14} />
              All work
            </Link>
          </div>
          <div className="min-w-0">
            <p className="text-foreground-muted max-w-2xl text-lg leading-relaxed sm:text-xl">{item.description}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {study.build.stack.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              {item.href ? (
                <Button href={item.href} external={!liveIsInternal}>
                  View live
                  {liveIsInternal ? <ArrowRight size={15} /> : <ExternalLink size={15} />}
                </Button>
              ) : null}
              <Button href="/quote" variant="secondary">
                Get a quote
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <Section label="Brief" tone="plane-1">
        <Reveal>
          <p className="text-foreground max-w-2xl text-xl leading-relaxed sm:text-2xl">{study.brief}</p>
        </Reveal>
      </Section>

      {sequence.length > 0 ? (
        <section className="border-border-strong border-t-2 py-20 sm:py-28">
          <Container className="flex flex-col gap-20 sm:gap-28">
            {sequence.map((step, i) => (
              <Reveal key={i} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_18rem] lg:gap-[var(--rail-gap)]">
                <MediaPreview media={step.media} sizes="(min-width: 1024px) 70vw, 100vw" />
                {/* The caption rides alongside the image as it scrolls past. */}
                <div>
                  <div className="lg:sticky lg:top-28">
                    <span className="text-accent font-mono text-xs font-bold tracking-[0.16em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-foreground-muted border-border-strong mt-3 border-t-2 pt-4 text-base leading-relaxed">
                      {step.caption}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </Container>
        </section>
      ) : null}

      <Section label="How it was built" tone="plane-1">
        <dl className="border-border-strong grid grid-cols-2 gap-px border-2 bg-[var(--border)] lg:grid-cols-4">
          {study.build.budget.map(([label, value]) => (
            <div key={label} className="bg-plane-1 p-5">
              <dt className="text-foreground-subtle font-mono text-[11px] tracking-[0.14em] uppercase">{label}</dt>
              <dd className="text-foreground mt-2 font-mono text-base font-bold">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
          {study.build.notes.map((note) => (
            <div key={note.title}>
              <h3 className="text-foreground font-mono text-sm font-bold tracking-[0.08em] uppercase">{note.title}</h3>
              <p className="text-foreground-muted mt-2.5 text-base leading-relaxed">{note.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Result">
        <p className="text-foreground max-w-2xl text-xl leading-relaxed sm:text-2xl">{study.result}</p>
      </Section>

      {next ? (
        <nav className="border-border-strong border-t-2">
          <Link href={next.caseStudy ?? `/work/${next.slug}`} className="group block">
            <Container className="flex items-center justify-between gap-8 py-12">
              <div>
                <span className="text-foreground-subtle font-mono text-xs tracking-[0.12em] uppercase">Next piece</span>
                <p className="font-display text-foreground group-hover:text-accent mt-2 text-3xl font-bold tracking-tight transition-colors sm:text-4xl">
                  {next.title}
                </p>
              </div>
              <ArrowRight size={24} className="text-accent shrink-0 transition-transform group-hover:translate-x-1" />
            </Container>
          </Link>
        </nav>
      ) : null}
    </article>
  );
}
