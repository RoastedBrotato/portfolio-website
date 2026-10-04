import Link from "next/link";
import { Mail } from "lucide-react";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { siteConfig } from "@/data/config";
import { Container } from "@/components/ui/Container";

/*
 * The secondary pages live here rather than in the primary nav: they're for
 * the curious and for returning visitors, not for someone deciding on a quote.
 */
const footerLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Lab", href: "/lab" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/reviews" },
  { label: "Get a quote", href: "/quote" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border-strong defer-render bg-plane-0 border-t-2">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[var(--rail)_1fr_auto] lg:gap-[var(--rail-gap)]">
        <div>
          <p className="text-foreground flex items-center gap-2.5 font-mono text-sm font-bold tracking-[0.08em] uppercase">
            {siteConfig.name}
            <span aria-hidden className="bg-accent h-2 w-2" />
          </p>
          <p className="text-foreground-subtle mt-1 text-sm">{siteConfig.role}</p>
        </div>

        <div>
          {/* items-start keeps the marker on the first line when the label wraps. */}
          <p className="text-foreground-muted flex items-start gap-2.5 font-mono text-xs leading-relaxed tracking-[0.15em] uppercase">
            <span aria-hidden className="bg-accent mt-[0.4em] h-2 w-2 shrink-0" />
            <span>
              {siteConfig.availability} · {siteConfig.location}
            </span>
          </p>
          <nav aria-label="Footer" className="mt-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground-muted hover:text-foreground font-mono text-xs tracking-[0.12em] uppercase transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1 lg:items-end">
          <div className="flex items-center gap-6">
            <SocialLinks linkClassName="text-foreground-muted transition-colors hover:text-foreground" />
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label="Email"
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              <Mail size={18} strokeWidth={1.75} />
            </a>
          </div>
          <p className="text-foreground-subtle text-sm">
            &copy; {year} {siteConfig.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
