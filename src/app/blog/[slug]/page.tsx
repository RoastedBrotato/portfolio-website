import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/Section";
import { mdxComponents, prettyCodeOptions } from "@/components/blog/mdx";
import { CommentForm } from "@/components/blog/CommentForm";
import { CommentList } from "@/components/blog/CommentList";
import { getAdjacentPosts, getAllPosts, getPostBySlug } from "@/data/blog";
import { commentsEnabled, getPostComments } from "@/lib/comments";
import { formatDate } from "@/lib/utils";

/*
 * Still prerendered, but no longer fully static: approved comments are read at
 * render time. Approving one revalidates just that post; the hourly window is
 * the safety net, as on /reviews.
 */
export const revalidate = 3600;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getAdjacentPosts(slug);
  const enabled = commentsEnabled();
  const comments = enabled ? await getPostComments(slug) : [];

  return (
    <article>
      <header className="border-border-strong relative overflow-hidden border-b-2">
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
        />
        <Container className="relative grid grid-cols-1 gap-8 py-20 sm:py-28 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
          <div className="flex flex-col items-start gap-5">
            <SectionLabel as="p">{formatDate(post.date)}</SectionLabel>
            <span className="text-foreground-subtle font-mono text-xs tracking-[0.12em] uppercase">
              {post.readingMinutes} min read
            </span>
            {post.draft ? (
              <span className="border-accent text-accent border-2 px-2.5 py-1 font-mono text-xs font-bold tracking-[0.16em] uppercase">
                Draft
              </span>
            ) : null}
            {enabled ? (
              <a
                href="#comments"
                className="text-foreground-subtle hover:text-foreground font-mono text-xs tracking-[0.12em] uppercase transition-colors"
              >
                {comments.length === 0
                  ? "Leave a comment"
                  : `${comments.length} comment${comments.length === 1 ? "" : "s"}`}
              </a>
            ) : null}
            <Link
              href="/blog"
              className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </Link>
          </div>

          <div className="min-w-0">
            <RevealText
              as="h1"
              trigger="mount"
              className="font-display text-h1 text-foreground max-w-3xl leading-[1.05] font-bold tracking-tight"
            >
              {post.title}
            </RevealText>
            <p className="text-foreground-muted mt-6 max-w-2xl text-lg leading-relaxed">
              {post.description}
            </p>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </Container>
      </header>

      {/* Empty rail keeps the prose on the same left edge as every other page. */}
      <Container className="grid grid-cols-1 gap-8 py-20 sm:py-28 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
        <div aria-hidden />
        <div className="prose prose-lg prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-code:before:content-none prose-code:after:content-none min-w-0 max-w-2xl">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
              },
            }}
          />
        </div>
      </Container>

      {/* Straight after the prose, where a reader finishing the post looks
          next. The form offers a private note too, so this one section
          replaces the old feedback box rather than sitting beside it. */}
      <section id="comments" className="border-border-strong scroll-mt-20 border-t-2">
        <Container className="grid grid-cols-1 gap-8 py-16 sm:py-20 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
          <div className="flex flex-col items-start gap-3">
            <SectionLabel as="h2">Comments</SectionLabel>
            {comments.length > 0 ? (
              <span className="text-foreground-subtle font-mono text-xs tracking-[0.12em] uppercase">
                {comments.length} so far
              </span>
            ) : null}
          </div>
          <div className="min-w-0">
            {enabled ? (
              <>
                <CommentList comments={comments} />
                <h3 className="text-foreground mt-12 mb-5 font-mono text-sm font-bold tracking-[0.14em] uppercase">
                  Add yours
                </h3>
                <CommentForm slug={post.slug} />
              </>
            ) : (
              <p className="text-foreground-subtle max-w-xl text-sm">
                Comments are offline right now — email me instead.
              </p>
            )}
          </div>
        </Container>
      </section>

      {(prev || next) && (
        <nav className="border-border-strong border-t-2">
          <Container className="divide-border grid grid-cols-1 divide-y-2 sm:grid-cols-2 sm:divide-x-2 sm:divide-y-0">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group flex flex-col gap-2 py-12 sm:pr-10"
              >
                <span className="text-foreground-subtle group-hover:text-accent inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.16em] uppercase transition-colors">
                  <ArrowLeft size={14} />
                  Older
                </span>
                <span className="font-display text-foreground group-hover:text-accent text-xl font-bold transition-colors">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group flex flex-col gap-2 py-12 text-right sm:items-end sm:pl-10"
              >
                <span className="text-foreground-subtle group-hover:text-accent inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.16em] uppercase transition-colors">
                  Newer
                  <ArrowRight size={14} />
                </span>
                <span className="font-display text-foreground group-hover:text-accent text-xl font-bold transition-colors">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </Container>
        </nav>
      )}

    </article>
  );
}
