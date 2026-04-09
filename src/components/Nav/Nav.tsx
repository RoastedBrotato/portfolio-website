import { useEffect, useState } from "react";

type NavProps = {
  theme: "dark" | "light";
  toggleTheme: () => void;
};

const navItems = [
  { label: "Work", href: "#projects" },
  { label: "Method", href: "#approach" },
  { label: "Stack", href: "#skills" },
  { label: "Contact", href: "#contact" }
];

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.93 4.93l1.7 1.7M17.37 17.37l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.93 19.07l1.7-1.7M17.37 6.63l1.7-1.7" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 9 9 0 1 0 20 14.5Z" />
    </svg>
  );
}

export function Nav({ theme, toggleTheme }: NavProps) {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const nextY = window.scrollY;
      const scrollingDown = nextY > lastY;
      const delta = Math.abs(nextY - lastY);

      if (nextY < 24) {
        setIsHidden(false);
      } else if (delta > 8) {
        setIsHidden(scrollingDown);
      }

      lastY = nextY;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className={`site-nav${isHidden ? " is-hidden" : ""}`}>
      <a className="brand" href="#top">
        WA
      </a>
      <div className="nav-actions">
        <nav>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <button
          className="theme-toggle icon-button"
          onClick={toggleTheme}
          type="button"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <IconSun /> : <IconMoon />}
        </button>
      </div>
    </header>
  );
}
