import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { RevealText } from "@/components/ui/RevealText";
import { getAllPosts, getPostBySlug } from "@/data/blog";
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

  return (
    <article>
      <header className="relative overflow-hidden border-b-2 border-border-strong">
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
        />
        <Container className="relative py-20 sm:py-28">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft size={15} />
            Back to blog
          </Link>

          <time
            dateTime={post.date}
            className="mt-8 inline-block bg-accent px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground"
          >
            {formatDate(post.date)}
          </time>
          <RevealText
            as="h1"
            trigger="mount"
            className="font-display text-h1 mt-6 max-w-3xl font-bold leading-[1.05] tracking-tight text-foreground"
          >
            {post.title}
          </RevealText>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}
        </Container>
      </header>

      <Container className="py-20 sm:py-28">
        <div className="prose prose-lg max-w-2xl prose-headings:font-display prose-code:before:content-none prose-code:after:content-none">
          <MDXRemote
            source={post.content}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>
      </Container>
    </article>
  );
}
