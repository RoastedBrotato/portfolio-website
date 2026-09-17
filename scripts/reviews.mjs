/*
 * Read the review queue from the terminal — `npm run reviews`.
 *
 * Exists so checking the queue doesn't mean fetching a token out of Netlify and
 * signing into /admin/reviews just to find out nobody has written anything.
 * Read-only on purpose: approving still goes through the admin page, where the
 * action is deliberate and revalidates the pages it affects.
 *
 * Keys mirror src/lib/reviews.ts. If they change there, change them here.
 */

import { Redis } from "@upstash/redis";

const APPROVED_KEY = "reviews:approved";
const PENDING_KEY = "reviews:pending";

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
async function read(key) {
  const ids = await redis.zrange(key, 0, -1, { rev: true });
  if (ids.length === 0) return [];

  const rows = await redis.mget(...ids.map((id) => `review:${id}`));
  return rows.filter((row) => row !== null);
}

function format(review) {
  const when = new Date(review.createdAt).toISOString().slice(0, 10);
  const who = [review.name, review.role, review.company].filter(Boolean).join(" · ");
  const body = review.body.replace(/\s+/g, " ").trim();

  // Continuation lines hang under the name, past the "  YYYY-MM-DD  " gutter.
  const indent = " ".repeat(`  ${when}  `.length);

  return [
    `  ${when}  ${who}`,
    review.email ? `${indent}${review.email}` : null,
    `${indent}${body}`,
    `${indent}id: ${review.id}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function section(title, reviews) {
  console.log(`\n${title} (${reviews.length})`);
  console.log(reviews.length === 0 ? "  —" : reviews.map(format).join("\n\n"));
}

const [pending, approved] = await Promise.all([read(PENDING_KEY), read(APPROVED_KEY)]);

section("PENDING", pending);
section("PUBLISHED", approved);

if (pending.length > 0) {
  console.log(`\nApprove at /admin/reviews.`);
}
console.log();
