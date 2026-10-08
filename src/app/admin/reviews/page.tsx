import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/Section";
import { adminConfigured, isAdmin } from "@/lib/adminAuth";
import { getApprovedReviews, getPendingReviews, reviewsEnabled } from "@/lib/reviews";
import { getAllFeedback } from "@/lib/feedback";
import { getApprovedComments, getPendingComments } from "@/lib/comments";
import { relationshipLabel } from "@/data/reviews";
import { getAllQuotes } from "@/lib/quotes";
import { budgetRanges, projectTypes, referralSources, timelines } from "@/data/pricing";
import { getAllPosts } from "@/data/blog";
import type { Feedback, PostComment, PublicReview, QuoteRequest, Review } from "@/types";
import { AdminLogin } from "./AdminLogin";
import {
  approve,
  approveCommentAction,
  logout,
  markQuote,
  markRead,
  remove,
  removeComment,
  removeFeedback,
  removeQuote,
  unapprove,
  unapproveCommentAction,
} from "./actions";

/*
 * Never prerender. Without this the page's env checks can short-circuit before
 * `cookies()` is ever called at build time, and Next happily bakes a static
 * shell for a route whose whole job is to be per-session.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inbox",
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
  // Reviews from before these fields existed say so, rather than leaving a
  // blank that reads like a bug.
  const context = [
    relationshipLabel(review.relationship) ?? "Relationship not given",
    review.project,
  ]
    .filter(Boolean)
    .join(" · ");

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
      <p className="text-foreground-subtle mt-1.5 font-mono text-xs">{context}</p>

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

/**
 * Newest-first within each post, and the posts themselves ordered by whoever
 * heard from someone most recently — a Map preserves insertion order, and the
 * input is already sorted, so both fall out for free.
 */
function groupBySlug(items: Feedback[]): Map<string, Feedback[]> {
  const groups = new Map<string, Feedback[]>();
  for (const item of items) {
    const existing = groups.get(item.slug);
    if (existing) existing.push(item);
    else groups.set(item.slug, [item]);
  }
  return groups;
}

