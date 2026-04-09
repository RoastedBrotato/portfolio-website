import { useEffect, useState } from "react";

type NavProps = {
  theme: "dark" | "light";
  toggleTheme: () => void;
};

const navItems = [
  { label: "Projects", href: "#projects" },
  { label: "Approach", href: "#approach" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" }
];

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
        Waleed
      </a>
      <div className="nav-actions">
        <nav>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} type="button">
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </header>
  );
}
