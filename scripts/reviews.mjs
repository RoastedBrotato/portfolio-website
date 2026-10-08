/*
 * Read everything people have sent from the terminal — `npm run reviews`:
 * reviews, blog comments, and private notes left on posts, each with who wrote
 * it and what it was about.
 *
 * Exists so checking the queue doesn't mean fetching a token out of Netlify and
 * signing into /admin/reviews just to find out nobody has written anything.
 * Read-only on purpose: approving still goes through the admin page, where the
 * action is deliberate and revalidates the pages it affects.
 *
 * Keys mirror src/lib/reviews.ts, src/lib/comments.ts and src/lib/feedback.ts.
 * If they change there, change them here.
 */

import { Redis } from "@upstash/redis";

const APPROVED_KEY = "reviews:approved";
const PENDING_KEY = "reviews:pending";
const COMMENTS_PENDING_KEY = "comments:pending";
const COMMENTS_APPROVED_KEY = "comments:approved";
const FEEDBACK_KEY = "feedback:inbox";

// Mirrors src/data/reviews.ts.
const RELATIONSHIPS = {
  client: "Client",
  collaborator: "Collaborator",
  colleague: "Colleague",
  friend: "Friend",
  other: "Other",
};

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.error(
    "Missing Upstash credentials.\n" +
      "Copy UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from Netlify into .env.local\n" +
      "(see .env.example).",
  );
  process.exit(1);
}

const redis = Redis.fromEnv();

/*
 * The site swallows read errors so an Upstash outage costs the reviews section
 * and not the whole homepage. A CLI wants the opposite: if the read fails, say
 * so loudly rather than printing a reassuring zero.
 */
async function read(key, prefix) {
  const ids = await redis.zrange(key, 0, -1, { rev: true });
  if (ids.length === 0) return [];

  const rows = await redis.mget(...ids.map((id) => `${prefix}:${id}`));
  return rows.filter((row) => row !== null);
}

/**
 * One entry: date and who on the first line, then what it's about, the private
 * email, the text, and the id. `about` is the line that answers "what was this
 * for?" — the relationship and project for a review, the post for the others.
 */
function format(item, { who, about }) {
  const when = new Date(item.createdAt).toISOString().slice(0, 10);
  const body = item.body.replace(/\s+/g, " ").trim();

  // Continuation lines hang under the name, past the "  YYYY-MM-DD  " gutter.
  const indent = " ".repeat(`  ${when}  `.length);

  return [
    `  ${when}  ${who}`,
    about ? `${indent}${about}` : null,
    item.email ? `${indent}${item.email}` : null,
    `${indent}${body}`,
    `${indent}id: ${item.id}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const describeReview = (review) => ({
  who: [review.name, review.role, review.company].filter(Boolean).join(" · "),
  about: [RELATIONSHIPS[review.relationship] ?? "relationship not given", review.project]
    .filter(Boolean)
    .join(" · "),
});

const describeComment = (comment) => ({
  who: comment.name,
  about: `on /blog/${comment.slug}`,
});

const describeNote = (note) => ({
  who: `${note.name ?? "anonymous"}${note.read ? "" : "  [unread]"}`,
  about: `on /blog/${note.slug}`,
});

function section(title, items, describe) {
  console.log(`\n${title} (${items.length})`);
  console.log(
    items.length === 0 ? "  —" : items.map((item) => format(item, describe(item))).join("\n\n"),
  );
}

const [pending, approved, pendingComments, approvedComments, notes] = await Promise.all([
  read(PENDING_KEY, "review"),
  read(APPROVED_KEY, "review"),
  read(COMMENTS_PENDING_KEY, "comment"),
  read(COMMENTS_APPROVED_KEY, "comment"),
  read(FEEDBACK_KEY, "feedback"),
]);

section("REVIEWS — PENDING", pending, describeReview);
section("REVIEWS — PUBLISHED", approved, describeReview);
section("COMMENTS — PENDING", pendingComments, describeComment);
section("COMMENTS — PUBLISHED", approvedComments, describeComment);
section("PRIVATE NOTES ON POSTS", notes, describeNote);

if (pending.length > 0 || pendingComments.length > 0) {
  console.log(`\nApprove at /admin/reviews.`);
}
console.log();
