import type { Metadata } from "next";
import { siteConfig } from "@/data/config";

/**
 * Metadata for a top-level page. A page-level `openGraph` replaces the root
 * layout's object wholesale rather than merging into it, so a page that only
 * set `title` would share with the homepage's title and description. This
 * fills in all three surfaces at once. The share image itself comes from the
 * route's opengraph-image.tsx, which Next attaches on top of this.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  /** Route path, e.g. "/pricing" — resolved against metadataBase. */
  path: string;
}): Metadata {
  const fullTitle = `${title} — ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: siteConfig.name,
      url: path,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
