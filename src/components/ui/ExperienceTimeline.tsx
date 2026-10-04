"use client";

import { m } from "framer-motion";
import { Plus } from "lucide-react";
import { ExperienceItem } from "@/types";

// Marker sits centred on the 2px rule: half the 10px marker, minus half the rule.
const MARKER_OFFSET = "-left-[calc(2rem+4px)] sm:-left-[calc(2.5rem+4px)]";

export function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  return (
    <ol className="border-border-strong relative border-l-2 pl-8 sm:pl-10">
      {items.map((item, i) => (
        <m.li
          key={`${item.company}-${item.role}`}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="relative pb-12 last:pb-0"
        >
          <span
            className={`absolute top-2 h-2.5 w-2.5 border-2 ${MARKER_OFFSET} ${
              item.current ? "border-accent bg-accent" : "border-border-strong bg-background"
            }`}
          />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <h3 className="text-foreground text-lg font-bold tracking-tight">
              {item.role}{" "}
              <span className="text-foreground-muted font-normal">· {item.company}</span>
            </h3>
            <span className="text-foreground-subtle shrink-0 font-mono text-xs tracking-[0.08em] uppercase sm:text-right">
              {item.startDate} — {item.endDate}
            </span>
          </div>
          <p className="text-foreground-subtle mt-1.5 font-mono text-xs tracking-[0.08em] uppercase">
            {item.location}
          </p>
          {/* Collapsed by default so the page reads as a timeline, not a CV;
              <details> keeps every bullet in the HTML and keyboard-operable. */}
          <details open={item.current} className="group mt-4">
            <summary className="text-foreground-muted hover:text-foreground inline-flex cursor-pointer list-none items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase transition-colors [&::-webkit-details-marker]:hidden">
              <Plus
                size={14}
                aria-hidden
                className="text-accent transition-transform duration-200 group-open:rotate-45"
              />
              {item.accomplishments.length} highlights
            </summary>
            <ul className="mt-5 space-y-2.5">
              {item.accomplishments.map((point) => (
                <li
                  key={point}
                  className="text-foreground-muted flex items-start gap-3 text-sm leading-relaxed"
                >
                  <span className="bg-accent mt-[0.5em] h-1.5 w-1.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </details>
        </m.li>
      ))}
    </ol>
  );
}
