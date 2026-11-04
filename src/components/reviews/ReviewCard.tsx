import type { PublicReview } from "@/types";
import { cn } from "@/lib/utils";
import { relationshipLabel } from "@/data/reviews";
import { QuoteSticker, type StickerColour } from "@/components/reviews/QuoteSticker";

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

function formatMonth(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** The sticker colours, in the order cards take them. Red first: it's the wordmark's c. */
export const STICKER_COLOURS: readonly StickerColour[] = ["red", "purple", "lime", "yellow", "pink", "blue"];

/** A few degrees off square, alternating, so a row of cards reads as pinned up rather than laid out. */
export const TILTS = [-1.2, 1, -0.7, 0.9, -1, 0.6] as const;

/**
 * A review as a pinned card: a hairline frame on paper, tipped a degree or so,
 * with a quotation-mark sticker over its top-left corner. The card straightens
 * and the sticker swells under the pointer. `featured` sets the quote larger —
 * for the one card on the homepage that gets the wide column.
 *
 * The sticker hangs outside the frame, so whatever lays these out needs room
 * above the first row (the homepage grid adds it).
 */
export function ReviewCard({
  review,
  className,
  featured = false,
  index = 0,
}: {
  review: PublicReview;
  className?: string;
  featured?: boolean;
  /** Picks the sticker colour and the tilt, so neighbours differ. */
  index?: number;
}) {
  const subtitle = attribution(review);
  const relationship = relationshipLabel(review.relationship);
  const colour = STICKER_COLOURS[index % STICKER_COLOURS.length];
  const tilt = TILTS[index % TILTS.length];

  return (
    <figure
      style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
      className={cn(
        "group border-border-strong bg-background relative flex flex-col rounded-[var(--radius-lg)] border",
        "[transform:rotate(var(--tilt))] transition-transform duration-300 ease-out hover:[transform:rotate(0deg)]",
        featured ? "p-7 sm:p-9" : "p-6 sm:p-7",
        className,
      )}
    >
      <QuoteSticker
        colour={colour}
        className={cn(
          "absolute -top-5 -left-3 -rotate-6 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-12",
          featured ? "h-12 w-auto sm:h-14" : "h-9 w-auto sm:h-10",
        )}
      />

      {/* Context before the quote: who's talking, about what. Older reviews
          predate both fields, so either can be missing. */}
      {relationship || review.project ? (
        <p className="text-foreground-subtle mb-4 pl-10 text-sm sm:pl-12">
          {relationship ? <span className="text-accent font-bold">{relationship}</span> : null}
          {relationship && review.project ? " · " : null}
          {review.project ? <span>{review.project}</span> : null}
        </p>
      ) : null}

      <blockquote
        className={cn(
          "text-foreground flex-1 text-pretty",
          featured
            ? "font-display text-[clamp(1.3rem,1rem+1.15vw,1.9rem)] leading-[1.25] font-semibold tracking-[-0.015em]"
            : "text-base leading-relaxed",
        )}
      >
        {review.body}
      </blockquote>

      <figcaption className="border-border mt-6 flex items-center gap-3.5 border-t pt-5">
        <span
          aria-hidden
          className="bg-accent text-accent-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold tracking-[0.06em]"
        >
          {initials(review.name)}
        </span>
        <div className="min-w-0">
          <p className="text-foreground text-sm font-medium">{review.name}</p>
          {subtitle ? <p className="text-foreground-subtle mt-0.5 text-xs">{subtitle}</p> : null}
        </div>
        <time
          dateTime={new Date(review.createdAt).toISOString()}
          className="text-foreground-subtle ml-auto shrink-0 self-start font-mono text-xs"
        >
          {formatMonth(review.createdAt)}
        </time>
      </figcaption>
    </figure>
  );
}
