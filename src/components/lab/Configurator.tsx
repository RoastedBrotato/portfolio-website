"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { useSceneTier } from "@/lib/useSceneTier";
import { COLORWAYS, type Colorway } from "@/components/scene/speaker/colorways";
import { cn } from "@/lib/utils";

const ConfiguratorScene = dynamic(() => import("@/components/scene/speaker/ConfiguratorScene"), {
  ssr: false,
});

const SPECS: [string, string][] = [
  ["Drivers", "6.5″ woofer, 1″ dome tweeter"],
  ["Amplification", "2 × 60 W, class D"],
  ["Response", "45 Hz – 22 kHz"],
  ["Inputs", "USB-C audio, optical, line in"],
  ["Size", "210 × 130 × 120 mm"],
];

const control =
  "border-border-strong text-foreground hover:bg-background-elevated-hover inline-flex h-11 items-center justify-center gap-2 border-2 px-4 font-mono text-xs font-bold tracking-[0.12em] uppercase transition-colors";

/**
 * The Interactive 3D package as a working piece: a product you can turn,
 * recolour and open up, with a scripted camera move on arrival.
 *
 * Devices that can't run it get the poster frame, labelled as a still.
 */
export function Configurator() {
  const tier = useSceneTier();
  const [colorway, setColorway] = useState<Colorway>("graphite");
  const [exploded, setExploded] = useState(false);
  const [tour, setTour] = useState(0);
  const [ready, setReady] = useState(false);

  const scene = tier?.kind === "scene";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem]">
      <div className="border-border-strong bg-plane-2 relative aspect-[4/5] border-b-2 sm:aspect-[16/10] lg:border-r-2 lg:border-b-0">
        {scene ? (
          <div className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
            <ConfiguratorScene
              quality={tier.quality}
              colorway={colorway}
              exploded={exploded}
              tour={tour}
              onReady={() => setReady(true)}
            />
          </div>
        ) : null}

        {tier?.kind === "fallback" ? (
          <>
            <Image
              src="/lab/configurator/poster.jpg"
              alt="Quarr One speaker in Graphite, three-quarter view"
              fill
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="object-cover"
            />
            <p className="bg-background/80 text-foreground-muted absolute bottom-4 left-4 px-3 py-2 font-mono text-[11px] tracking-[0.14em] uppercase">
              Still frame · this device can&apos;t run the 3D
            </p>
          </>
        ) : null}

        {scene && !ready ? (
          <p className="text-foreground-subtle absolute inset-0 flex items-center justify-center font-mono text-xs tracking-[0.16em] uppercase">
            Loading scene
          </p>
        ) : null}

        {scene ? (
          <p className="text-foreground-subtle pointer-events-none absolute top-4 left-4 font-mono text-[11px] tracking-[0.14em] uppercase">
            Drag to turn
          </p>
        ) : null}
      </div>

      <aside className="flex flex-col gap-8 p-6 sm:p-8">
        <div>
          <p className="text-accent font-mono text-xs font-bold tracking-[0.16em] uppercase">Quarr One</p>
          <h2 className="font-display text-foreground mt-2 text-3xl font-bold tracking-tight">
            {COLORWAYS[colorway].label}
          </h2>
        </div>

        <fieldset>
          <legend className="text-foreground-subtle font-mono text-[11px] tracking-[0.14em] uppercase">
            Colourway
          </legend>
          <div className="mt-3 flex gap-3">
            {(Object.keys(COLORWAYS) as Colorway[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={colorway === key}
                aria-label={COLORWAYS[key].label}
                onClick={() => setColorway(key)}
                className={cn(
                  "h-11 w-11 border-2 transition-transform",
                  colorway === key ? "border-accent scale-110" : "border-border-strong hover:scale-105",
                )}
                style={{ background: COLORWAYS[key].body }}
              />
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            aria-pressed={exploded}
            onClick={() => setExploded((v) => !v)}
            disabled={!scene}
            className={cn(control, exploded && "border-accent text-accent", "disabled:opacity-40")}
          >
            {exploded ? "Close it up" : "Look inside"}
          </button>
          <button
            type="button"
            onClick={() => setTour((n) => n + 1)}
            disabled={!scene || tier?.quality === "still"}
            className={cn(control, "disabled:opacity-40")}
          >
            <RotateCcw size={14} aria-hidden />
            Replay
          </button>
        </div>

        <dl className="border-border-strong divide-border divide-y border-t-2">
          {SPECS.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-6 py-3">
              <dt className="text-foreground-subtle font-mono text-[11px] tracking-[0.14em] uppercase">{label}</dt>
              <dd className="text-foreground text-right text-sm">{value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
