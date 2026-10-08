"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { relationships } from "@/data/reviews";
import type { PublicReview } from "@/types";
import { cn } from "@/lib/utils";

const ALL = "all";

/**
 * The /reviews grid, with a filter by how each reviewer knows me. The chips
 * only appear once there's more than one kind to choose between — a filter
 * with a single option is just a label pretending to be a control.
 */
export function ReviewList({ reviews }: { reviews: PublicReview[] }) {
  const [filter, setFilter] = useState<string>(ALL);

  const present = relationships.filter((r) =>
    reviews.some((review) => review.relationship === r.value),
  );
  const shown = filter === ALL ? reviews : reviews.filter((r) => r.relationship === filter);

  const chip = (value: string, label: string, count: number) => (
    <button
      key={value}
      type="button"
      aria-pressed={filter === value}
      onClick={() => setFilter(value)}
      className={cn(
        "border-2 px-3.5 py-2 font-mono text-xs font-bold tracking-[0.12em] uppercase transition-colors",
        filter === value
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border-strong text-foreground-muted hover:text-foreground",
      )}
    >
      {label} <span className="opacity-70">({count})</span>
    </button>
  );

  return (
    <>
      {present.length > 1 ? (
        <div role="group" aria-label="Filter reviews" className="mb-8 flex flex-wrap gap-2">
          {chip(ALL, "All", reviews.length)}
          {present.map((r) =>
            chip(r.value, r.label, reviews.filter((review) => review.relationship === r.value).length),
          )}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {shown.map((review, i) => (
          // h-full on both so the two cards in a row share a height —
          // without it a short review leaves a ragged hole beside a long one.
          <Reveal key={review.id} delay={Math.min(i * 0.06, 0.24)} className="h-full">
            <ReviewCard review={review} className="h-full" />
          </Reveal>
        ))}
      </div>
    </>
  );
}
