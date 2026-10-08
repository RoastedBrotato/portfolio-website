"use client";

import { useActionState, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/FormField";
import { submitComment, type CommentFormState } from "@/app/blog/[slug]/actions";
import { cn } from "@/lib/utils";

const BODY_MAX = 1000;

/* Lives here, not in actions.ts: a "use server" module may only export async
   functions, and a plain constant there fails at request time — after the build
   has already passed. */
const INITIAL_STATE: CommentFormState = { status: "idle" };

type Visibility = "public" | "private";

const OPTIONS: { value: Visibility; label: string; hint: string }[] = [
  { value: "public", label: "Post publicly", hint: "Shown under the post once I've read it." },
  { value: "private", label: "Send privately", hint: "Goes only to me. Never published." },
];

/**
 * The end-of-post form. The reader picks where it goes before they write, and
 * the copy changes with the choice — someone who knows a note is private writes
 * a different thing than someone writing for an audience.
 *
 * Field ids are prefixed so they can't collide with anything in the post body.
 */
export function CommentForm({ slug }: { slug: string }) {
  const [state, formAction, pending] = useActionState<CommentFormState, FormData>(
    submitComment,
    INITIAL_STATE,
  );
  const [visibility, setVisibility] = useState<Visibility>(
    state.values?.visibility === "private" ? "private" : "public",
  );

  if (state.status === "success") {
    return (
      <div className="border-border-strong bg-background brutal max-w-xl border-2 p-6">
        <p className="text-foreground flex items-center gap-2.5 font-mono text-sm font-bold tracking-[0.1em] uppercase">
          <Check size={18} className="text-accent" />
          {state.visibility === "private" ? "Sent" : "Submitted"}
        </p>
        <p className="text-foreground-muted mt-3 text-base leading-relaxed">{state.message}</p>
      </div>
    );
  }

  const isPublic = visibility === "public";

  return (
    <form action={formAction} className="max-w-xl">
      {/* Honeypot. Positioned off-screen rather than display:none, which some
          bots know to skip, and kept out of the tab order and the a11y tree. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Which post this is about. Re-checked server-side — this is a hint, not
          a source of truth. */}
      <input type="hidden" name="slug" value={slug} />

      <fieldset>
        <legend className="sr-only">Where should this go?</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OPTIONS.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value={option.value}
                checked={visibility === option.value}
                onChange={() => setVisibility(option.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "peer-focus-visible:outline-accent block h-full border-2 px-4 py-3 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
                  visibility === option.value
                    ? "border-accent bg-background-elevated"
                    : "border-border text-foreground-muted hover:border-border-strong",
                )}
              >
                <span className="text-foreground block font-mono text-xs font-bold tracking-[0.12em] uppercase">
                  {option.label}
                </span>
                <span className="text-foreground-subtle mt-1 block text-xs">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <Field label={isPublic ? "Your comment" : "Your note"} name="c-body" error={state.errors?.body}>
          <textarea
            id="c-body"
            name="body"
            required
            rows={4}
            minLength={10}
            maxLength={BODY_MAX}
            defaultValue={state.values?.body}
            className={`${inputClass} resize-y leading-relaxed`}
            placeholder={
              isPublic ? "What did you think?" : "Anything wrong, missing, or useful? Just for me."
            }
          />
        </Field>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          name="c-name"
          error={state.errors?.name}
          hint={isPublic ? "Shown with your comment." : "Optional — so I know who it's from."}
        >
          <input
            id="c-name"
            name="name"
            type="text"
            required={isPublic}
            maxLength={60}
            autoComplete="name"
            defaultValue={state.values?.name}
            className={inputClass}
          />
        </Field>

        <Field
          label="Email"
          name="c-email"
          error={state.errors?.email}
          hint="Optional. Never published — only if you want a reply."
        >
          <input
            id="c-email"
            name="email"
            type="email"
            maxLength={120}
            autoComplete="email"
            defaultValue={state.values?.email}
            className={inputClass}
          />
        </Field>
      </div>

      {state.status === "error" && state.message ? (
        <p className="border-accent text-accent mt-5 border-2 px-3.5 py-2.5 text-sm" role="alert">
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="mt-6 disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? "Sending…" : isPublic ? "Post comment" : "Send privately"}
      </Button>
    </form>
  );
}
