import { brand, mark } from "@/data/brand";
import { siteConfig } from "@/data/config";
import { cn } from "@/lib/utils";

/*
 * The mark and the lockup. See src/data/brand.ts for what the mark is and
 * why; this file only draws it.
 *
 *   ink    cobalt on an ink outline — the default, for paper and the planes.
 *   paper  paper on an ink outline — for cobalt, ink and the pop colours.
 *   mono   a single currentColor stroke, no outline — for places that are
 *          already one colour (a loading state, a tiny inline use).
 *
 * Sized by height: `h-6 w-auto` and the width follows the 120:88 box.
 */
type Tone = "ink" | "paper" | "mono";

export function Mark({
  className,
  tone = "ink",
  label,
  style,
}: {
  className?: string;
  tone?: Tone;
  /** Set when the mark stands alone; in the lockup the name is the text. */
  label?: string;
  style?: React.CSSProperties;
}) {
  const colour =
    tone === "paper" ? "var(--background)" : tone === "mono" ? "currentColor" : "var(--accent)";

  return (
    <svg
      viewBox={mark.viewBox}
      className={cn("overflow-visible", className)}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {tone !== "mono" && <path d={mark.path} stroke="var(--foreground)" strokeWidth={mark.outline} />}
      <path d={mark.path} stroke={colour} strokeWidth={tone === "mono" ? mark.outline - 4 : mark.stroke} />
      {tone === "ink" && <path d={mark.gloss} stroke={brand.gloss} strokeWidth={mark.glossWidth} />}
    </svg>
  );
}

/**
 * The horizontal lockup: the mark beside the name in the display face. Both
 * are sized in em, so one font-size on the parent sets the whole thing
 * (the navbar runs it at 17px, the footer at 16px).
 */
export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-[0.5em]", className)}>
      <Mark className={cn("h-[1.3em] w-auto shrink-0", markClassName)} />
      <span className="wordmark">{siteConfig.name}</span>
    </span>
  );
}
