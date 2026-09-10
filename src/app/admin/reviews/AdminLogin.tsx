"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { login, type LoginState } from "./actions";

export function AdminLogin() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="max-w-sm">
      <label
        htmlFor="token"
        className="text-foreground-muted mb-2 block font-mono text-xs font-bold tracking-[0.14em] uppercase"
      >
        Admin token
      </label>
      <input
        id="token"
        name="token"
        type="password"
        required
        autoComplete="current-password"
        className="border-border-strong bg-background-elevated text-foreground focus-visible:border-accent w-full border-2 px-3.5 py-2.5 text-base outline-none transition-colors"
      />
      {state.error ? (
        <p className="text-accent mt-2 text-xs" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="mt-6 disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? "Checking…" : "Sign in"}
      </Button>
    </form>
  );
}
