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
  { label: "Start a project", href: "/quote" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="defer-render bg-plane-0 border-t">
      <Container className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[var(--rail)_1fr_auto] lg:gap-[var(--rail-gap)]">
        <div>
          <p className="text-foreground flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]">
            {siteConfig.name}
            <span aria-hidden className="bg-accent h-1.5 w-1.5 rounded-full" />
          </p>
          <p className="text-foreground-subtle mt-1 text-sm">{siteConfig.role}</p>
        </div>

        <div>
          <p className="text-foreground-muted text-sm">
            {siteConfig.availability} · {siteConfig.location}
          </p>
          <nav aria-label="Footer" className="mt-4">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground-muted hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1 lg:items-end">
          <div className="flex items-center gap-5">
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
