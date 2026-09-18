"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { submitFeedback, type FeedbackFormState } from "@/app/blog/[slug]/actions";

const BODY_MAX = 1000;

/* Lives here, not in actions.ts: a "use server" module may only export async
   functions, and a plain constant there fails at request time — after the build
   has already passed. */
const INITIAL_STATE: FeedbackFormState = { status: "idle" };

const inputClass =
  "border-border-strong bg-background-elevated text-foreground placeholder:text-foreground-subtle focus-visible:border-accent w-full border-2 px-3.5 py-2.5 text-sm outline-none transition-colors";

/**
 * A private note on a post — not a comment section. Nothing submitted here is
 * published anywhere, which is why the copy says so twice: a reader who thinks
 * this is a public comment box will write a different thing than one who knows
 * it goes to an inbox.
 *
 * Styled down on purpose (secondary button, muted heading, narrow column) so it
 * reads as a footnote rather than competing with the reviews CTA in the footer.
 */
export function FeedbackBox({ slug }: { slug: string }) {
  const [state, formAction, pending] = useActionState<FeedbackFormState, FormData>(
    submitFeedback,
    INITIAL_STATE,
  );

  if (state.status === "success") {
    return (
      <p className="text-foreground-muted flex items-center gap-2.5 font-mono text-xs tracking-[0.1em] uppercase">
        <Check size={16} className="text-accent" />
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="max-w-xl">
      {/* Honeypot. Positioned off-screen rather than display:none, which some
          bots know to skip, and kept out of the tab order and the a11y tree. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="fb-website">Website</label>
        <input id="fb-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Which post this is about. Re-checked server-side — this is a hint, not
          a source of truth. */}
      <input type="hidden" name="slug" value={slug} />

      <label
        htmlFor="fb-body"
        className="text-foreground-muted mb-2 block font-mono text-xs font-bold tracking-[0.14em] uppercase"
      >
        Anything wrong, missing, or useful?
      </label>
      <textarea
        id="fb-body"
        name="body"
        required
        rows={4}
        minLength={10}
        maxLength={BODY_MAX}
        defaultValue={state.values?.body}
        className={`${inputClass} resize-y leading-relaxed`}
        placeholder="Goes to me privately. Not published anywhere."
      />
      {state.errors?.body ? (
        <p className="text-accent mt-1.5 text-xs" role="alert">
          {state.errors.body}
        </p>
      ) : null}

      <div className="mt-4">
        <label
          htmlFor="fb-email"
          className="text-foreground-muted mb-2 block font-mono text-xs font-bold tracking-[0.14em] uppercase"
        >
          Email
        </label>
        <input
          id="fb-email"
          name="email"
          type="email"
          maxLength={120}
          autoComplete="email"
          defaultValue={state.values?.email}
          className={inputClass}
          placeholder="Optional — only if you want a reply."
        />
        {state.errors?.email ? (
          <p className="text-accent mt-1.5 text-xs" role="alert">
            {state.errors.email}
          </p>
        ) : null}
      </div>

      {state.status === "error" && state.message ? (
        <p className="border-accent text-accent mt-4 border-2 px-3.5 py-2.5 text-xs" role="alert">
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="secondary"
        disabled={pending}
        className="mt-5 disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send"}
      </Button>
    </form>
  );
}
