import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/config";
import { projects } from "@/data/projects";
import { getAllPosts } from "@/data/blog";
import { getLabEntries } from "@/data/lab";
import { getStudies } from "@/data/work";

/*
 * No `lastModified` on the pages without a real date. It used to be
 * `new Date()` on every entry, which stamps every page as changed on every
 * request; Google documents that it ignores lastmod once it has seen it be
 * wrong, and a sitemap that cries wolf loses the dates that are real too
 * (the posts and the lab entries). The blog index and the lab index carry
 * the date of their newest entry.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const site = siteConfig.siteUrl;
  const posts = getAllPosts();
  const lab = getLabEntries();
  const newest = (dates: string[]) =>
    dates.length > 0 ? new Date(dates.sort().at(-1) as string) : undefined;

  const routes: MetadataRoute.Sitemap = [
    { url: site, changeFrequency: "monthly", priority: 1 },
    // The conversion pages rank just under the homepage: they're where a
    // visitor from a social post is meant to end up.
    { url: `${site}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site}/quote`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site}/work`, changeFrequency: "monthly", priority: 0.8 },
    ...getStudies().map((item) => ({
      url: `${site}/work/${item.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map((project) => ({
      url: `${site}/work/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${site}/about`, changeFrequency: "monthly", priority: 0.7 },
    // An empty page isn't worth sending a crawler to.
    ...(lab.length > 0
      ? [
          {
            url: `${site}/lab`,
            lastModified: newest(lab.map((entry) => entry.date)),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          },
          // The demos themselves, linked from their Lab entries.
          ...lab
            .filter((entry) => entry.href?.startsWith("/"))
            .map((entry) => ({
              url: `${site}${entry.href}`,
              lastModified: new Date(entry.date),
              changeFrequency: "monthly" as const,
              priority: 0.6,
            })),
        ]
      : []),
    { url: `${site}/brand`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site}/reviews`, changeFrequency: "weekly", priority: 0.6 },
    {
      url: `${site}/blog`,
      lastModified: newest(posts.map((post) => post.date)),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${site}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return routes;
}
