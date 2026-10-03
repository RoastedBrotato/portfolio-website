import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { QuoteFormFromUrl } from "@/components/quote/QuoteFormFromUrl";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = {
  title: "Get a quote",
  description:
    "Tell me about your landing page, brand site or 3D product showcase — I reply within one working day with questions or a quote.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <PageHeader
        label="Quote"
        title="Get a quote"
        intro="A few details about what you're making. I'll reply within one working day — with questions if I have them, a ballpark if I don't."
        aside={
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-foreground-muted hover:text-foreground font-mono text-xs tracking-[0.08em] break-all transition-colors"
          >
            {siteConfig.email}
          </a>
        }
      >
        {siteConfig.bookingUrl ? (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <p className="text-foreground-subtle text-sm">Rather talk it through?</p>
            <BookCallButton placement="quote-page" size="md" />
          </div>
        ) : null}
      </PageHeader>

      <Container className="grid grid-cols-1 gap-8 py-20 sm:py-28 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
        <div aria-hidden />
        <div className="min-w-0">
          <QuoteFormFromUrl placement="quote-page" />
        </div>
      </Container>
    </>
  );
}
