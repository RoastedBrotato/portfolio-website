import { cn } from "@/lib/utils";

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const doubled = [...items, ...items];

  return (
    <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className={cn("flex w-max shrink-0 animate-marquee items-center motion-reduce:animate-none", className)}>
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap pr-10">
            {item}
            <span aria-hidden className="text-accent">
              /
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
