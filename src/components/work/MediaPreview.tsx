"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import type { Media } from "@/types";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

/* Save-Data is set by data-saver modes, which in-app browsers on metered
   connections often run under. Read once — it doesn't change mid-visit. */
function subscribeNoop() {
  return () => {};
}
function getSaveData() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}
function getServerSaveData() {
  return false;
}

/**
 * A card's preview frame.
 *
 * Video costs nothing until it's needed: `preload="none"` means no bytes are
 * fetched on page load, and an IntersectionObserver plays the clip only while
 * the card is on screen and pauses it the moment it leaves — so a page of six
 * cards is never decoding six videos at once, which matters on a mid-range
 * phone inside the Instagram browser.
 *
 * Under prefers-reduced-motion or Save-Data the <video> is never rendered at
 * all; the poster stands in for it.
 */
export function MediaPreview({
  media,
  sizes,
  priority = false,
  className,
}: {
  media?: Media;
  /** `sizes` for the poster/image, matching the grid slot it sits in. */
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const saveData = useSyncExternalStore(subscribeNoop, getSaveData, getServerSaveData);
  const videoRef = useRef<HTMLVideoElement>(null);

  const playVideo = media?.type === "video" && !reduceMotion && !saveData;

  useEffect(() => {
    const video = videoRef.current;
    if (!playVideo || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Rejects under iOS Low Power Mode and some in-app browsers that
          // block autoplay outright. The poster is already showing, so the
          // right response is to do nothing.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [playVideo]);

  return (
    <div
      className={cn(
        "border-border-strong bg-background-elevated relative aspect-[16/10] overflow-hidden border-2",
        className,
      )}
    >
      {!media ? (
        <div className="bg-grid flex h-full w-full items-center justify-center">
          <span className="text-foreground-subtle font-mono text-xs tracking-[0.16em] uppercase">
            Preview coming
          </span>
        </div>
      ) : playVideo ? (
        <video
          ref={videoRef}
          src={media.src}
          poster={media.type === "video" ? media.poster : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-label={media.alt}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <Image
          src={media.type === "video" ? media.poster : media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      )}
    </div>
  );
}
