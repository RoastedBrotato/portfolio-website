type ClassValue = string | number | false | null | undefined;

/** Minimal className joiner — avoids pulling in clsx/tailwind-merge for a handful of call sites. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
