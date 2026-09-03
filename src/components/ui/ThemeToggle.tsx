"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

function subscribe() {
  return () => {};
}

/** True only after the client has hydrated — avoids guessing the theme before next-themes resolves it. */
function useHasMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  const isLight = mounted && resolvedTheme === "light";

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${isLight ? "dark" : "light"} mode` : "Toggle theme"}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted transition-colors hover:text-foreground",
        className
      )}
    >
      {mounted && isLight ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
