import Image from "next/image";
import { cn } from "@/lib/utils";

type Variant = "ai" | "realtime" | "business";

const variantContent: Record<Variant, React.ReactNode> = {
  ai: (
    <div className="flex h-full flex-col justify-center gap-3 p-6 sm:p-10">
      <div className="flex flex-wrap gap-2">
        {["Audio", "Transcript", "Translation", "Embeddings"].map((label) => (
          <span
            key={label}
            className="border border-border-strong bg-background-elevated px-3 py-1 font-mono text-[11px] text-foreground-muted"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="mt-2 space-y-2">
        <div className="h-2 w-3/4 bg-foreground/10" />
        <div className="h-2 w-full bg-foreground/10" />
        <div className="h-2 w-5/6 bg-accent/40" />
      </div>
      <div className="mt-4 flex items-center gap-2 border border-border-strong bg-background-elevated p-3">
        <div className="h-6 w-6 shrink-0 bg-accent/70" />
        <div className="h-2 w-2/3 bg-foreground/15" />
      </div>
    </div>
  ),
  realtime: (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 sm:p-10">
      <div className="flex w-full items-center justify-between">
        {["API", "Queue", "Worker", "DB"].map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center border border-border-strong bg-background-elevated font-mono text-[10px] text-foreground-muted">
                {label}
              </div>
            </div>
            {i < 3 && <div className="mx-1.5 h-px w-6 bg-border-strong sm:w-10" />}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-accent">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping bg-accent opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 bg-accent" />
        </span>
        <span className="font-mono text-[11px]">real-time update pushed</span>
      </div>
    </div>
  ),
  business: (
    <div className="grid h-full grid-cols-2 gap-3 p-6 sm:p-10">
      <div className="col-span-2 flex items-end gap-1.5 border border-border-strong bg-background-elevated p-4">
        {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className={cn("w-full", i === 6 ? "bg-accent/70" : "bg-foreground/10")}
          />
        ))}
      </div>
      <div className="border border-border-strong bg-background-elevated p-4">
        <div className="h-2 w-1/2 bg-foreground/15" />
        <div className="mt-3 h-2 w-3/4 bg-foreground/10" />
      </div>
      <div className="border border-border-strong bg-background-elevated p-4">
        <div className="h-2 w-2/3 bg-foreground/15" />
        <div className="mt-3 h-2 w-1/2 bg-foreground/10" />
      </div>
    </div>
  ),
};

/**
 * The engineering media frame: a 2px rule around a #161616 plane, with a mono
 * caption bar underneath. Dark dashboard screenshots vanish against a black
 * page, so they sit inset on the lighter plane rather than edge to edge — and
 * there's no fake browser chrome; the caption says what it is.
 */
export function ProjectVisual({
  variant,
  image,
  title,
  caption,
}: {
  variant: Variant;
  image?: string;
  title: string;
  /** Right-hand side of the caption bar, e.g. the category or a year. */
  caption?: string;
}) {
  return (
    <figure className="group border-border-strong bg-plane-3 relative overflow-hidden border-2">
      <div className="p-3 sm:p-5">
        <div className="border-border aspect-[16/10] overflow-hidden border">
          {image ? (
            <Image
              src={image}
              alt={`${title} — product screenshot`}
              width={1600}
              height={1000}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="bg-grid h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
              {variantContent[variant]}
            </div>
          )}
        </div>
      </div>
      <figcaption className="border-border-strong text-foreground-subtle flex items-center justify-between gap-4 border-t-2 px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] uppercase">
        <span className="text-foreground flex min-w-0 items-center gap-2 font-bold">
          <span aria-hidden className="bg-accent h-1.5 w-1.5 shrink-0" />
          <span className="truncate">{title}</span>
        </span>
        {caption ? <span className="hidden truncate sm:block">{caption}</span> : null}
      </figcaption>
    </figure>
  );
}
