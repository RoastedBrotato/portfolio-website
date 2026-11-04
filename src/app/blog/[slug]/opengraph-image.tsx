import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";
import { getAllPosts, getPostBySlug } from "@/data/blog";

export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

/* Its own card per post, so a shared link carries the title, not the homepage's. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return renderOgImage({
    tag: post?.tags?.[0] ?? "Blog",
    headline: post?.title ?? "Blog",
  });
}
