import type { PublicReview } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Initials for the monogram tile. Visitors don't upload photos — an open avatar
 * field on a public form is a moderation problem the rest of this feature avoids
 * — so the accent block stands in for one.
 */
function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const letters =
    parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];
  return letters.toUpperCase();
}

function attribution(review: PublicReview): string | null {
  if (review.role && review.company) return `${review.role}, ${review.company}`;
  return review.role ?? review.company ?? null;
}

/** Solid background on purpose: on the homepage the card is punched out of the marquee behind it. */
export function ReviewCard({ review, className }: { review: PublicReview; className?: string }) {
  const subtitle = attribution(review);

  return (
    <figure
      className={cn("border-border-strong bg-background brutal border-2 p-6 sm:p-7", className)}
    >
      <blockquote className="text-foreground text-base leading-relaxed">
        &ldquo;{review.body}&rdquo;
      </blockquote>

      <figcaption className="border-border mt-6 flex items-center gap-3.5 border-t pt-5">
        <span
          aria-hidden
          className="bg-accent text-accent-foreground flex h-10 w-10 shrink-0 items-center justify-center font-mono text-xs font-bold tracking-[0.06em]"
        >
          {initials(review.name)}
        </span>
        <div className="min-w-0">
          <p className="text-foreground font-mono text-sm font-bold tracking-[0.08em] uppercase">
            {review.name}
          </p>
          {subtitle ? <p className="text-foreground-subtle mt-0.5 text-xs">{subtitle}</p> : null}
        </div>
      </figcaption>
    </figure>
  );
}
