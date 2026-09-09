import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Rss } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/Section";
import { getAllPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building software, AI, and shipping products.",
  alternates: {
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <header className="border-border-strong relative overflow-hidden border-b-2">
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
        />
        <Container className="relative grid grid-cols-1 gap-8 py-20 sm:py-28 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
          <div className="flex flex-col items-start gap-5">
            <SectionLabel as="p">Writing</SectionLabel>
            <a
              href="/blog/rss.xml"
              className="text-foreground-muted hover:text-foreground inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase transition-colors"
            >
              <Rss size={14} />
              RSS
            </a>
          </div>

          <div className="min-w-0">
            <RevealText
              as="h1"
              trigger="mount"
              className="font-display text-h1 text-foreground max-w-2xl leading-[1.05] font-bold tracking-tight"
            >
              Blog
            </RevealText>
            <p className="text-foreground-muted mt-6 max-w-xl text-lg leading-relaxed">
              Notes on building software, AI, and whatever else is worth writing down.
            </p>
          </div>
        </Container>
      </header>

      <Container className="grid grid-cols-1 gap-8 py-20 sm:py-28 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
        <div aria-hidden />
        <div className="min-w-0">
          {posts.length === 0 ? (
            <p className="text-foreground-muted">Nothing published yet — check back soon.</p>
          ) : (
            <div className="divide-border divide-y">
              {posts.map((post, i) => (
                // Padding sits on Reveal, not the Link: Reveal is the element in the
                // divided list, so first:/last: only resolve correctly out here.
                <Reveal
                  key={post.slug}
                  delay={Math.min(i * 0.06, 0.3)}
                  className="py-6 first:pt-0 last:pb-0"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <div>
                      <h2 className="font-display text-foreground group-hover:text-accent text-xl font-bold tracking-tight transition-colors sm:text-2xl">
                        {post.title}
                        {post.draft ? (
                          <span className="border-accent text-accent ml-3 border-2 px-2 py-0.5 align-middle font-mono text-[10px] font-bold tracking-[0.16em] uppercase">
                            Draft
                          </span>
                        ) : null}
                      </h2>
                      <p className="text-foreground-muted mt-2 max-w-xl text-base">
                        {post.description}
                      </p>
                    </div>
                    <div className="text-foreground-subtle flex shrink-0 items-center gap-3 font-mono text-xs tracking-[0.08em] uppercase">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span aria-hidden>·</span>
                      <span>{post.readingMinutes} min</span>
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
