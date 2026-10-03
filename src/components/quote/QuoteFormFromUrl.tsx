"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QuoteForm, type QuotePlacement } from "@/components/quote/QuoteForm";
import { projectTypes } from "@/data/pricing";

function FromParams({ placement }: { placement: QuotePlacement }) {
  const requested = useSearchParams().get("package");
  // Only preselect values that exist; anything else falls back to "Choose one".
  const preselect = projectTypes.find((type) => type.value === requested)?.value;
  return <QuoteForm placement={placement} defaultProjectType={preselect} />;
}

/**
 * QuoteForm with the project type preselected from `?package=<id>` — which is
 * how every pricing card links here.
 *
 * Reading the query on the client, behind Suspense, keeps /quote prerendered:
 * the HTML ships with the plain form (the fallback) and the preselect is applied
 * on hydration, before anyone has typed anything into it.
 */
export function QuoteFormFromUrl({ placement }: { placement: QuotePlacement }) {
  return (
    <Suspense fallback={<QuoteForm placement={placement} />}>
      <FromParams placement={placement} />
    </Suspense>
  );
}
