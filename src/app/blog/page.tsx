import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { getAllPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building software, AI, and shipping products.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <header className="relative overflow-hidden border-b-2 border-border-strong">
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
        />
        <Container className="relative py-20 sm:py-28">
          <span className="inline-block bg-accent px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground">
            Writing
          </span>
          <RevealText
            as="h1"
            trigger="mount"
            className="font-display text-h1 mt-6 max-w-2xl font-bold leading-[1.05] tracking-tight text-foreground"
          >
            Blog
          </RevealText>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">
            Notes on building software, AI, and whatever else is worth writing down.
          </p>
        </Container>
      </header>

      <Container className="py-20 sm:py-28">
        {posts.length === 0 ? (
          <p className="text-foreground-muted">Nothing published yet — check back soon.</p>
        ) : (
          <div className="divide-y divide-border">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={Math.min(i * 0.06, 0.3)}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-2 py-6 first:pt-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <div>
                    <h2 className="font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-2xl">
                      {post.title}
                    </h2>
                    <p className="mt-2 max-w-xl text-base text-foreground-muted">
                      {post.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-sm text-foreground-subtle">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
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
      </Container>
    </>
  );
}
