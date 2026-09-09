import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { getAllPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";

/** Latest posts on the homepage. Rows match the /blog index so the two read as one thing. */
const MAX_POSTS = 3;

export function Writing() {
  const posts = getAllPosts().slice(0, MAX_POSTS);

  // Nothing published yet — render nothing rather than an empty section.
  if (posts.length === 0) return null;

  return (
    <Section
      id="writing"
      label="Writing"
      aside={
        <Link
          href="/blog"
          className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors"
        >
          All posts
          <ArrowUpRight size={14} />
        </Link>
      }
    >
      <div className="divide-border divide-y">
        {posts.map((post, i) => (
          // Padding sits on Reveal, not the Link: Reveal is the element in the
          // divided list, so first:/last: only resolve correctly out here.
          <Reveal
            key={post.slug}
            delay={Math.min(i * 0.08, 0.24)}
            className="py-6 first:pt-0 last:pb-0"
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <div>
                <h3 className="font-display text-foreground group-hover:text-accent text-xl font-bold tracking-tight transition-colors sm:text-2xl">
                  {post.title}
                </h3>
                <p className="text-foreground-muted mt-2 max-w-xl text-base">{post.description}</p>
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
    </Section>
  );
}
