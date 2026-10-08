import type { PublicPostComment } from "@/types";

function formatWhen(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Approved comments under a post, oldest first so they read as a thread. */
export function CommentList({ comments }: { comments: PublicPostComment[] }) {
  if (comments.length === 0) {
    return (
      <p className="text-foreground-muted max-w-xl">
        No comments yet. Say something and you&apos;ll be the first.
      </p>
    );
  }

  return (
    <ol className="divide-border border-border-strong max-w-2xl divide-y-2 border-y-2">
      {comments.map((comment) => (
        <li key={comment.id} className="py-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-foreground font-mono text-sm font-bold tracking-[0.08em] uppercase">
              {comment.name}
            </p>
            <time
              dateTime={new Date(comment.createdAt).toISOString()}
              className="text-foreground-subtle font-mono text-xs"
            >
              {formatWhen(comment.createdAt)}
            </time>
          </div>
          <p className="text-foreground-muted mt-3 leading-relaxed whitespace-pre-wrap">
            {comment.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
