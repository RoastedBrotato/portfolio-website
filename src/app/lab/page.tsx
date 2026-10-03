import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { MediaPreview } from "@/components/work/MediaPreview";
import { getLabEntries } from "@/data/lab";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Lab",
  description:
    "Experiments, creative challenges and AI-tool tests — new tech tried in public, rough edges included.",
  path: "/lab",
});

export default function LabPage() {
  const entries = getLabEntries();

  return (
    <>
      <PageHeader
        label="Lab"
        title="Lab"
        intro="Experiments, creative challenges and AI-tool tests. Some become client work; most just teach me something. Rough edges included."
        aside={
          entries.length > 0 ? (
            <p className="text-foreground-subtle font-mono text-xs tracking-[0.12em] uppercase">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </p>
          ) : null
        }
      />

      <Container className="grid grid-cols-1 gap-8 py-20 sm:py-28 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
        <div aria-hidden />
        <div className="min-w-0">
          {entries.length === 0 ? (
            <p className="text-foreground-muted">First experiments are on the way — check back soon.</p>
          ) : (
            <div className="divide-border divide-y">
              {entries.map((entry, i) => (
                <Reveal
                  key={entry.slug}
                  delay={Math.min(i * 0.06, 0.3)}
                  className="py-10 first:pt-0 last:pb-0"
                >
                  <article className="group grid grid-cols-1 gap-6 sm:grid-cols-[16rem_1fr] sm:gap-8">
                    <MediaPreview media={entry.media} sizes="(min-width: 640px) 256px, 100vw" />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        {entry.placeholder ? (
                          <span className="bg-accent text-accent-foreground px-2 py-0.5 font-mono text-[11px] font-bold tracking-[0.14em] uppercase">
                            Placeholder · dev only
                          </span>
                        ) : null}
                        <time
                          dateTime={entry.date}
                          className="text-foreground-subtle font-mono text-xs tracking-[0.08em] uppercase"
                        >
                          {formatDate(entry.date)}
                        </time>
                        {entry.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="text-accent font-mono text-xs font-bold tracking-[0.16em] uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="font-display text-foreground mt-3 text-xl font-bold tracking-tight sm:text-2xl">
                        {entry.href ? (
                          <a
                            href={entry.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent inline-flex items-baseline gap-1.5 transition-colors"
                          >
                            {entry.title}
                            <ArrowUpRight size={16} className="shrink-0 self-center" />
                          </a>
                        ) : (
                          entry.title
                        )}
                      </h2>
                      <p className="text-foreground-muted mt-3 max-w-xl text-base leading-relaxed">
                        {entry.note}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
