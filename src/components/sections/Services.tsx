import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, type SectionTone } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RegionPrice } from "@/components/pricing/RegionPrice";
import { RegionSwitch } from "@/components/pricing/RegionPricing";
import { packages } from "@/data/pricing";

/**
 * "What I build" — the three packages side by side, each with its outcome,
 * a "from" price and a timeline. Half a screen: enough to make the work
 * above buyable, not a pricing page (how a project runs is on /services).
 *
 * Prices come straight from src/data/pricing.ts, in the visitor's region
 * (PKR in Pakistan, USD elsewhere); while one is still TODO_PRICE the card
 * reads "Quote on request" in a build, same as /services.
 */
export function Services({ index, tone }: { index?: number; tone?: SectionTone }) {
  return (
    <Section
      id="services"
      label="What I build"
      index={index}
      tone={tone}
      aside={
        <Link
          href="/services"
          className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          Full packages
          <ArrowRight size={14} />
        </Link>
      }
    >
      <Reveal>
        <h2 className="font-display text-h2 text-foreground max-w-[20ch]">
          Three places to start. One fixed price, in writing, before anything begins.
        </h2>
      </Reveal>

      <Reveal delay={0.08}>
        <ul className="border-border bg-border mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] border sm:grid-cols-3">
          {packages.map((pkg) => (
            <li key={pkg.id} className="bg-background flex flex-col p-6 sm:p-7">
              <h3 className="text-foreground text-lg font-medium tracking-[-0.01em]">{pkg.name}</h3>
              <p className="text-foreground-muted mt-2 text-sm leading-relaxed">{pkg.outcome}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-foreground-subtle text-xs">From</dt>
                  <dd className="text-foreground mt-1 font-mono font-medium tabular-nums">
                    <RegionPrice price={pkg.startingFrom} />
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-subtle text-xs">Timeline</dt>
                  <dd className="text-foreground mt-1 font-mono font-medium tabular-nums">{pkg.timeline}</dd>
                </div>
              </dl>
              <Link
                href={`/services#${pkg.id}`}
                className="text-foreground-muted hover:text-foreground mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium transition-colors"
              >
                What&apos;s included
                <ArrowRight size={14} />
              </Link>
            </li>
          ))}
        </ul>
        <RegionSwitch className="mt-4" />
      </Reveal>

      <Reveal delay={0.16}>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Button href="/quote" size="lg">
            Start a project
            <ArrowRight size={18} />
          </Button>
          <p className="text-foreground-subtle text-sm">
            Need a web app, an AI feature or a backend?{" "}
            <Link href="/work#engineering" className="text-foreground-muted hover:text-foreground underline decoration-[var(--border-strong)] underline-offset-4 transition-colors">
              That&apos;s covered too.
            </Link>
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