function FeedbackRow({ item }: { item: Feedback }) {
  return (
    <li className={`border-2 p-5 ${item.read ? "border-border" : "border-border-strong"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-foreground font-mono text-sm font-bold tracking-[0.08em] uppercase">
          {item.read ? null : <span className="text-accent mr-2">New</span>}
          {/* Notes sent before the name field existed have none to show. */}
          {item.name ?? <span className="text-foreground-subtle font-normal">Anonymous</span>}
        </p>
        <p className="text-foreground-subtle font-mono text-xs">{formatWhen(item.createdAt)}</p>
      </div>

      <p className="text-foreground-muted mt-3 text-sm leading-relaxed whitespace-pre-wrap">
        {item.body}
      </p>

      {item.email ? (
        <p className="text-foreground-subtle mt-3 font-mono text-xs">
          <a href={`mailto:${item.email}`} className="hover:text-foreground transition-colors">
            {item.email}
          </a>
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        {item.read ? null : <ActionButton action={markRead} id={item.id} label="Mark read" />}
        <ActionButton action={removeFeedback} id={item.id} label="Delete" tone="danger" />
      </div>
    </li>
  );
}

/** "On <post title>", linked, so nothing in the inbox is about an unnamed post. */
function PostLink({ slug, titles }: { slug: string; titles: Map<string, string> }) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="text-foreground-subtle hover:text-foreground font-mono text-xs underline-offset-4 transition-colors hover:underline"
    >
      On: {titles.get(slug) ?? slug}
    </Link>
  );
}

function CommentRow({
  comment,
  titles,
  children,
}: {
  comment: PostComment;
  titles: Map<string, string>;
  children: React.ReactNode;
}) {
  return (
    <li className="border-border-strong border-2 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-foreground font-mono text-sm font-bold tracking-[0.08em] uppercase">
          {comment.name}
        </p>
        <p className="text-foreground-subtle font-mono text-xs">{formatWhen(comment.createdAt)}</p>
      </div>
      <div className="mt-1.5">
        <PostLink slug={comment.slug} titles={titles} />
      </div>

      <p className="text-foreground-muted mt-3 text-sm leading-relaxed whitespace-pre-wrap">
        {comment.body}
      </p>

      {comment.email ? (
        <p className="text-foreground-subtle mt-3 font-mono text-xs">
          <a href={`mailto:${comment.email}`} className="hover:text-foreground transition-colors">
            {comment.email}
          </a>
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">{children}</div>
    </li>
  );
}

function labelOf(options: readonly { value: string; label: string }[], value?: string) {
  return value ? (options.find((option) => option.value === value)?.label ?? value) : undefined;
}

function QuoteRow({ quote }: { quote: QuoteRequest }) {
  const a = quote.attribution;
  // The first thing worth knowing about a lead from a social push: which push.
  const source =
    [a.utmSource, a.utmMedium, a.utmCampaign].filter(Boolean).join(" / ") ||
    (a.referrer ? `referrer: ${a.referrer}` : "direct / unknown");

  const details: [string, string | undefined][] = [
    ["Project", labelOf(projectTypes, quote.projectType)],
    ["Budget", labelOf(budgetRanges, quote.budget)],
    ["Timeline", labelOf(timelines, quote.timeline)],
    ["Found via", labelOf(referralSources, quote.source)],
    ["Source", source],
    ["Landed on", a.landingPage],
    ["Form", quote.placement],
  ];

  return (
    <li className={`border-2 p-5 ${quote.read ? "border-border" : "border-border-strong"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-foreground font-mono text-sm font-bold tracking-[0.08em] uppercase">
          {quote.read ? null : <span className="text-accent mr-2">New</span>}
          {quote.name}
          {quote.company ? (
            <span className="text-foreground-subtle ml-2 font-normal normal-case">
              {quote.company}
            </span>
          ) : null}
        </p>
        <p className="text-foreground-subtle font-mono text-xs">{formatWhen(quote.createdAt)}</p>
      </div>

      <dl className="mt-4 grid grid-cols-[6rem_1fr] gap-x-4 gap-y-1.5 text-sm">
        {details
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-foreground-subtle font-mono text-xs uppercase">{label}</dt>
              <dd className="text-foreground-muted break-words">{value}</dd>
            </div>
          ))}
      </dl>

      <p className="text-foreground-muted mt-4 text-sm leading-relaxed whitespace-pre-wrap">
        {quote.description}
      </p>
      {quote.links ? (
        <p className="text-foreground-subtle mt-3 text-sm break-words whitespace-pre-wrap">
          {quote.links}
        </p>
      ) : null}

      <p className="text-foreground-subtle mt-3 font-mono text-xs">
        <a href={`mailto:${quote.email}`} className="hover:text-foreground transition-colors">
          {quote.email}
        </a>
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        {quote.read ? null : <ActionButton action={markQuote} id={quote.id} label="Mark read" />}
        <ActionButton action={removeQuote} id={quote.id} label="Delete" tone="danger" />
      </div>
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

  const [pending, approved, pendingComments, approvedComments, feedback, quotes] =
    await Promise.all([
      getPendingReviews(),
      getApprovedReviews(),
      getPendingComments(),
      getApprovedComments(),
      getAllFeedback(),
      getAllQuotes(),
    ]);
  const unreadQuotes = quotes.filter((quote) => !quote.read).length;

  // Slug → title, so a note reads as the post it was left on. Falls back to the
  // raw slug if the post has since been renamed away or turned back into a draft.
  const titles = new Map(getAllPosts().map((post) => [post.slug, post.title]));
  const byPost = groupBySlug(feedback);
  const unread = feedback.filter((item) => !item.read).length;

  // What needs me, at a glance — each links down to its section.
  const summary = [
    { href: "#quotes", label: "Quotes", count: unreadQuotes, of: quotes.length, noun: "new" },
    { href: "#reviews", label: "Reviews", count: pending.length, of: null, noun: "to approve" },
    {
      href: "#comments",
      label: "Comments",
      count: pendingComments.length,
      of: null,
      noun: "to approve",
    },
    { href: "#notes", label: "Private notes", count: unread, of: feedback.length, noun: "unread" },
  ];

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

      <nav aria-label="Inbox sections" className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`border-2 p-4 transition-colors ${
              item.count > 0
                ? "border-accent hover:bg-background-elevated"
                : "border-border hover:border-border-strong"
            }`}
          >
            <span className="text-foreground-muted block font-mono text-xs tracking-[0.12em] uppercase">
              {item.label}
            </span>
            <span className="text-foreground mt-2 block font-mono text-2xl font-bold">
              {item.count}
            </span>
            <span className="text-foreground-subtle block text-xs">
              {item.noun}
              {item.of !== null ? ` of ${item.of}` : null}
            </span>
          </a>
        ))}
      </nav>

      {/* Leads first: they're the one thing on this page with a clock on it. */}
      <section id="quotes" className="mt-12 scroll-mt-20">
        <h2 className="text-foreground font-mono text-sm font-bold tracking-[0.14em] uppercase">
          Quote requests ({unreadQuotes} new / {quotes.length})
        </h2>
        {quotes.length === 0 ? (
          <p className="text-foreground-muted mt-4 text-sm">No requests yet.</p>
        ) : (
          <ul className="mt-5 grid grid-cols-1 gap-4">
            {quotes.map((quote) => (
              <QuoteRow key={quote.id} quote={quote} />
            ))}
          </ul>
        )}
      </section>

      <section id="reviews" className="mt-16 scroll-mt-20">
        <h2 className="text-foreground font-mono text-sm font-bold tracking-[0.14em] uppercase">
          Reviews — pending ({pending.length})
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
          Reviews — published ({approved.length})
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

      <section id="comments" className="mt-16 scroll-mt-20">
        <h2 className="text-foreground font-mono text-sm font-bold tracking-[0.14em] uppercase">
          Comments — pending ({pendingComments.length})
        </h2>
        {pendingComments.length === 0 ? (
          <p className="text-foreground-muted mt-4 text-sm">Queue is empty.</p>
        ) : (
          <ul className="mt-5 grid grid-cols-1 gap-4">
            {pendingComments.map((comment) => (
              <CommentRow key={comment.id} comment={comment} titles={titles}>
                <ActionButton action={approveCommentAction} id={comment.id} label="Approve" />
                <ActionButton action={removeComment} id={comment.id} label="Delete" tone="danger" />
              </CommentRow>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16">
        <h2 className="text-foreground font-mono text-sm font-bold tracking-[0.14em] uppercase">
          Comments — published ({approvedComments.length})
        </h2>
        {approvedComments.length === 0 ? (
          <p className="text-foreground-muted mt-4 text-sm">Nothing published yet.</p>
        ) : (
          <ul className="mt-5 grid grid-cols-1 gap-4">
            {approvedComments.map((comment) => (
              <CommentRow key={comment.id} comment={comment} titles={titles}>
                <ActionButton action={unapproveCommentAction} id={comment.id} label="Unpublish" />
                <ActionButton action={removeComment} id={comment.id} label="Delete" tone="danger" />
              </CommentRow>
            ))}
          </ul>
        )}
      </section>

      {/* Private by promise: these were sent as notes to me, and there is no
          button here to publish one. */}
      <section id="notes" className="mt-16 scroll-mt-20">
        <h2 className="text-foreground font-mono text-sm font-bold tracking-[0.14em] uppercase">
          Private notes on posts ({unread} unread / {feedback.length})
        </h2>
        {feedback.length === 0 ? (
          <p className="text-foreground-muted mt-4 text-sm">No feedback yet.</p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-10">
            {Array.from(byPost, ([slug, items]) => (
              <div key={slug}>
                <h3 className="text-foreground-muted font-mono text-xs tracking-[0.12em] uppercase">
                  <Link
                    href={`/blog/${slug}`}
                    className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
                  >
                    {titles.get(slug) ?? slug}
                  </Link>{" "}
                  ({items.length})
                </h3>
                <ul className="mt-4 grid grid-cols-1 gap-4">
                  {items.map((item) => (
                    <FeedbackRow key={item.id} item={item} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
