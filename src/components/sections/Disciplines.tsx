import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/*
 * What the work is made of, as an index: five rows edge to edge, each a
 * number, the discipline as a big word, an object from the wordmark's
 * vocabulary beside it, and one line on the right. The rows share the hero's
 * language (fat shapes, ink outline, one pop colour each), so the objects
 * read as part of the brand rather than scribbles. Hover a row and its word
 * takes the object's colour.
 */

const INK = "var(--foreground)";
const GLOSS = "rgba(255, 255, 255, 0.8)";

function Cube() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <g stroke={INK} strokeWidth="4" strokeLinejoin="round">
        <path d="M50 4 96 27 50 50 4 27z" fill="#b89cff" />
        <path d="M4 27v46l46 23V50z" fill="var(--pop-purple)" />
        <path d="M96 27v46L50 96V50z" fill="#5a2fe0" />
      </g>
    </svg>
  );
}

function Ring() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <circle cx="50" cy="50" r="33" fill="none" stroke={INK} strokeWidth="34" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="var(--pop-red)" strokeWidth="26" />
      <path d="M28 36c5-8 13-13 22-14" fill="none" stroke={GLOSS} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function Wave() {
  const wave = "M8 50c10-30 22-30 32 0s22 30 32 0 14-30 20-20";
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <path d={wave} fill="none" stroke={INK} strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
      <path d={wave} fill="none" stroke="var(--pop-lime)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <path
        d="M36 4h28v32h32v28H64v32H36V64H4V36h32z"
        fill="var(--pop-yellow)"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M43 13h14" stroke={GLOSS} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function Pill() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <rect x="4" y="26" width="92" height="48" rx="24" fill="var(--pop-pink)" stroke={INK} strokeWidth="5" />
      <path d="M22 40c6-4 14-6 24-6" fill="none" stroke={GLOSS} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

const DISCIPLINES: { word: string; line: string; color: string; object: React.ReactNode; motion: string }[] = [
  {
    word: "3D",
    line: "Product configurators and scroll-driven scenes, in the browser, fast on a phone.",
    color: "var(--pop-purple)",
    object: <Cube />,
    motion: "group-hover:-rotate-12",
  },
  {
    word: "Art",
    line: "Illustration, type and the visual direction a brand needs before anything gets built.",
    color: "var(--pop-red)",
    object: <Ring />,
    motion: "group-hover:rotate-45",
  },
  {
    word: "Motion",
    line: "Reels, animated interfaces and video for socials, made in code so they can change.",
    color: "var(--pop-lime)",
    object: <Wave />,
    motion: "group-hover:skew-x-12",
  },
  {
    word: "Software",
    line: "Web apps, dashboards and the backends under them. The part most studios send away.",
    color: "var(--pop-yellow)",
    object: <Cross />,
    motion: "group-hover:rotate-90",
  },
  {
    word: "Web",
    line: "Sites in English and Arabic, from the first pixel to the live URL, in weeks.",
    color: "var(--pop-pink)",
    object: <Pill />,
    motion: "group-hover:-rotate-6",
  },
];

export function Disciplines({ id = "what-i-do", className }: { id?: string; className?: string }) {
  return (
    <section id={id} className={cn("scroll-mt-20 border-t py-16 sm:py-24", className)}>
      <Container>
        <Reveal className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
          <h2 className="font-display text-h2 text-foreground max-w-[18ch]">
            From the first sketch to the live URL.
          </h2>
          <p className="text-foreground-muted max-w-[44ch] text-lg leading-relaxed">
            One person does the visual, the motion and the build, so nothing gets lost between a
            designer and a developer.
          </p>
        </Reveal>

        <ol className="mt-12 border-t sm:mt-16">
          {DISCIPLINES.map((item, i) => (
            <li key={item.word} className="border-b">
              <Reveal
                delay={Math.min(i * 0.05, 0.2)}
                className="group grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-3 py-6 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-6 sm:py-8 lg:grid-cols-[3.5rem_minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-10"
              >
                <span className="font-mono text-foreground-subtle self-start pt-2 text-xs tabular-nums sm:text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="flex items-center gap-[0.2em] text-[clamp(2.5rem,6vw,5rem)]">
                  <span
                    className="font-display text-foreground leading-[0.9] transition-colors duration-300 group-hover:text-[var(--row-color)]"
                    style={{ "--row-color": item.color } as React.CSSProperties}
                  >
                    {item.word}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "inline-block h-[0.6em] w-[0.6em] shrink-0 transition-transform duration-500 ease-out group-hover:scale-110",
                      item.motion,
                    )}
                  >
                    {item.object}
                  </span>
                </span>

                <p className="text-foreground-muted col-start-2 mt-3 max-w-[44ch] text-base leading-relaxed sm:text-lg lg:col-start-3 lg:mt-0">
                  {item.line}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
