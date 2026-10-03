import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { WorkItem } from "@/types";
import { MediaPreview } from "@/components/work/MediaPreview";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors";

/** One "Selected work" card. `wide` is the lead slot, spanning both columns. */
export function WorkCard({ item, wide = false }: { item: WorkItem; wide?: boolean }) {
  // The title goes to the deepest thing there is: the write-up if one exists,
  // otherwise the live piece.
  const primary = item.caseStudy ?? item.href;
  const primaryIsExternal = !item.caseStudy && Boolean(item.href);

  const title = primary ? (
    primaryIsExternal ? (
      <a href={primary} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
        {item.title}
      </a>
    ) : (
      <Link href={primary} className="hover:text-accent transition-colors">
        {item.title}
      </Link>
    )
  ) : (
    item.title
  );

  return (
    <article className="group flex flex-col">
      <MediaPreview
        media={item.media}
        sizes={wide ? "(min-width: 1152px) 960px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
        // The lead slot runs full width; a 16:10 frame that wide would push its
        // own title below the fold, so it letterboxes a little from sm up.
        className={cn("brutal", wide && "sm:aspect-[2/1]")}
      />

      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
        {item.placeholder ? (
          <span className="bg-accent text-accent-foreground px-2 py-0.5 font-mono text-[11px] font-bold tracking-[0.14em] uppercase">
            Placeholder · dev only
          </span>
        ) : null}
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-accent font-mono text-xs font-bold tracking-[0.16em] uppercase"
          >
            {tag}
          </span>
        ))}
        {item.year ? (
          <span className="text-foreground-subtle font-mono text-xs tracking-[0.12em]">
            {item.year}
          </span>
        ) : null}
      </div>

      <h3
        className={cn(
          "font-display text-foreground mt-3 font-bold tracking-tight",
          wide ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
        )}
      >
        {title}
      </h3>
      <p className="text-foreground-muted mt-3 max-w-xl text-base leading-relaxed">
        {item.description}
      </p>

      {item.caseStudy || item.href ? (
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          {item.caseStudy ? (
            <Link
              href={item.caseStudy}
              className={cn(
                linkClass,
                "text-foreground decoration-accent hover:text-accent font-bold underline decoration-2 underline-offset-4",
              )}
            >
              Case study
              <ArrowUpRight size={15} />
            </Link>
          ) : null}
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(linkClass, "text-foreground-muted hover:text-foreground")}
            >
              View live
              <ExternalLink size={13} />
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
