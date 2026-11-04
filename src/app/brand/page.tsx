import type { Metadata } from "next";
import { Download } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Logo, Mark } from "@/components/brand/Logo";
import { brand } from "@/data/brand";
import { siteConfig } from "@/data/config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Brand",
  description:
    "The Waleed Ajaz mark, lockup, colours and type, with the files to use them: for a byline, a talk, a client's vendor page or a post.",
  path: "/brand",
});

/*
 * The press-kit page: everything someone needs to put the name somewhere
 * else — the mark on each of its grounds, the lockup, the palette, the two
 * faces, a few rules and the files. It is drawn from the same components and
 * tokens as the rest of the site, so it can't drift from it.
 */

const grounds = [
  { name: "On paper", className: "bg-background", tone: "ink" },
  { name: "On cobalt", className: "bg-accent", tone: "paper" },
  { name: "On ink", className: "bg-foreground", tone: "ink" },
  { name: "On a pop colour", className: "bg-pop-yellow", tone: "ink" },
] as const;

const colours = [
  { name: "Paper", value: brand.paper, role: "The page" },
  { name: "Ink", value: brand.ink, role: "Text, outlines" },
  { name: "Cobalt", value: brand.cobalt, role: "The mark, every action" },
  { name: "Red", value: brand.pop.red, role: "Objects only" },
  { name: "Purple", value: brand.pop.purple, role: "Objects only" },
  { name: "Yellow", value: brand.pop.yellow, role: "Objects only" },
  { name: "Pink", value: brand.pop.pink, role: "Objects only" },
  { name: "Lime", value: brand.pop.lime, role: "Objects only" },
  { name: "Blue", value: brand.pop.blue, role: "Objects only" },
];

const rules = [
  "Draw the mark from the file, don't redraw it. The outline, the gloss and the round caps are the drawing.",
  "Keep clear space around it of at least the height of one stroke. Nothing touches the W.",
  "Cobalt on paper is the default. On cobalt, ink or a pop colour, use the paper version.",
  "One colour only when the context is one colour: the mono file, in whatever that colour is.",
  "Never skew, tilt, crop or add a drop shadow. A tilt is a motion, not a pose.",
  "The name is set in Bricolage Grotesque at 800, tight. No other face, no other weight.",
];

const files = [
  { name: "mark.svg", note: "Cobalt on an ink outline, transparent background", href: "/brand/mark.svg" },
  { name: "mark-on-cobalt.svg", note: "Paper mark on a rounded cobalt tile", href: "/brand/mark-on-cobalt.svg" },
  { name: "mark-mono.svg", note: "One ink stroke, no outline", href: "/brand/mark-mono.svg" },
  { name: "mark.png", note: "1024 × 1024 on paper", href: "/brand/mark.png" },
  { name: "logo.png", note: "The lockup, 1600 × 480 on paper", href: "/brand/logo.png" },
];

