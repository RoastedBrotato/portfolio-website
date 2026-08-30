"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { navLinks } from "@/data/nav";
import { siteConfig } from "@/data/config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

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
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          className="font-display group flex items-baseline gap-2 text-lg italic text-foreground"
          onClick={() => setOpen(false)}
        >
          <span>{siteConfig.initials}</span>
          <span className="h-1 w-1 rounded-full bg-accent transition-transform group-hover:scale-125" />
          <span className="hidden font-mono text-xs not-italic tracking-[0.15em] text-foreground-muted uppercase sm:inline">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
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
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-foreground md:hidden"
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
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-lg font-medium text-foreground transition-colors hover:bg-background-elevated"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex items-center gap-5 px-3">
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
