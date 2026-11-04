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
  type = "website",
  publishedTime,
}: {
  title: string;
  description: string;
  /** Route path, e.g. "/services" — resolved against metadataBase. */
  path: string;
  type?: "website" | "article";
  /** ISO date, articles only. */
  publishedTime?: string;
}): Metadata {
  const fullTitle = `${title} — ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_US",
      siteName: siteConfig.name,
      url: path,
      title: fullTitle,
      description,
      ...(type === "article" ? { publishedTime, authors: [siteConfig.name] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

/* ------------------------------------------------------------------------ */
/* Structured data                                                          */
/* ------------------------------------------------------------------------ */

const absolute = (path: string) => `${siteConfig.siteUrl}${path}`;

/** `@id`s so every page's graph points at the same person and site. */
export const PERSON_ID = absolute("/#person");
export const BUSINESS_ID = absolute("/#business");
export const WEBSITE_ID = absolute("/#website");

/** The two cities in `siteConfig.location`, as Places. */
const AREAS_SERVED = [
  { "@type": "City", name: "Doha", containedInPlace: { "@type": "Country", name: "Qatar" } },
  { "@type": "City", name: "Islamabad", containedInPlace: { "@type": "Country", name: "Pakistan" } },
  { "@type": "Country", name: "Qatar" },
  { "@type": "Country", name: "Pakistan" },
];

/**
 * The site-wide graph, rendered once in the root layout: who runs the site,
 * the service business behind it and the site itself. Pages add their own
 * nodes (Service, FAQPage, Article, BreadcrumbList) that reference these ids.
 */
export function siteGraph() {
  const sameAs = [siteConfig.github, siteConfig.linkedin, siteConfig.instagram, siteConfig.x].filter(
    Boolean,
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: siteConfig.name,
        jobTitle: siteConfig.role,
        description: siteConfig.tagline,
        url: siteConfig.siteUrl,
        email: `mailto:${siteConfig.email}`,
        image: absolute("/brand/mark.png"),
        sameAs,
        knowsAbout: [
          "Web development",
          "Web design",
          "Next.js",
          "React",
          "WebGL",
          "Three.js",
          "Interactive 3D",
          "Motion design",
          "Full-stack engineering",
          "AI engineering",
        ],
        worksFor: { "@id": BUSINESS_ID },
      },
      {
        "@type": "ProfessionalService",
        "@id": BUSINESS_ID,
        name: siteConfig.name,
        description: siteConfig.tagline,
        url: siteConfig.siteUrl,
        email: siteConfig.email,
        image: absolute("/brand/logo.png"),
        logo: absolute("/brand/mark.png"),
        founder: { "@id": PERSON_ID },
        areaServed: AREAS_SERVED,
        priceRange: "$$",
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
      },
    ],
  };
}

/** A Service node for each package on /services. */
export function servicesGraph(
  services: { name: string; description: string; url: string }[],
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...services.map((service) => ({
        "@type": "Service",
        name: service.name,
        description: service.description,
        url: service.url,
        serviceType: service.name,
        provider: { "@id": BUSINESS_ID },
        areaServed: AREAS_SERVED,
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: absolute("/quote"),
          availableLanguage: ["en"],
        },
      })),
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

/** A blog post. */
export function articleGraph(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
}) {
  const url = absolute(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        url,
        mainEntityOfPage: url,
        datePublished: post.date,
        dateModified: post.date,
        keywords: post.tags?.join(", "),
        inLanguage: "en",
        image: `${url}/opengraph-image`,
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
      },
      breadcrumbs([
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ]),
    ],
  };
}

/** A case study, creative or engineering. */
export function caseStudyGraph(item: {
  slug: string;
  title: string;
  description: string;
  kind?: string;
  href?: string;
  year?: string;
  tags?: string[];
}) {
  const url = absolute(`/work/${item.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: item.title,
        headline: item.title,
        description: item.description,
        url,
        mainEntityOfPage: url,
        genre: item.kind,
        keywords: item.tags?.join(", "),
        dateCreated: item.year,
        sameAs: item.href,
        creator: { "@id": PERSON_ID },
        author: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
      },
      breadcrumbs([
        { name: "Work", path: "/work" },
        { name: item.title, path: `/work/${item.slug}` },
      ]),
    ],
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: absolute(item.path),
      })),
    ],
  };
}

/**
 * Renders a JSON-LD block. `<` is escaped so a title containing a tag can't
 * close the script early (Next's own JSON-LD guide does the same).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
