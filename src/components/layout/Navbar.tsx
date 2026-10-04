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
        "flex h-9 w-9 items-center justify-center text-foreground-muted transition-colors hover:text-foreground",
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
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled || open
          ? "border-b-2 border-border-strong bg-background/90 backdrop-blur-md"
          : "border-b-2 border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-mono text-sm font-bold uppercase tracking-[0.08em] text-foreground"
          onClick={() => setOpen(false)}
        >
          {siteConfig.name}
          <span className="h-2 w-2 bg-accent transition-transform duration-300 group-hover:scale-150" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative font-mono text-xs uppercase tracking-[0.12em] text-foreground-muted transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <SearchTrigger />
          {/* Socials only once there's room; below xl they live in the footer and the menu. */}
          <span className="hidden items-center gap-5 xl:flex">
            <SocialLinks linkClassName="text-foreground-muted transition-colors hover:text-foreground" />
          </span>
          <Button href="/quote" size="md">
            Get a quote
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center border-2 border-border-strong text-foreground lg:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Container>

      {/* Scroll progress: a 2px red line on the header's bottom rule. */}
      <m.div
        aria-hidden
        style={{ scaleX: progress }}
        className="bg-accent absolute inset-x-0 -bottom-0.5 h-0.5 origin-left"
      />

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t-2 border-border-strong bg-background lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 font-mono text-base font-bold uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-background-elevated"
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
                  Get a quote
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
