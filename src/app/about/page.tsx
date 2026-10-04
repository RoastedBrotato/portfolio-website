import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { About, Stack } from "@/components/sections/About";
import { EngineeringRange } from "@/components/sections/EngineeringRange";
import { Experience } from "@/components/sections/Experience";
import { Writing } from "@/components/sections/Writing";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Backend engineer turned creative developer — the background, the full-stack and AI case studies, the experience and the stack behind the work.",
  path: "/about",
});

const elsewhere = [
  { label: "Lab", detail: "Experiments and AI-tool tests, rough edges included.", href: "/lab" },
  { label: "Blog", detail: "Notes from the road and from the work.", href: "/blog" },
  { label: "Reviews", detail: "Worked with me? Leave a review.", href: "/reviews#write" },
];

/*
 * Everything the homepage deliberately leaves out: the bio, the engineering
 * case studies, the CV and the writing. This is where recruiters and the
 * curious go, so it can be long.
 */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="About"
        title={siteConfig.name}
        intro="Backend engineer first, creative developer now — and still the person who wires the CMS, the analytics and the backend when a project needs them."
      />
      <About />
      <EngineeringRange tone="plane-1" />
      <Experience />
      <Stack tone="plane-1" />
      <Writing />

      <Section id="elsewhere" label="Elsewhere" tone="plane-1">
        <ul className="divide-border border-border-strong max-w-2xl divide-y border-y-2">
          {elsewhere.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-center justify-between gap-6 py-5"
              >
                <span>
                  <span className="text-foreground group-hover:text-accent block font-mono text-sm font-bold tracking-[0.12em] uppercase transition-colors">
                    {item.label}
                  </span>
                  <span className="text-foreground-muted mt-1 block text-sm">{item.detail}</span>
                </span>
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="text-accent shrink-0 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <ContactCTA tone="plane-2" />
    </>
  );
}
