const navItems = [
  { label: "Projects", href: "#projects" },
  { label: "Approach", href: "#approach" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" }
];

export function Nav() {
  return (
    <header className="site-nav">
      <a className="brand" href="#top">
        Waleed
      </a>
      <nav>
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
