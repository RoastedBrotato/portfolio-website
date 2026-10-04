import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/config";
import { projects } from "@/data/projects";
import { getAllPosts } from "@/data/blog";
import { getLabEntries } from "@/data/lab";
import { getStudies } from "@/data/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // The conversion pages rank just under the homepage: they're where a
    // visitor from a social post is meant to end up.
    {
      url: `${siteConfig.siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.siteUrl}/quote`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.siteUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...getStudies().map((item) => ({
      url: `${siteConfig.siteUrl}/work/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map((project) => ({
      url: `${siteConfig.siteUrl}/work/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${siteConfig.siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // An empty page isn't worth sending a crawler to.
    ...(getLabEntries().length > 0
      ? [
          {
            url: `${siteConfig.siteUrl}/lab`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          },
          // The demos themselves, linked from their Lab entries.
          ...getLabEntries()
            .filter((entry) => entry.href?.startsWith("/"))
            .map((entry) => ({
              url: `${siteConfig.siteUrl}${entry.href}`,
              lastModified: new Date(entry.date),
              changeFrequency: "monthly" as const,
              priority: 0.6,
            })),
        ]
      : []),
    {
      url: `${siteConfig.siteUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...getAllPosts().map((post) => ({
      url: `${siteConfig.siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return routes;
}
