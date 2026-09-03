import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { BlogPost, BlogPostMeta } from "@/types";

/**
 * Blog content lives as .mdx files in /content/blog, one per post. Add a new
 * post by dropping a file there — no code changes needed. See
 * content/blog/hello-world.mdx for the expected frontmatter shape.
 */
const BLOG_DIR = path.join(process.cwd(), "content/blog");

function readSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function readMeta(slug: string): BlogPostMeta {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
  const { data } = matter(raw);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    tags: data.tags ?? [],
  };
}

export function getAllPosts(): BlogPostMeta[] {
  return readSlugs()
    .map((slug) => readMeta(slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  if (!readSlugs().includes(slug)) return undefined;
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    tags: data.tags ?? [],
    content,
  };
}

export function getAdjacentPosts(slug: string): { prev?: BlogPostMeta; next?: BlogPostMeta } {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return { prev: posts[index + 1], next: posts[index - 1] };
}
