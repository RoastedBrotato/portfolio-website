import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/data/services";

export function Services() {
  return (
    <Section
      id="services"
      label="Hire me for"
      aside={
        <Link
          href="/pricing"
          className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors"
        >
          Packages
          <ArrowUpRight size={14} />
        </Link>
      }
    >
      <Reveal>
        <dl className="max-w-2xl divide-y divide-border">
          {services.map((service) => (
            <div key={service.title} className="py-6 first:pt-0 last:pb-0">
              <dt className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-foreground">
                {service.title}
              </dt>
              <dd className="mt-2.5 text-sm leading-relaxed text-foreground-muted">
                {service.description}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
