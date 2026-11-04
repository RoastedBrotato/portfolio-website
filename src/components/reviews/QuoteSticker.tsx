import { cn } from "@/lib/utils";

/*
 * A closing quotation mark as a thing: two fat commas in one of the pop
 * colours, ink outline, gloss on the head — the hero wordmark's objects,
 * stuck to the corner of a review card like a sticker. Decoration, so it
 * is drawn from the pop palette and hidden from screen readers.
 */
export type StickerColour = "red" | "purple" | "yellow" | "pink" | "lime" | "blue";

const COMMA =
  "M26 2a24 24 0 0 1 24 24c0 24-14 40-38 50 10-13 15-24 13-33A24 24 0 0 1 26 2z";

export function QuoteSticker({ colour, className }: { colour: StickerColour; className?: string }) {
  return (
    <svg
      viewBox="0 0 106 80"
      className={cn("overflow-visible", className)}
      aria-hidden
      fill={`var(--pop-${colour})`}
      stroke="var(--foreground)"
      strokeWidth="5"
      strokeLinejoin="round"
    >
      {[0, 54].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <path d={COMMA} />
          <path
            d="M14 20c3-6 8-10 14-11"
            fill="none"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
}
