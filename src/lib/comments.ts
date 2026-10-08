import "server-only";
import { Redis } from "@upstash/redis";
import type { PostComment, PublicPostComment } from "@/types";

/*
 * Public blog comments — the review flow, scoped to a post.
 *
 * Kept apart from ./feedback on purpose: those notes were sent on the promise
 * that they'd stay private, and this module has a public read path. The two
 * share a form on the page and nothing else.
 *
 * Keys:
 *   comment:<id>              the PostComment object
 *   comments:pending          sorted set of ids, score = createdAt — the moderation queue
 *   comments:approved         sorted set of ids, score = createdAt — every published comment, for /admin
 *   comments:post:<slug>      sorted set of ids, score = createdAt — what a post renders
 *
 * Rate limiting is `withinRateLimit` in ./reviews, called with the "comment"
 * namespace.
 */

const PENDING_KEY = "comments:pending";
const APPROVED_KEY = "comments:approved";
const postKey = (slug: string) => `comments:post:${slug}`;

/** Same database as reviews and feedback — a key prefix, not another service. */
export function commentsEnabled(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

let client: Redis | null = null;

function redis(): Redis | null {
  if (!commentsEnabled()) return null;
  // Lazy, so importing this module never throws in an unconfigured environment.
  client ??= Redis.fromEnv();
  return client;
}

function toPublic(comment: PostComment): PublicPostComment {
  // Field by field, like reviews: a field added later is private by default.
  return {
    id: comment.id,
    slug: comment.slug,
    name: comment.name,
    body: comment.body,
    createdAt: comment.createdAt,
  };
}

/**
 * Swallows its errors: a blog post is otherwise static, and an Upstash outage
 * should cost it the comment list, not the page — or, at prerender, the build.
 */
async function readSet(key: string, order: "newest" | "oldest"): Promise<PostComment[]> {
  const db = redis();
  if (!db) return [];

  try {
    const ids = await db.zrange<string[]>(key, 0, -1, { rev: order === "newest" });
    if (ids.length === 0) return [];

    const rows = await db.mget<(PostComment | null)[]>(ids.map((id) => `comment:${id}`));
    // An id can outlive its object if a delete half-succeeded; skip the holes.
    return rows.filter((row): row is PostComment => row !== null);
  } catch (error) {
    console.error(`[comments] failed to read ${key}`, error);
    return [];
  }
}

/** A post's published comments, oldest first — they read as a conversation. */
export async function getPostComments(slug: string): Promise<PublicPostComment[]> {
  const comments = await readSet(postKey(slug), "oldest");
  return comments.map(toPublic);
}

/** The moderation queue, newest first. Admin-only — keeps the private email. */
export async function getPendingComments(): Promise<PostComment[]> {
  return readSet(PENDING_KEY, "newest");
}

/** Every published comment, newest first. Admin-only. */
export async function getApprovedComments(): Promise<PostComment[]> {
  return readSet(APPROVED_KEY, "newest");
}

export type NewComment = Pick<PostComment, "slug" | "name" | "body"> &
  Partial<Pick<PostComment, "email">>;

/** Store a submission as pending. Throws when unconfigured, like createReview. */
export async function createComment(input: NewComment): Promise<void> {
  const db = redis();
  if (!db) throw new Error("Comment storage is not configured");

  const comment: PostComment = {
    id: crypto.randomUUID(),
    slug: input.slug,
    name: input.name,
    body: input.body,
    email: input.email,
    createdAt: Date.now(),
    status: "pending",
  };

  await db.set(`comment:${comment.id}`, comment);
  await db.zadd(PENDING_KEY, { score: comment.createdAt, member: comment.id });
}

/*
 * The mutations return the comment's slug so the caller can revalidate the one
 * post that changed, rather than every post on the site.
 */

export async function approveComment(id: string): Promise<string | null> {
  const db = redis();
  if (!db) return null;

  const comment = await db.get<PostComment>(`comment:${id}`);
  if (!comment) return null;

  await db.set(`comment:${id}`, { ...comment, status: "approved" });
  await db.zadd(APPROVED_KEY, { score: comment.createdAt, member: id });
  await db.zadd(postKey(comment.slug), { score: comment.createdAt, member: id });
  await db.zrem(PENDING_KEY, id);
  return comment.slug;
}

/** Pull a published comment back into the queue without discarding it. */
export async function unapproveComment(id: string): Promise<string | null> {
  const db = redis();
  if (!db) return null;

  const comment = await db.get<PostComment>(`comment:${id}`);
  if (!comment) return null;

  await db.set(`comment:${id}`, { ...comment, status: "pending" });
  await db.zadd(PENDING_KEY, { score: comment.createdAt, member: id });
  await db.zrem(APPROVED_KEY, id);
  await db.zrem(postKey(comment.slug), id);
  return comment.slug;
}

/** Permanent. Removes the object and every set it was in. */
export async function deleteComment(id: string): Promise<string | null> {
  const db = redis();
  if (!db) return null;

  const comment = await db.get<PostComment>(`comment:${id}`);
  await db.del(`comment:${id}`);
  await db.zrem(PENDING_KEY, id);
  await db.zrem(APPROVED_KEY, id);
  if (comment) await db.zrem(postKey(comment.slug), id);
  return comment?.slug ?? null;
}
