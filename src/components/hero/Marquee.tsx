import { cn } from "@/lib/utils";

/**
 * The strip under the hero: a few facts on repeat, like a ticker. The row is
 * rendered twice and slid by half its width, so the loop is seamless at any
 * viewport. Decorative; the same facts are in the footer in plain text.
 */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className="font-display text-foreground text-[clamp(1.5rem,2.6vw,2.25rem)] whitespace-nowrap">
            {item}
          </span>
          <span aria-hidden className="text-accent text-[1.1em]">
            ✦
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div aria-hidden className={cn("overflow-hidden border-y py-5", className)}>
      <div className="marquee-track flex w-max items-center gap-10 pr-10">
        {row}
        {row}
      </div>
    </div>
  );
}
