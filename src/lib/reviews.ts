import "server-only";
import { Redis } from "@upstash/redis";
import type { PublicReview, Review } from "@/types";

/*
 * Review storage — Upstash Redis over its REST API.
 *
 * REST, not a TCP connection, is the reason this works unchanged on Netlify
 * Functions: every call is a `fetch`, so there is no pool to keep warm and no
 * connection to leak between invocations.
 *
 * Keys:
 *   review:<id>        the Review object (Upstash serialises/parses JSON for us)
 *   reviews:approved   sorted set of ids, score = createdAt — the public list
 *   reviews:pending    sorted set of ids, score = createdAt — the moderation queue
 *   rl:review:<ip>     submission counter, expires after RATE_WINDOW_SECONDS
 */

const APPROVED_KEY = "reviews:approved";
const PENDING_KEY = "reviews:pending";

const RATE_LIMIT = 3;
const RATE_WINDOW_SECONDS = 60 * 60;

/**
 * Whether Upstash is configured. Everything below degrades to empty/no-op when
 * it isn't, so `next build` and a fresh `git clone` still work with no env file
 * — the review UI just reports itself as unavailable instead of crashing.
 */
export function reviewsEnabled(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

let client: Redis | null = null;

function redis(): Redis | null {
  if (!reviewsEnabled()) return null;
  // Lazy, so importing this module never throws in an unconfigured environment.
  client ??= Redis.fromEnv();
  return client;
}

function toPublic(review: Review): PublicReview {
  // Built field by field rather than by deleting keys: a field added to Review
  // later is then private by default instead of leaking until someone notices.
  return {
    id: review.id,
    name: review.name,
    role: review.role,
    company: review.company,
    body: review.body,
    createdAt: review.createdAt,
  };
}

/**
 * Reads swallow their errors and return nothing. An Upstash outage should cost
 * the reviews section, not the whole homepage — and this runs during
 * prerendering, where a throw would fail the build.
 */
async function readSet(key: string, limit?: number): Promise<Review[]> {
  const db = redis();
  if (!db) return [];

  try {
    // rev: true → newest first, since the score is the creation timestamp.
    const ids = await db.zrange<string[]>(key, 0, limit ? limit - 1 : -1, { rev: true });
    if (ids.length === 0) return [];

    const rows = await db.mget<(Review | null)[]>(ids.map((id) => `review:${id}`));
    // An id can outlive its object if a delete half-succeeded; skip the holes.
    return rows.filter((row): row is Review => row !== null);
  } catch (error) {
    console.error(`[reviews] failed to read ${key}`, error);
    return [];
  }
}

/** Approved reviews, newest first. `limit` caps the homepage strip. */
export async function getApprovedReviews(limit?: number): Promise<PublicReview[]> {
  const reviews = await readSet(APPROVED_KEY, limit);
  return reviews.map(toPublic);
}

/** The moderation queue. Admin-only — this one keeps the private email field. */
export async function getPendingReviews(): Promise<Review[]> {
  return readSet(PENDING_KEY);
}

/**
 * Per-IP submission cap. Returns false once the window's allowance is spent.
 * Fails open: if Redis is unreachable the form still works, since losing a
 * review to an outage is worse than letting a few extras into a queue that a
 * human reads anyway.
 */
export async function withinRateLimit(ip: string): Promise<boolean> {
  const db = redis();
  if (!db) return true;

  try {
    const key = `rl:review:${ip}`;
    const count = await db.incr(key);
    if (count === 1) await db.expire(key, RATE_WINDOW_SECONDS);
    return count <= RATE_LIMIT;
  } catch {
    return true;
  }
}

export type NewReview = Pick<Review, "name" | "body"> &
  Partial<Pick<Review, "role" | "company" | "email">>;

/** Store a submission as pending. Nothing here reaches a public page until approved. */
export async function createReview(input: NewReview): Promise<void> {
  const db = redis();
  if (!db) throw new Error("Review storage is not configured");

  const review: Review = {
    id: crypto.randomUUID(),
    name: input.name,
    role: input.role,
    company: input.company,
    body: input.body,
    email: input.email,
    createdAt: Date.now(),
    status: "pending",
  };

  await db.set(`review:${review.id}`, review);
  await db.zadd(PENDING_KEY, { score: review.createdAt, member: review.id });
}

/** Move a review out of the queue and onto the site. */
export async function approveReview(id: string): Promise<void> {
  const db = redis();
  if (!db) return;

  const review = await db.get<Review>(`review:${id}`);
  if (!review) return;

  await db.set(`review:${id}`, { ...review, status: "approved" });
  await db.zadd(APPROVED_KEY, { score: review.createdAt, member: id });
  await db.zrem(PENDING_KEY, id);
}

/** Pull an approved review back into the queue without discarding it. */
export async function unapproveReview(id: string): Promise<void> {
  const db = redis();
  if (!db) return;

  const review = await db.get<Review>(`review:${id}`);
  if (!review) return;

  await db.set(`review:${id}`, { ...review, status: "pending" });
  await db.zadd(PENDING_KEY, { score: review.createdAt, member: id });
  await db.zrem(APPROVED_KEY, id);
}

/** Permanent. Removes the object and its membership in both sets. */
export async function deleteReview(id: string): Promise<void> {
  const db = redis();
  if (!db) return;

  await db.del(`review:${id}`);
  await db.zrem(PENDING_KEY, id);
  await db.zrem(APPROVED_KEY, id);
}
