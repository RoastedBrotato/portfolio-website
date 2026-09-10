import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/Section";
import { adminConfigured, isAdmin } from "@/lib/adminAuth";
import { getApprovedReviews, getPendingReviews, reviewsEnabled } from "@/lib/reviews";
import type { PublicReview, Review } from "@/types";
import { AdminLogin } from "./AdminLogin";
import { approve, logout, remove, unapprove } from "./actions";

/*
 * Never prerender. Without this the page's env checks can short-circuit before
 * `cookies()` is ever called at build time, and Next happily bakes a static
 * shell for a route whose whole job is to be per-session.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Review moderation",
  // Belt and braces with the robots.ts disallow — this page must never be indexed.
  robots: { index: false, follow: false },
};

function formatWhen(ms: number): string {
  return new Date(ms).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Each button is its own form posting a bound Server Action, so moderation works
 * without any client-side JS on this page and every click re-checks the session
 * server-side.
 */
function ActionButton({
  action,
  id,
  label,
  tone = "default",
}: {
  action: (id: string) => Promise<void>;
  id: string;
  label: string;
  tone?: "default" | "danger";
}) {
  return (
    <form action={action.bind(null, id)}>
      <button
        type="submit"
        className={`border-2 px-3 py-1.5 font-mono text-xs font-bold tracking-[0.12em] uppercase transition-colors ${
          tone === "danger"
            ? "border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            : "border-border-strong text-foreground hover:bg-foreground hover:text-background"
        }`}
      >
        {label}
      </button>
    </form>
  );
}

function ModerationRow({
  review,
  children,
}: {
  review: Review | PublicReview;
  children: React.ReactNode;
}) {
  const email = "email" in review ? review.email : undefined;

  return (
    <li className="border-border-strong border-2 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-foreground font-mono text-sm font-bold tracking-[0.08em] uppercase">
          {review.name}
          {review.role || review.company ? (
            <span className="text-foreground-subtle ml-2 font-normal normal-case">
              {[review.role, review.company].filter(Boolean).join(", ")}
            </span>
          ) : null}
        </p>
        <p className="text-foreground-subtle font-mono text-xs">{formatWhen(review.createdAt)}</p>
      </div>

      <p className="text-foreground-muted mt-3 text-sm leading-relaxed">{review.body}</p>

      {email ? (
        <p className="text-foreground-subtle mt-3 font-mono text-xs">
          <a href={`mailto:${email}`} className="hover:text-foreground transition-colors">
            {email}
          </a>
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">{children}</div>
    </li>
  );
}

export default async function AdminReviewsPage() {
  if (!adminConfigured() || !reviewsEnabled()) {
    return (
      <Container className="py-20 sm:py-28">
        <SectionLabel>Moderation</SectionLabel>
        <p className="text-foreground-muted mt-6 max-w-xl">
          Set <code className="text-foreground">REVIEWS_ADMIN_TOKEN</code>,{" "}
          <code className="text-foreground">UPSTASH_REDIS_REST_URL</code> and{" "}
          <code className="text-foreground">UPSTASH_REDIS_REST_TOKEN</code> in the environment to
          use this page.
        </p>
      </Container>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Container className="py-20 sm:py-28">
        <SectionLabel>Moderation</SectionLabel>
        <p className="text-foreground-muted mt-6 mb-8 max-w-xl">Sign in to review submissions.</p>
        <AdminLogin />
      </Container>
    );
  }

  const [pending, approved] = await Promise.all([getPendingReviews(), getApprovedReviews()]);

  return (
    <Container className="py-20 sm:py-28">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionLabel>Moderation</SectionLabel>
        <form action={logout}>
          <button
            type="submit"
            className="text-foreground-muted hover:text-foreground font-mono text-xs tracking-[0.12em] uppercase transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>

      <section className="mt-12">
        <h2 className="text-foreground font-mono text-sm font-bold tracking-[0.14em] uppercase">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-foreground-muted mt-4 text-sm">Queue is empty.</p>
        ) : (
          <ul className="mt-5 grid grid-cols-1 gap-4">
            {pending.map((review) => (
              <ModerationRow key={review.id} review={review}>
                <ActionButton action={approve} id={review.id} label="Approve" />
                <ActionButton action={remove} id={review.id} label="Delete" tone="danger" />
              </ModerationRow>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16">
        <h2 className="text-foreground font-mono text-sm font-bold tracking-[0.14em] uppercase">
          Published ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-foreground-muted mt-4 text-sm">Nothing published yet.</p>
        ) : (
          <ul className="mt-5 grid grid-cols-1 gap-4">
            {approved.map((review) => (
              <ModerationRow key={review.id} review={review}>
                <ActionButton action={unapprove} id={review.id} label="Unpublish" />
                <ActionButton action={remove} id={review.id} label="Delete" tone="danger" />
              </ModerationRow>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}
