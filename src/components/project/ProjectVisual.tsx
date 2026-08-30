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
            className="rounded-full border border-border-strong bg-background-elevated px-3 py-1 font-mono text-[11px] text-foreground-muted"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="mt-2 space-y-2">
        <div className="h-2 w-3/4 rounded-full bg-white/10" />
        <div className="h-2 w-full rounded-full bg-white/10" />
        <div className="h-2 w-5/6 rounded-full bg-accent/40" />
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border-strong bg-background-elevated p-3">
        <div className="h-6 w-6 shrink-0 rounded-full bg-accent/70" />
        <div className="h-2 w-2/3 rounded-full bg-white/15" />
      </div>
    </div>
  ),
  realtime: (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 sm:p-10">
      <div className="flex w-full items-center justify-between">
        {["API", "Queue", "Worker", "DB"].map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-strong bg-background-elevated font-mono text-[10px] text-foreground-muted">
                {label}
              </div>
            </div>
            {i < 3 && <div className="mx-1.5 h-px w-6 bg-border-strong sm:w-10" />}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-accent">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        <span className="font-mono text-[11px]">real-time update pushed</span>
      </div>
    </div>
  ),
  business: (
    <div className="grid h-full grid-cols-2 gap-3 p-6 sm:p-10">
      <div className="col-span-2 flex items-end gap-1.5 rounded-xl border border-border-strong bg-background-elevated p-4">
        {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className={cn("w-full rounded-sm", i === 6 ? "bg-accent/70" : "bg-white/10")}
          />
        ))}
      </div>
      <div className="rounded-xl border border-border-strong bg-background-elevated p-4">
        <div className="h-2 w-1/2 rounded-full bg-white/15" />
        <div className="mt-3 h-2 w-3/4 rounded-full bg-white/10" />
      </div>
      <div className="rounded-xl border border-border-strong bg-background-elevated p-4">
        <div className="h-2 w-2/3 rounded-full bg-white/15" />
        <div className="mt-3 h-2 w-1/2 rounded-full bg-white/10" />
      </div>
    </div>
  ),
};

export function ProjectVisual({
  variant,
  image,
  title,
}: {
  variant: Variant;
  image?: string;
  title: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-background-elevated shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
      </div>
      <div className="aspect-[16/10] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={`${title} — product screenshot`}
            width={1600}
            height={1000}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-grid transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            {variantContent[variant]}
          </div>
        )}
      </div>
    </div>
  );
}
