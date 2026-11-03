import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, type SectionTone } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { getPublishedReviews } from "@/lib/reviews";

/**
 * Up to three published reviews beside the prices, clients first. Renders
 * nothing if there are none, so the homepage never shows an empty proof
 * section; approving a form submission revalidates "/" and it appears.
 */
export async function Proof({ index, tone }: { index?: number; tone?: SectionTone }) {
  const reviews = await getPublishedReviews();
  if (reviews.length === 0) return null;

  const rank = (relationship?: string) =>
    relationship === "client" ? 0 : relationship === "collaborator" ? 1 : 2;
  const shown = [...reviews].sort((a, b) => rank(a.relationship) - rank(b.relationship)).slice(0, 3);

  return (
    <Section
      id="proof"
      label="Clients"
      index={index}
      tone={tone}
      aside={
        <Link
          href="/reviews"
          className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          All reviews
          <ArrowRight size={14} />
        </Link>
      }
    >
      <Reveal>
        <h2 className="font-display text-h2 text-foreground max-w-[20ch]">
          What it&apos;s like to work with me, from people who have.
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {shown.map((review) => (
            <li key={review.id} className="flex">
              <ReviewCard review={review} className="w-full" />
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
