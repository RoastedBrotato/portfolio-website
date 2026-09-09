"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { navLinks } from "@/data/nav";
import { siteConfig } from "@/data/config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useCommandPalette } from "@/components/CommandPalette";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
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

        <nav className="hidden items-center gap-8 md:flex">
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

        <div className="hidden items-center gap-5 md:flex">
          <SearchTrigger />
          <ThemeToggle />
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-foreground-muted transition-colors hover:text-foreground"
          >
            <GithubIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-foreground-muted transition-colors hover:text-foreground"
          >
            <LinkedinIcon className="h-[18px] w-[18px]" />
          </a>
          <Button href="/#contact" size="md">
            Let&apos;s Talk
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center border-2 border-border-strong text-foreground md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t-2 border-border-strong bg-background md:hidden"
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
                <ThemeToggle />
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-foreground-muted"
                >
                  <GithubIcon className="h-5 w-5" />
                </a>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-foreground-muted"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              </div>
              <div className="mt-2 px-3">
                <Button href="/#contact" className="w-full" onClick={() => setOpen(false)}>
                  Let&apos;s Talk
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
