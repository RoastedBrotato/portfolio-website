import { ExternalLink } from "lucide-react";
import type { ProofItem } from "@/types";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/CountUp";

/** Same shell as ReviewCard, so the proof strip and the reviews read as one slot. */
export function ProofCard({ item, className }: { item: ProofItem; className?: string }) {
  return (
    <div
      className={cn(
        "border-border-strong bg-background brutal flex flex-col border-2 p-6 sm:p-7",
        className,
      )}
    >
      {item.placeholder ? (
        <span className="bg-accent text-accent-foreground mb-4 self-start px-2 py-0.5 font-mono text-[11px] font-bold tracking-[0.14em] uppercase">
          Placeholder · dev only
        </span>
      ) : null}
      <p className="font-display text-foreground text-3xl font-bold tracking-tight">
        <CountUp value={item.stat} />
      </p>
      <p className="text-foreground-muted mt-3 text-base leading-relaxed">{item.detail}</p>
      {item.href ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border text-foreground hover:text-accent mt-auto inline-flex items-center gap-1.5 border-t pt-5 font-mono text-xs font-bold tracking-[0.12em] uppercase transition-colors"
        >
          {item.linkLabel ?? "View"}
          <ExternalLink size={13} />
        </a>
      ) : null}
    </div>
  );
}