export default function BrandPage() {
  return (
    <>
      <PageHeader
        label="Brand"
        title="The mark, the name and the colours."
        intro="A W drawn as one stroke, the way the wordmark draws its letters as things: cobalt over ink, round caps, a gloss. Use it as it is, from the files at the bottom."
      />

      <Section id="mark" label="The mark" index={1}>
        <div className="grid grid-cols-2 gap-px border border-border-strong bg-border-strong lg:grid-cols-4">
          {grounds.map((ground) => (
            <figure key={ground.name} className={cn("flex aspect-square flex-col justify-between p-5", ground.className)}>
              <Mark tone={ground.tone} label={`${siteConfig.name} mark, ${ground.name.toLowerCase()}`} className="mx-auto mt-auto mb-auto h-[38%] w-auto" />
              <figcaption
                className={cn(
                  "text-xs font-medium tracking-[0.1em] uppercase",
                  ground.className === "bg-background" || ground.className === "bg-pop-yellow"
                    ? "text-foreground-subtle"
                    : "text-background/70",
                )}
              >
                {ground.name}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-end gap-8">
          {[16, 24, 32, 48, 72].map((px) => (
            <div key={px} className="flex flex-col items-center gap-3">
              <Mark className="w-auto" label={`${siteConfig.name} mark at ${px}px`} style={{ height: px }} />
              <span className="text-foreground-subtle font-mono text-xs tabular-nums">{px}px</span>
            </div>
          ))}
          <p className="text-foreground-muted max-w-[36ch] text-sm leading-relaxed">
            Four points of a zigzag is the whole drawing, so it holds in a browser tab as well as on a wall.
          </p>
        </div>
      </Section>

      <Section id="lockup" label="The lockup" index={2} tone="plane-1">
        <div className="border-border-strong flex flex-col gap-10 border-y py-12">
          <Logo className="text-foreground text-[clamp(2rem,6vw,4.5rem)]" />
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
            <Logo className="text-foreground text-[17px]" />
            <Logo className="text-foreground text-[14px]" />
            <div className="flex flex-col items-start gap-3">
              <Mark className="h-10 w-auto" />
              <span className="wordmark text-foreground text-2xl">{siteConfig.name}</span>
              <span className="text-foreground-subtle text-xs font-medium tracking-[0.1em] uppercase">
                {siteConfig.role}
              </span>
            </div>
          </div>
        </div>
        <p className="text-foreground-muted mt-6 max-w-[52ch] text-base leading-relaxed">
          The mark sits beside the name at 1.3× its cap height, half an em apart; the navbar runs it at 17px and the
          footer at 16px. Stacked, the role goes under the name in the label style.
        </p>
      </Section>

      <Section id="colour" label="Colour" index={3}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {colours.map((colour) => (
            <li key={colour.name} className="border-border-strong overflow-hidden rounded-md border">
              <div className="aspect-[5/3]" style={{ background: colour.value }} />
              <div className="bg-background flex items-baseline justify-between gap-3 px-3 py-2.5">
                <span className="text-foreground text-sm font-medium">{colour.name}</span>
                <span className="text-foreground-subtle font-mono text-xs">{colour.value}</span>
              </div>
              <p className="text-foreground-muted bg-background border-t px-3 py-2 text-xs">{colour.role}</p>
            </li>
          ))}
        </ul>
        <p className="text-foreground-muted mt-6 max-w-[52ch] text-base leading-relaxed">
          Paper, ink and one cobalt do the work. The six pop colours belong to objects — the wordmark&apos;s, the
          disciplines&apos; — and never to text or to anything you can click.
        </p>
      </Section>

      <Section id="type" label="Type" index={4} tone="plane-1">
        <div className="border-border-strong divide-border divide-y border-y">
          <div className="grid gap-4 py-8 sm:grid-cols-[10rem_1fr]">
            <p className="text-foreground-subtle text-xs font-medium tracking-[0.1em] uppercase">Headlines</p>
            <div>
              <p className="font-display text-h2 text-foreground">Make it interesting. Make it work.</p>
              <p className="text-foreground-muted mt-3 text-sm">Bricolage Grotesque, 800, −0.03em, leading 0.95.</p>
            </div>
          </div>
          <div className="grid gap-4 py-8 sm:grid-cols-[10rem_1fr]">
            <p className="text-foreground-subtle text-xs font-medium tracking-[0.1em] uppercase">Text</p>
            <div>
              <p className="text-foreground max-w-[44ch] text-lg leading-relaxed">
                A bit of 3D, art and motion design, and a lot of software and web development.
              </p>
              <p className="text-foreground-muted mt-3 text-sm">Geist, 400 and 500. Labels are small, uppercase, spaced.</p>
            </div>
          </div>
          <div className="grid gap-4 py-8 sm:grid-cols-[10rem_1fr]">
            <p className="text-foreground-subtle text-xs font-medium tracking-[0.1em] uppercase">Data</p>
            <div>
              <p className="text-foreground font-mono text-lg tabular-nums">1200 × 630 · PKR 185,000 · 2026-11-03</p>
              <p className="text-foreground-muted mt-3 text-sm">Geist Mono, only on prices, dimensions and dates.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="rules" label="Rules" index={5}>
        <ol className="border-border-strong divide-border max-w-2xl divide-y border-y">
          {rules.map((rule, i) => (
            <li key={rule} className="flex gap-5 py-4">
              <span className="text-foreground-subtle font-mono text-xs tabular-nums leading-6">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-foreground text-base leading-6">{rule}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="files" label="Files" index={6} tone="plane-1">
        <ul className="border-border-strong divide-border max-w-2xl divide-y border-y">
          {files.map((file) => (
            <li key={file.href}>
              <a
                href={file.href}
                download
                className="group flex items-center justify-between gap-6 py-4"
              >
                <span>
                  <span className="text-foreground group-hover:text-accent block font-mono text-sm transition-colors">
                    {file.name}
                  </span>
                  <span className="text-foreground-muted mt-1 block text-sm">{file.note}</span>
                </span>
                <Download size={18} className="text-foreground-subtle group-hover:text-accent shrink-0 transition-colors" />
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
