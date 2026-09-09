"use client";

import { motion } from "framer-motion";
import { ExperienceItem } from "@/types";

// Marker sits centred on the 2px rule: half the 10px marker, minus half the rule.
const MARKER_OFFSET = "-left-[calc(2rem+4px)] sm:-left-[calc(2.5rem+4px)]";

export function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  return (
    <ol className="border-border-strong relative border-l-2 pl-8 sm:pl-10">
      {items.map((item, i) => (
        <motion.li
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
        </motion.li>
      ))}
    </ol>
  );
}
