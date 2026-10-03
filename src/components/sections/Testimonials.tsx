import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ScrollMarquee } from "@/components/reviews/ScrollMarquee";
import { ProofCard } from "@/components/reviews/ProofCard";
import { getProof } from "@/data/proof";
import { getApprovedReviews, reviewsEnabled } from "@/lib/reviews";

/** The two newest approved reviews, laid out either side of the CTA. */
const MAX_REVIEWS = 2;

/*
 * Built from Container rather than <Section> because the marquee has to run the
 * full width of the viewport, which a Section's container would clip. The rail
 * grid is repeated by hand so the label and copy still line up with every other
 * section's left edge.
 *
 * Two modes, chosen automatically: approved reviews when there are any, and
 * until then the proof strip from src/data/proof.ts — so the slot never reads
 * "no reviews yet" to someone deciding whether to get in touch.
 */
export async function Testimonials() {
  const enabled = reviewsEnabled();
  const reviews = enabled ? await getApprovedReviews(MAX_REVIEWS) : [];
  const proof = reviews.length === 0 ? getProof() : [];

  if (reviews.length === 0 && proof.length === 0) return null;

  const cta = (
    <div key="cta" className="flex h-full items-center justify-center">
      <Button href="/reviews#write" size="lg">
        Write a review
        <ArrowRight size={16} />
      </Button>
    </div>
  );

  // With two reviews the CTA sits between them, the way the cards frame the
  // button in the reference layout. With fewer, it just follows them. Proof
  // mode drops the big CTA for the small link under the intro — a visitor
  // weighing up a quote shouldn't be asked for a review first.
  const cells =
    reviews.length === 0
      ? proof.map((item) => <ProofCard key={item.stat} item={item} className="h-full" />)
      : reviews.length === MAX_REVIEWS
        ? [
            <ReviewCard key={reviews[0].id} review={reviews[0]} className="h-full" />,
            cta,
            <ReviewCard key={reviews[1].id} review={reviews[1]} className="h-full" />,
          ]
        : [
            ...reviews.map((review) => (
              <ReviewCard key={review.id} review={review} className="h-full" />
            )),
            cta,
          ];

  const columns =
    cells.length >= 3 ? "lg:grid-cols-3" : cells.length === 2 ? "lg:grid-cols-2" : "lg:max-w-sm";

  return (
    <section
      id="reviews"
      className="border-border-strong scroll-mt-20 overflow-hidden border-t-2 py-20 sm:py-28"
    >
      <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
        <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-start lg:justify-start lg:gap-5">
          <SectionLabel>{reviews.length === 0 ? "Proof" : "Reviews"}</SectionLabel>
          {/* Nothing to list yet in proof mode, so no link to an empty page. */}
          {reviews.length > 0 ? (
            <Link
              href="/reviews"
              className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors"
            >
              All reviews
              <ArrowUpRight size={14} />
            </Link>
          ) : null}
        </div>

        <div className="min-w-0">
          <Reveal>
            {reviews.length === 0 ? (
              <>
                <p className="text-foreground-muted max-w-xl text-lg leading-relaxed">
                  Shipped, live and in daily use — not just a showreel.
                </p>
                {enabled ? (
                  <Link
                    href="/reviews#write"
                    className="text-foreground-subtle hover:text-foreground mt-4 inline-flex items-center gap-1.5 text-sm transition-colors"
                  >
                    Worked with me? Leave a review
                    <ArrowRight size={14} />
                  </Link>
                ) : null}
              </>
            ) : (
              <p className="text-foreground-muted max-w-xl text-lg leading-relaxed">
                What clients and collaborators say about working with me. If we&apos;ve worked
                together, add yours.
              </p>
            )}
          </Reveal>
        </div>
      </Container>

      {/* On lg the marquee is pulled behind the cards; below that it stays in
          flow above them, since overlapping type and text at phone width is
          just noise. */}
      <div className="relative mt-14 lg:mt-16 lg:flex lg:min-h-[22rem] lg:items-center">
        <ScrollMarquee
          className="lg:absolute lg:inset-x-0 lg:top-1/2 lg:-translate-y-1/2"
          phrases={reviews.length === 0 ? ["In production", "Shipped"] : undefined}
        />

        <Container className={`relative mt-10 grid grid-cols-1 gap-8 lg:mt-0 ${columns}`}>
          {cells.map((cell, i) => (
            <Reveal key={i} delay={Math.min(i * 0.08, 0.16)} className="h-full">
              {cell}
            </Reveal>
          ))}
        </Container>
      </div>
    </section>
  );
}
