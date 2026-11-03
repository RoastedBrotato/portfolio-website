import { cn } from "@/lib/utils";

/** A small tag chip: hairline, rounded, quiet. */
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "border-border-strong text-foreground-muted inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}
