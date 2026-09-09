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
import { getAdjacentPosts, getAllPosts, getPostBySlug } from "@/data/blog";
import { formatDate } from "@/lib/utils";

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
