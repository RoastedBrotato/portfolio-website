import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { PackageCard } from "@/components/pricing/PackageCard";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { TrackView } from "@/components/TrackView";
import { RegionPrice } from "@/components/pricing/RegionPrice";
import { RegionSwitch } from "@/components/pricing/RegionPricing";
import { customQuote, faqs, packages, processSteps } from "@/data/pricing";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Packages for immersive landing pages, brand websites and interactive 3D product showcases — what's included, typical timelines and starting prices.",
  path: "/services",
});

/*
 * Formerly /pricing, which now redirects here (next.config.ts). The analytics
 * event keeps its old name so the numbers stay continuous across the rename.
 * No embedded form: every CTA goes to /quote, the one form on the site.
 */
export default function ServicesPage() {
  return (
    <>
      <TrackView event="pricing_view" />

      <PageHeader
        label="Services"
        title="Packages"
        intro="Three starting points and a custom option. Every project gets a fixed price in writing before anything starts — these are where the conversation begins."
      >
        <RegionSwitch className="mt-6" />
        <div className="mt-8">
          <BookCallButton placement="pricing-header" size="md" />
        </div>
      </PageHeader>

      <Section id="packages" label="Starting points">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={Math.min((i % 2) * 0.08, 0.16)} className="h-full">
              <PackageCard
                id={pkg.id}
                name={pkg.name}
                outcome={pkg.outcome}
                price={<RegionPrice price={pkg.startingFrom} />}
                timeline={pkg.timeline}
                includes={pkg.includes}
                href={`/quote?package=${pkg.id}`}
                cta="Request a quote"
                highlighted={pkg.highlighted}
              />
            </Reveal>
          ))}
          <Reveal delay={0.08} className="h-full">
            <PackageCard
              id={customQuote.id}
              name={customQuote.name}
              outcome={customQuote.outcome}
              includes={customQuote.includes}
              href={`/quote?package=${customQuote.id}`}
              cta="Describe your project"
              footer={<BookCallButton placement="pricing-custom" size="md" className="w-full" />}
            />
          </Reveal>
        </div>
      </Section>

      <Section id="process" label="How it works" labelAs="p" tone="plane-1">
        <h2 className="font-display text-h2 text-foreground max-w-2xl font-bold tracking-tight">
          How a project works
        </h2>
        <ol className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
          {processSteps.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={Math.min(i * 0.06, 0.18)}>
                <span className="text-accent font-mono text-sm font-bold tracking-[0.16em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="border-border-strong text-foreground mt-3 border-t-2 pt-4 font-mono text-sm font-bold tracking-[0.12em] uppercase">
                  {step.title}
                </h3>
                <p className="text-foreground-muted mt-3 text-sm leading-relaxed">
                  {step.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="faq" label="FAQ">
        {/* <details> keeps every answer in the HTML and keyboard-operable with no JS. */}
        <div className="divide-border border-border-strong max-w-3xl divide-y-2 border-y-2">
          {faqs.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="text-foreground hover:text-accent flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-bold transition-colors [&::-webkit-details-marker]:hidden">
                {faq.question}
                <Plus
                  size={18}
                  aria-hidden
                  className="text-accent shrink-0 transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="text-foreground-muted pb-6 text-sm leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <ContactCTA tone="plane-1" />
    </>
  );
}
