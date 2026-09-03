import { cn } from "@/lib/utils";
import { RevealText } from "@/components/ui/RevealText";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </span>
      )}
      <RevealText
        as="h2"
        trigger="inView"
        className="font-display text-h2 font-medium tracking-tight text-foreground"
      >
        {title}
      </RevealText>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
