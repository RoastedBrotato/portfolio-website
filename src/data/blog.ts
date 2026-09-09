import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { BlogPost, BlogPostMeta } from "@/types";

/**
 * Blog content lives as .mdx files in /content/blog, one per post. Add a new
 * post by dropping a file there — no code changes needed. See
 * content/blog/hello-world.mdx for the expected frontmatter shape.
 *
 * Posts with `draft: true` are visible when running `next dev` and excluded
 * everywhere else, so work in progress is safe to commit and push.
 */
const BLOG_DIR = path.join(process.cwd(), "content/blog");

const WORDS_PER_MINUTE = 200;

/** Drafts are readable locally so you can preview them; never in a build. */
const includeDrafts = process.env.NODE_ENV === "development";

function readSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function readFile(slug: string) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
  return matter(raw);
}

function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function toMeta(slug: string, data: Record<string, unknown>, content: string): BlogPostMeta {
  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    tags: (data.tags as string[]) ?? [],
    draft: data.draft === true,
    readingMinutes: readingMinutes(content),
  };
}

function isVisible(post: BlogPostMeta): boolean {
  return includeDrafts || !post.draft;
}

export function getAllPosts(): BlogPostMeta[] {
  return readSlugs()
    .map((slug) => {
      const { data, content } = readFile(slug);
      return toMeta(slug, data, content);
    })
    .filter(isVisible)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  if (!readSlugs().includes(slug)) return undefined;
  const { data, content } = readFile(slug);
  const meta = toMeta(slug, data, content);
  if (!isVisible(meta)) return undefined;

  return { ...meta, content };
}

export function getAdjacentPosts(slug: string): { prev?: BlogPostMeta; next?: BlogPostMeta } {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  // getAllPosts() is newest-first, so the *older* post is the next index along.
  return { prev: posts[index + 1], next: posts[index - 1] };
}
