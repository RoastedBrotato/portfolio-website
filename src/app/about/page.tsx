import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { About, Stack, Wired } from "@/components/sections/About";
import { EngineeringRange } from "@/components/sections/EngineeringRange";
import { Experience } from "@/components/sections/Experience";
import { Writing } from "@/components/sections/Writing";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "A backend engineer who learned to make things move: the background, the full-stack and AI case studies, the experience and the stack behind the work.",
  path: "/about",
});

const elsewhere = [
  { label: "Lab", detail: "Experiments and AI-tool tests, rough edges included.", href: "/lab" },
  { label: "Blog", detail: "Notes from the work, the road, and the occasional yap.", href: "/blog" },
  { label: "Reviews", detail: "Worked with me? Drop your thoughts about me (or my work, haha).", href: "/reviews#write" },
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
        intro="A backend engineer who learned to make things move. Still the one who wires the CMS, the analytics and the backend, because that's the part that has to work."
      />
      <About />
      <Wired tone="plane-1" />
      <EngineeringRange />
      <Experience tone="plane-1" />
      <Stack />
      <Writing tone="plane-1" />

      <Section id="elsewhere" label="Elsewhere">
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

      <ContactCTA tone="plane-1" />
    </>
  );
}
