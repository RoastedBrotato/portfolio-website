import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border-2 border-border-strong px-2.5 py-1 font-mono text-xs text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
