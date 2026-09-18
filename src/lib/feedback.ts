import "server-only";
import { Redis } from "@upstash/redis";
import type { Feedback } from "@/types";

/*
 * Feedback storage — reader notes left at the end of a blog post.
 *
 * Deliberately a near-copy of src/lib/reviews.ts rather than an abstraction
 * over both. They share a shape today but not a purpose: reviews exist to be
 * published, these exist never to be. Folding them together would put a public
 * read path one refactor away from this data, and that is the whole risk.
 *
 * Keys:
 *   feedback:<id>      the Feedback object (Upstash serialises/parses JSON for us)
 *   feedback:inbox     sorted set of ids, score = createdAt — the whole inbox
 *
 * Rate limiting is `withinRateLimit` in ./reviews, called with the "feedback"
 * namespace so this shares no bucket with the reviews form.
 *
 * There is no toPublic() mapper here, and there must not be one. Nothing in
 * this module is rendered anywhere but /admin/reviews. If you are adding a
 * public getter because the reviews module has one, that is the bug.
 */

const INBOX_KEY = "feedback:inbox";

/**
 * Whether Upstash is configured. Reuses the review variables — the inbox is a
 * second key prefix in the same database, not a second service to set up.
 */
export function feedbackEnabled(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

let client: Redis | null = null;

function redis(): Redis | null {
  if (!feedbackEnabled()) return null;
  // Lazy, so importing this module never throws in an unconfigured environment.
  client ??= Redis.fromEnv();
  return client;
}

/**
 * The whole inbox, newest first. Admin-only, so nothing is stripped.
 *
 * Swallows its errors like the review reads do: this is imported by the blog
 * post route, and an Upstash outage must not fail a page that is otherwise
 * entirely static.
 */
export async function getAllFeedback(): Promise<Feedback[]> {
  const db = redis();
  if (!db) return [];

  try {
    // rev: true → newest first, since the score is the creation timestamp.
    const ids = await db.zrange<string[]>(INBOX_KEY, 0, -1, { rev: true });
    if (ids.length === 0) return [];

    const rows = await db.mget<(Feedback | null)[]>(ids.map((id) => `feedback:${id}`));
    // An id can outlive its object if a delete half-succeeded; skip the holes.
    return rows.filter((row): row is Feedback => row !== null);
  } catch (error) {
    console.error(`[feedback] failed to read ${INBOX_KEY}`, error);
    return [];
  }
}

export type NewFeedback = Pick<Feedback, "slug" | "body"> & Partial<Pick<Feedback, "email">>;

/**
 * Store a note. Throws when unconfigured — unlike the reads, a write that
 * silently does nothing would tell the reader their feedback was sent.
 */
export async function createFeedback(input: NewFeedback): Promise<void> {
  const db = redis();
  if (!db) throw new Error("Feedback storage is not configured");

  const feedback: Feedback = {
    id: crypto.randomUUID(),
    slug: input.slug,
    body: input.body,
    email: input.email,
    createdAt: Date.now(),
    read: false,
  };

  await db.set(`feedback:${feedback.id}`, feedback);
  await db.zadd(INBOX_KEY, { score: feedback.createdAt, member: feedback.id });
}

/** Mark as read. The only non-destructive action — there is nothing to approve. */
export async function markFeedbackRead(id: string): Promise<void> {
  const db = redis();
  if (!db) return;

  const feedback = await db.get<Feedback>(`feedback:${id}`);
  if (!feedback) return;

  await db.set(`feedback:${id}`, { ...feedback, read: true });
}

/** Permanent. Removes the object and its membership in the inbox. */
export async function deleteFeedback(id: string): Promise<void> {
  const db = redis();
  if (!db) return;

  await db.del(`feedback:${id}`);
  await db.zrem(INBOX_KEY, id);
}
