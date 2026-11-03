"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m, useScroll, useSpring } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { navLinks } from "@/data/nav";
import { siteConfig } from "@/data/config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { useCommandPalette } from "@/components/CommandPalette";
import { useLenis } from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";

function SearchTrigger({
  className,
  onBeforeOpen,
}: {
  className?: string;
  onBeforeOpen?: () => void;
}) {
  const { setOpen } = useCommandPalette();

  return (
    <button
      type="button"
      aria-label="Search"
      onClick={() => {
        onBeforeOpen?.();
        setOpen(true);
      }}
      className={cn(
        "text-foreground-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-md transition-colors",
        className,
      )}
    >
      <Search size={17} />
    </button>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll();
  // A spring, not the raw value: Lenis already eases the scroll, and this only
  // has to keep the line from stepping on a wheel tick.
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /*
   * Holding the page still behind the open menu has to go through Lenis, not
   * through `overflow: hidden`. Lenis preventDefault()s the wheel and then
   * scrolls the window itself, and `overflow: hidden` only stops *user* scroll
   * — programmatic scrolling still lands, so the article slid past underneath
   * the menu. lenis.stop() halts that, and the `lenis-stopped` class it sets
   * puts `overflow: clip` on <html> (lenis.css) to catch the scrollbar and
   * arrow keys as well.
   */
  useEffect(() => {
    if (!open) return;

    if (lenis) {
      lenis.stop();
      return () => lenis.start();
    }

    // Reduced motion means no Lenis, so the native lock is the only lock.
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

  return (
    <header
      // Named so page transitions leave it in place (see globals.css).
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-300",
        scrolled || open ? "bg-background/85 border-border backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          className="text-foreground group flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]"
          onClick={() => setOpen(false)}
        >
          {siteConfig.name}
          <span className="bg-accent h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-150" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground-muted hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <SearchTrigger />
          {/* Socials only once there's room; below xl they live in the footer and the menu. */}
          <span className="hidden items-center gap-4 xl:flex">
            <SocialLinks linkClassName="text-foreground-muted transition-colors hover:text-foreground" />
          </span>
          <Button href="/quote" size="md">
            Start a project
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="border-border-strong text-foreground flex h-11 w-11 items-center justify-center rounded-md border lg:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Container>

      {/* Scroll progress: a hairline of red on the header's bottom rule. */}
      <m.div
        aria-hidden
        style={{ scaleX: progress }}
        className="bg-accent absolute inset-x-0 -bottom-px h-px origin-left"
      />

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-background overflow-hidden border-t lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-foreground hover:bg-background-elevated rounded-md px-3 py-3 text-lg font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex items-center gap-5 px-3">
                <SearchTrigger onBeforeOpen={() => setOpen(false)} />
                <SocialLinks
                  linkClassName="text-foreground-muted"
                  iconClassName="h-5 w-5"
                />
              </div>
              <div className="mt-2 flex flex-col gap-3 px-3">
                <Button href="/quote" className="w-full" onClick={() => setOpen(false)}>
                  Start a project
                </Button>
                <BookCallButton
                  placement="mobile-menu"
                  size="md"
                  className="w-full"
                  onClick={() => setOpen(false)}
                />
              </div>
            </Container>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
