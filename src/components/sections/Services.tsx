import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Section, type SectionTone } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RegionPrice } from "@/components/pricing/RegionPrice";
import { RegionSwitch } from "@/components/pricing/RegionPricing";
import { packages } from "@/data/pricing";

/**
 * "What I build" — the packages as three large rows, so the work above becomes
 * something buyable: name, one outcome line, a "from" price, a link to the
 * detail on /services. The fourth, smaller row points at the engineering case
 * studies for the buyer who needs the backend too.
 *
 * Prices come straight from src/data/pricing.ts, in the visitor's region
 * (PKR in Pakistan, USD elsewhere); while one is still TODO_PRICE the row
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
          className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors"
        >
          Packages
          <ArrowUpRight size={14} />
        </Link>
      }
    >
      <ul className="border-border-strong divide-border border-y-2 divide-y-2">
        {packages.map((pkg, i) => {
          return (
            <li key={pkg.id}>
              <Reveal delay={Math.min(i * 0.06, 0.18)}>
                <Link
                  href={`/services#${pkg.id}`}
                  className="group hover:bg-plane-3 -mx-4 grid grid-cols-1 gap-4 px-4 py-8 transition-colors sm:-mx-6 sm:px-6 md:grid-cols-[1fr_auto] md:items-end md:gap-10 sm:py-10"
                >
                  <div>
                    <span className="text-accent font-mono text-xs font-bold tracking-[0.16em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-foreground mt-3 text-3xl leading-[1.05] font-bold tracking-tight transition-transform duration-300 ease-out group-hover:translate-x-2 sm:text-5xl">
                      {pkg.name}
                    </h3>
                    <p className="text-foreground-muted mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
                      {pkg.outcome}
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-8 md:flex-col md:items-end md:gap-5">
                    <dl className="flex gap-8 font-mono md:text-right">
                      <div>
                        <dt className="text-foreground-subtle text-[11px] tracking-[0.14em] uppercase">From</dt>
                        <dd className="text-foreground mt-1 text-lg font-bold">
                          <RegionPrice price={pkg.startingFrom} />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-foreground-subtle text-[11px] tracking-[0.14em] uppercase">Timeline</dt>
                        <dd className="text-foreground mt-1 text-lg font-bold">{pkg.timeline}</dd>
                      </div>
                    </dl>
                    <ArrowRight
                      size={22}
                      aria-hidden
                      className="text-accent shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>

      <RegionSwitch className="mt-6" />

      <Reveal delay={0.1}>
        <Link
          href="/work#engineering"
          className="group text-foreground-muted hover:text-foreground mt-8 inline-flex items-center gap-3 font-mono text-xs tracking-[0.12em] uppercase transition-colors"
        >
          <span aria-hidden className="bg-accent h-2 w-2" />
          Full-stack and AI under the hood
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </Section>
  );
}
