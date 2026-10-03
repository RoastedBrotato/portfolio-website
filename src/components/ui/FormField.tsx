/** Shared by every form on the site: square, 2px, accent border on focus. */
export const inputClass =
  "border-border-strong bg-background-elevated text-foreground placeholder:text-foreground-subtle focus-visible:border-accent w-full border-2 px-3.5 py-2.5 text-base outline-none transition-colors";

/** Label, control, then either the error (announced) or a hint. */
export function Field({
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
