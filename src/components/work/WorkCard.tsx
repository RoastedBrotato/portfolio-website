import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { WorkItem } from "@/types";
import { Container } from "@/components/ui/Container";
import { MediaPreview } from "@/components/work/MediaPreview";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors";

/** The title goes to the deepest thing there is: the write-up if one exists, otherwise the live piece. */
function WorkTitle({ item }: { item: WorkItem }) {
  const primary = item.caseStudy ?? item.href;
  if (!primary) return <>{item.title}</>;

  const inner = (
    <span className="relative inline-block transition-transform duration-300 ease-out group-hover:translate-x-2">
      {item.title}
      {/* The red rule draws under the title on hover — the site's one motif. */}
      <span
        aria-hidden
        className="bg-accent absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
    </span>
  );

  return item.caseStudy ? (
    <Link href={primary}>{inner}</Link>
  ) : (
    <a href={primary} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  );
}

function Meta({ item }: { item: WorkItem }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {item.placeholder ? (
        <span className="bg-accent text-accent-foreground px-2 py-0.5 font-mono text-[11px] font-bold tracking-[0.14em] uppercase">
          Placeholder · dev only
        </span>
      ) : null}
      {item.tags.map((tag) => (
        <span key={tag} className="text-accent font-mono text-xs font-bold tracking-[0.16em] uppercase">
          {tag}
        </span>
      ))}
      {item.year ? (
        <span className="text-foreground-subtle font-mono text-xs tracking-[0.12em]">{item.year}</span>
      ) : null}
    </div>
  );
}

function Links({ item }: { item: WorkItem }) {
  if (!item.caseStudy && !item.href) return null;
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
      {item.caseStudy ? (
        <Link
          href={item.caseStudy}
          className={cn(
            linkClass,
            "text-foreground decoration-accent hover:text-accent font-bold underline decoration-2 underline-offset-4",
          )}
        >
          Case study
          <ArrowUpRight size={15} />
        </Link>
      ) : null}
      {item.href?.startsWith("/") ? (
        // A demo that lives on this site (the Lab pieces): same tab.
        <Link href={item.href} className={cn(linkClass, "text-foreground-muted hover:text-foreground")}>
          View live
          <ArrowUpRight size={13} />
        </Link>
      ) : item.href ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkClass, "text-foreground-muted hover:text-foreground")}
        >
          View live
          <ExternalLink size={13} />
        </a>
      ) : null}
    </div>
  );
}

/**
 * The lead "Selected work" piece — Immersive weight. The clip runs edge to edge
 * with no rail, and the title in display type sits over its bottom edge.
 */
export function LeadWorkCard({ item }: { item: WorkItem }) {
  return (
    <article className="group">
      <div className="relative" data-cursor={item.caseStudy || item.href ? "View" : undefined}>
        <MediaPreview
          media={item.media}
          sizes="100vw"
          className="border-x-0 aspect-[4/5] sm:aspect-[21/9]"
        />
        {/* Darkens only the strip the title sits on, so it holds over any frame. */}
        <div
          aria-hidden
          className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t to-transparent"
        />
      </div>
      <Container className="relative -mt-[0.6em] text-title lg:pl-[calc(var(--rail)+var(--rail-gap)+2rem)]">
        <h3 className="font-display text-foreground leading-[0.95] font-bold tracking-tight">
          <WorkTitle item={item} />
        </h3>
      </Container>
      <Container className="mt-6 lg:pl-[calc(var(--rail)+var(--rail-gap)+2rem)]">
        <Meta item={item} />
        <p className="text-foreground-muted mt-3 max-w-xl text-lg leading-relaxed">{item.description}</p>
        <Links item={item} />
      </Container>
    </article>
  );
}

/** A secondary "Selected work" piece, in the two-up grid under the lead. */
export function WorkCard({ item }: { item: WorkItem }) {
  return (
    <article className="group flex flex-col">
      <div className="border-border-strong border-2" data-cursor={item.caseStudy || item.href ? "View" : undefined}>
        <MediaPreview media={item.media} sizes="(min-width: 640px) 50vw, 100vw" className="border-0" />
        {/* Caption bar instead of browser chrome: what it is, and when. */}
        <div className="border-border-strong text-foreground-subtle flex items-center justify-between gap-4 border-t-2 px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] uppercase">
          <span className="text-foreground flex items-center gap-2 font-bold">
            <span aria-hidden className="bg-accent h-1.5 w-1.5" />
            {item.title}
          </span>
          {item.year ? <span>{item.year}</span> : null}
        </div>
      </div>

      <div className="mt-6">
        <Meta item={item} />
      </div>
      <h3 className="font-display text-foreground mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        <WorkTitle item={item} />
      </h3>
      <p className="text-foreground-muted mt-3 max-w-xl text-base leading-relaxed">{item.description}</p>
      <Links item={item} />
    </article>
  );
}
