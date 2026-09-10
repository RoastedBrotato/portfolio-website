import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/Section";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { getApprovedReviews, reviewsEnabled } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What clients and collaborators say about working with me — and a place to add yours.",
};

/*
 * On-demand revalidation from the admin actions is what normally refreshes this
 * page. The hourly window is a safety net: if a revalidation is ever missed, an
 * approved review still surfaces on its own instead of waiting for a deploy.
 */
export const revalidate = 3600;

export default async function ReviewsPage() {
  const enabled = reviewsEnabled();
  const reviews = enabled ? await getApprovedReviews() : [];

  return (
    <>
      <header className="border-border-strong relative overflow-hidden border-b-2">
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
        />
        <Container className="relative grid grid-cols-1 gap-8 py-20 sm:py-28 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
          <div className="flex flex-col items-start gap-5">
            <SectionLabel as="p">Reviews</SectionLabel>
            {reviews.length > 0 ? (
              <p className="text-foreground-subtle font-mono text-xs tracking-[0.12em] uppercase">
                {reviews.length} published
              </p>
            ) : null}
          </div>

          <div className="min-w-0">
            <RevealText
              as="h1"
              trigger="mount"
              className="font-display text-h1 text-foreground max-w-2xl leading-[1.05] font-bold tracking-tight"
            >
              Reviews
            </RevealText>
            <p className="text-foreground-muted mt-6 max-w-xl text-lg leading-relaxed">
              Everything clients and collaborators have said, unedited. If we&apos;ve worked
              together, add yours at the bottom.
            </p>
          </div>
        </Container>
      </header>

      <Container className="grid grid-cols-1 gap-8 py-20 sm:py-28 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
        <div aria-hidden />
        <div className="min-w-0">
          {reviews.length === 0 ? (
            <p className="text-foreground-muted">
              Nothing published yet — the form below is open if you&apos;d like to be first.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {reviews.map((review, i) => (
                <Reveal key={review.id} delay={Math.min(i * 0.06, 0.24)}>
                  <ReviewCard review={review} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Container>

      <section id="write" className="border-border-strong scroll-mt-20 border-t-2 py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
          <div className="flex flex-col items-start gap-5">
            <SectionLabel>Leave one</SectionLabel>
          </div>

          <div className="min-w-0">
            {enabled ? (
              <ReviewForm />
            ) : (
              <p className="text-foreground-muted max-w-xl">
                The review form is offline right now. Email me instead and I&apos;ll add it myself.
              </p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
