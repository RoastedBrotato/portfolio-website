"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Media } from "@/types";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

/** Only what the list renders. */
export type ListItem = {
  slug: string;
  title: string;
  kind?: string;
  location?: string;
  href?: string;
  caseStudy?: string;
  media?: Media;
  shots?: { desktop: string; mobile: string };
};

const EASE = [0.16, 1, 0.3, 1] as const;

function PreviewMedia({ item, reduceMotion }: { item: ListItem; reduceMotion: boolean }) {
  const video = item.media?.type === "video" && !reduceMotion ? item.media : null;
  const still = item.shots?.desktop ?? (item.media?.type === "video" ? item.media.poster : item.media?.src);
  if (video) {
    return (
      <video
        src={video.src}
        poster={video.poster}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        aria-hidden
        className="h-full w-full object-cover object-top"
      />
    );
  }
  if (!still) return null;
  return <Image src={still} alt="" fill sizes="420px" className="object-cover object-top" />;
}

/**
 * The work as a list of names. On a desktop, the site appears beside the
 * pointer as you move down the names — a clip where there is one, a capture
 * otherwise — and tilts a little with the pointer's speed. On a phone, where
 * there is no hover, each row carries its own thumbnail.
 */
export function HoverList({ items }: { items: ListItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [fine, setFine] = useState(false);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tilt = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 320, damping: 32, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 320, damping: 32, mass: 0.6 });
  const st = useSpring(tilt, { stiffness: 160, damping: 20 });
  const last = useRef<{ x: number; t: number } | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  function onMove(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    x.set(event.clientX);
    y.set(event.clientY);
    const now = performance.now();
    if (last.current) {
      const dt = Math.max(now - last.current.t, 1);
      const v = (event.clientX - last.current.x) / dt; // px per ms
      tilt.set(Math.max(-10, Math.min(10, v * 14)));
    }
    last.current = { x: event.clientX, t: now };
  }

  const current = active !== null ? items[active] : null;
  const showPreview = fine && current !== null;

  return (
    <div onPointerMove={onMove} onPointerLeave={() => { setActive(null); tilt.set(0); }}>
      <ul className="border-t">
        {items.map((item, i) => {
          const href = item.href ?? item.caseStudy ?? "#";
          const external = Boolean(item.href);
          const thumb = item.shots?.desktop ?? (item.media?.type === "video" ? item.media.poster : item.media?.src);
          const isActive = active === i;
          return (
            <li key={item.slug} className="border-b">
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                onPointerEnter={(e) => { if (e.pointerType === "mouse") setActive(i); }}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 sm:gap-x-6 lg:grid-cols-[minmax(0,1fr)_auto_auto]"
              >
                {/* Phone and tablet only: the thumbnail, since there is no hover to reveal it. */}
                {thumb ? (
                  <span className="border-border relative my-4 block aspect-[16/10] w-24 overflow-hidden rounded-md border sm:w-32 lg:hidden">
                    <Image src={thumb} alt="" fill sizes="128px" className="object-cover object-top" />
                  </span>
                ) : (
                  <span className="lg:hidden" />
                )}

                <span className="min-w-0 py-5 sm:py-6 lg:py-7">
                  <span
                    className={cn(
                      "font-display text-foreground block text-[clamp(1.625rem,3.4vw,3rem)] transition-[transform,color] duration-300 ease-out",
                      isActive && "text-accent lg:translate-x-3",
                    )}
                  >
                    {item.title}
                  </span>
                  <span className="text-foreground-muted mt-1 block text-sm lg:hidden">
                    {[item.kind, item.location].filter(Boolean).join(" · ")}
                  </span>
                </span>

                <span className="text-foreground-muted hidden text-sm lg:block lg:pr-8">
                  {[item.kind, item.location].filter(Boolean).join(" · ")}
                </span>

                <span className="border-border text-foreground flex h-full items-center border-l py-5 pl-4 sm:pl-6 lg:pl-8">
                  <ArrowUpRight
                    size={26}
                    strokeWidth={1.75}
                    className={cn("transition-transform duration-300 ease-out", isActive && "-translate-y-0.5 translate-x-0.5")}
                  />
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {/* The floating preview, desktop only. Fixed, so it rides over the list and never pushes it. */}
      {fine ? (
        <m.div
          aria-hidden
          style={{ x: sx, y: sy, rotate: st }}
          className="pointer-events-none fixed top-0 left-0 z-40 hidden lg:block"
        >
          <AnimatePresence>
            {showPreview && current ? (
              <m.div
                key={current.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="border-border-strong bg-background-elevated absolute top-0 left-0 aspect-[16/10] w-[22vw] max-w-[440px] min-w-[300px] translate-x-7 -translate-y-1/2 overflow-hidden rounded-[var(--radius)] border shadow-[0_30px_60px_-16px_rgba(22,19,15,0.35)]"
              >
                <PreviewMedia item={current} reduceMotion={reduceMotion} />
              </m.div>
            ) : null}
          </AnimatePresence>
        </m.div>
      ) : null}
    </div>
  );
}
