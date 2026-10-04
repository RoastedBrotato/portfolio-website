"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Must match `.bg-grid`'s background-size in globals.css, so filled cells land exactly in its squares. */
const CELL = 48;
/** How far the pointer's light spreads, in cells. */
const RADIUS = 2.2;
/** Fraction of a cell's light left after one second. */
const DECAY_PER_SECOND = 0.04;
/** Peak alpha of a fully lit cell — kept low so the type on top stays the loudest thing. */
const MAX_ALPHA = 0.55;
/** One ambient cell every this-many ms, so the grid reads as live on touch screens too. */
const AMBIENT_MS = 900;

/**
 * The hero's 2D tier: the `.bg-grid` squares behind the headline fill with
 * accent red around the pointer and fade out behind it. HeroBackdrop uses it
 * where WebGL is missing or the device is too weak for the slab scene.
 *
 * Restrained by construction:
 *   - One 2D canvas, no library. ~500 cells on a desktop hero, so a full
 *     redraw is a handful of fillRects.
 *   - The animation loop only runs while something is lit. Once every cell has
 *     faded, it stops until the next pointer move or ambient blip.
 *   - Off-screen or in a background tab, nothing runs at all.
 *   - prefers-reduced-motion renders nothing; the static grid stays.
 *   - pointer-events: none on the canvas, so it never gets between a visitor
 *     and the buttons — the listener sits on the hero itself.
 */
export function HeroGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (reduceMotion || !canvas || !host || !ctx) return;

    let cols = 0;
    let rows = 0;
    let energy = new Float32Array(0);
    let color = "#ff2b1f";
    let frame = 0;
    let last = 0;
    // On screen *and* in a foreground tab. Tracked separately because the
    // IntersectionObserver doesn't re-fire when a tab comes back to the front.
    let intersecting = false;
    let visible = false;
    let ambientTimer = 0;

    function resize() {
      // Capped at 2: a 3x phone would triple the fill cost for no visible gain on flat squares.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = host!.getBoundingClientRect();
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      energy = new Float32Array(cols * rows);
    }

    function draw(now: number) {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
      last = now;
      const keep = Math.pow(DECAY_PER_SECOND, dt);

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.fillStyle = color;

      let lit = false;
      for (let i = 0; i < energy.length; i++) {
        const e = energy[i];
        if (e < 0.01) {
          energy[i] = 0;
          continue;
        }
        lit = true;
        const x = (i % cols) * CELL;
        const y = Math.floor(i / cols) * CELL;
        ctx!.globalAlpha = e * MAX_ALPHA;
        // Inset 1px so the grid's own lines stay visible between filled cells.
        ctx!.fillRect(x + 1, y + 1, CELL - 1, CELL - 1);
        energy[i] = e * keep;
      }
      ctx!.globalAlpha = 1;

      frame = lit && visible ? requestAnimationFrame(draw) : 0;
      if (!frame) last = 0;
    }

    function wake() {
      if (!frame && visible) frame = requestAnimationFrame(draw);
    }

    function light(cx: number, cy: number, strength = 1) {
      const span = Math.ceil(RADIUS);
      for (let dy = -span; dy <= span; dy++) {
        for (let dx = -span; dx <= span; dx++) {
          const x = cx + dx;
          const y = cy + dy;
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
          const falloff = 1 - Math.hypot(dx, dy) / RADIUS;
          if (falloff <= 0) continue;
          const i = y * cols + x;
          energy[i] = Math.max(energy[i], falloff * strength);
        }
      }
      wake();
    }

    function onPointerMove(event: PointerEvent) {
      const rect = host!.getBoundingClientRect();
      light(
        Math.floor((event.clientX - rect.left) / CELL),
        Math.floor((event.clientY - rect.top) / CELL),
      );
    }

    function ambient() {
      if (visible && cols && rows) {
        energy[Math.floor(Math.random() * energy.length)] = 0.6;
        wake();
      }
      ambientTimer = window.setTimeout(ambient, AMBIENT_MS);
    }

    function readColor() {
      color = getComputedStyle(canvas!).getPropertyValue("--accent").trim() || color;
    }

    resize();
    readColor();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    function updateVisible() {
      visible = intersecting && !document.hidden;
      if (visible) wake();
    }

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      updateVisible();
    });
    visibilityObserver.observe(host);

    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerdown", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", updateVisible);
    ambientTimer = window.setTimeout(ambient, AMBIENT_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(ambientTimer);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerdown", onPointerMove);
      document.removeEventListener("visibilitychange", updateVisible);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
