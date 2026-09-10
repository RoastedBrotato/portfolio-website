"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { submitReview, type ReviewFormState } from "@/app/reviews/actions";

const BODY_MAX = 800;

/* Lives here, not in actions.ts: a "use server" module may only export async
   functions, and a plain constant there fails at request time — after the build
   has already passed. */
const INITIAL_STATE: ReviewFormState = { status: "idle" };

const inputClass =
  "border-border-strong bg-background-elevated text-foreground placeholder:text-foreground-subtle focus-visible:border-accent w-full border-2 px-3.5 py-2.5 text-base outline-none transition-colors";

function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-foreground-muted mb-2 block font-mono text-xs font-bold tracking-[0.14em] uppercase"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-accent mt-1.5 text-xs" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-foreground-subtle mt-1.5 text-xs">{hint}</p>
      ) : null}
    </div>
  );
}

export function ReviewForm() {
  const [state, formAction, pending] = useActionState<ReviewFormState, FormData>(
    submitReview,
    INITIAL_STATE,
  );
  const [bodyLength, setBodyLength] = useState(state.values?.body?.length ?? 0);

  if (state.status === "success") {
    return (
      <div className="border-border-strong bg-background brutal border-2 p-7">
        <p className="text-foreground flex items-center gap-2.5 font-mono text-sm font-bold tracking-[0.1em] uppercase">
          <Check size={18} className="text-accent" />
          Submitted
        </p>
        <p className="text-foreground-muted mt-4 text-base leading-relaxed">{state.message}</p>
      </div>
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
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={state.errors?.name}>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={60}
            autoComplete="name"
            defaultValue={state.values?.name}
            className={inputClass}
            placeholder="Jane Doe"
          />
        </Field>

        <Field
          label="Email"
          name="email"
          error={state.errors?.email}
          hint="Optional. Never published — only so I can reach you."
        >
          <input
            id="email"
            name="email"
            type="email"
            maxLength={120}
            autoComplete="email"
            defaultValue={state.values?.email}
            className={inputClass}
            placeholder="jane@company.com"
          />
        </Field>

        <Field label="Role" name="role" error={state.errors?.role} hint="Optional.">
          <input
            id="role"
            name="role"
            type="text"
            maxLength={80}
            autoComplete="organization-title"
            defaultValue={state.values?.role}
            className={inputClass}
            placeholder="Founder"
          />
        </Field>

        <Field label="Company" name="company" error={state.errors?.company} hint="Optional.">
          <input
            id="company"
            name="company"
            type="text"
            maxLength={80}
            autoComplete="organization"
            defaultValue={state.values?.company}
            className={inputClass}
            placeholder="Acme"
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Your review" name="body" error={state.errors?.body}>
          <textarea
            id="body"
            name="body"
            required
            rows={6}
            minLength={30}
            maxLength={BODY_MAX}
            defaultValue={state.values?.body}
            onChange={(e) => setBodyLength(e.target.value.length)}
            className={`${inputClass} resize-y leading-relaxed`}
            placeholder="What did we work on, and how did it go?"
          />
        </Field>
        <p className="text-foreground-subtle mt-1.5 text-right font-mono text-xs">
          {bodyLength}/{BODY_MAX}
        </p>
      </div>

      {state.status === "error" && state.message ? (
        <p className="border-accent text-accent mt-6 border-2 px-3.5 py-2.5 text-sm" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? "Sending…" : "Submit review"}
          {pending ? null : <ArrowRight size={16} />}
        </Button>
        <p className="text-foreground-subtle text-sm">
          Reviews are published after I&apos;ve read them.
        </p>
      </div>
    </form>
  );
}
