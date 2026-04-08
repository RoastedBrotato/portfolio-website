import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const storageKey = "portfolio-theme";

function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem(storageKey);

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  return {
    theme,
    toggleTheme() {
      setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
    }
  };
}
