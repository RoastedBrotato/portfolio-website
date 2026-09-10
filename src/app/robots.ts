import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Token-gated moderation UI — nothing here belongs in an index.
      disallow: "/admin",
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
