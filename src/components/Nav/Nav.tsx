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
  return (
    <header className="site-nav">
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
