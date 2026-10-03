import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * One pricing card. Takes display-ready strings rather than a Package so the
 * custom-quote card, which has no price or timeline, can use the same shell.
 */
export function PackageCard({
  name,
  outcome,
  price,
  timeline,
  includes,
  href,
  cta,
  highlighted = false,
  footer,
}: {
  name: string;
  outcome: string;
  /** Formatted "starting from" amount; null renders "Quote on request". Omit for no price row. */
  price?: string | null;
  timeline?: string;
  includes: string[];
  href: string;
  cta: string;
  highlighted?: boolean;
  /** Extra content under the CTA, e.g. a Book a call button. */
  footer?: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        "bg-background flex h-full flex-col border-2 p-6 sm:p-8",
        highlighted ? "border-accent brutal" : "border-border-strong",
      )}
    >
      <h3 className="font-display text-foreground text-2xl font-bold tracking-tight">{name}</h3>
      <p className="text-foreground-muted mt-3 text-base leading-relaxed">{outcome}</p>

      {price !== undefined || timeline ? (
        <dl className="border-border mt-6 grid grid-cols-2 gap-4 border-y-2 py-5">
          {price !== undefined ? (
            <div>
              <dt className="text-foreground-subtle font-mono text-[11px] tracking-[0.14em] uppercase">
                Starting from
              </dt>
              <dd className="text-foreground mt-1.5 font-mono text-xl font-bold">
                {price ?? <span className="text-base">Quote on request</span>}
              </dd>
            </div>
          ) : null}
          {timeline ? (
            <div>
              <dt className="text-foreground-subtle font-mono text-[11px] tracking-[0.14em] uppercase">
                Typical timeline
              </dt>
              <dd className="text-foreground mt-1.5 font-mono text-xl font-bold">{timeline}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      <ul className="mt-6 flex flex-col gap-2.5">
        {includes.map((item) => (
          <li
            key={item}
            className="text-foreground-muted flex items-start gap-3 text-sm leading-relaxed"
          >
            <span aria-hidden className="bg-accent mt-[0.55em] h-1.5 w-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      {/* mt-auto pins the CTA to the bottom, so cards in a row line up. */}
      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button href={href} variant={highlighted ? "primary" : "secondary"} className="w-full">
          {cta}
          <ArrowRight size={15} />
        </Button>
        {footer}
      </div>
    </article>
  );
}
