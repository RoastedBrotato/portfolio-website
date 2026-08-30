"use client";

import { motion } from "framer-motion";
import { ExperienceItem } from "@/types";

export function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  return (
    <ol className="relative border-l border-border pl-8 sm:pl-10">
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
            className={`absolute -left-[calc(2rem+4.5px)] top-1.5 h-2.5 w-2.5 rounded-full border-2 sm:-left-[calc(2.5rem+4.5px)] ${
              item.current ? "border-accent bg-accent" : "border-border-strong bg-background"
            }`}
          />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <h3 className="text-lg font-semibold text-foreground">
              {item.role} <span className="text-foreground-muted">· {item.company}</span>
            </h3>
            <span className="font-mono text-xs text-foreground-subtle sm:text-right">
              {item.startDate} — {item.endDate}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground-subtle">{item.location}</p>
          <ul className="mt-4 space-y-2">
            {item.accomplishments.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground-muted">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground-subtle" />
                {point}
              </li>
            ))}
          </ul>
        </motion.li>
      ))}
    </ol>
  );
}
