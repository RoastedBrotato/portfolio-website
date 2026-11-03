import { cn } from "@/lib/utils";

/*
 * "creative developer", with five of the letters in "creative" swapped for
 * things: a red ring for the c, a purple cube for the a, a yellow cross for
 * the t, a bouncing red dot on the i, a lime squiggle for the v. The letters
 * that stay are the display face at 800. Everything is inline SVG and CSS, so
 * it paints with the page and costs nothing to keep moving.
 *
 * Both lines are centred, so the mark sits in the middle of the hero.
 * Each object is drawn to the metrics of the letter it replaces — x-height
 * for c, a and v, ascender height for t and the i's dot — and the row aligns
 * on the baseline, so the word keeps a word's rhythm at every size instead of
 * turning into a row of toys on a phone. Every object carries an ink outline
 * so it holds on paper. Screen readers get the plain text.
 */

const INK = "var(--foreground)";
const GLOSS = "rgba(255, 255, 255, 0.8)";

function RingC({ className }: { className?: string }) {
  // A fat C: the same 260° arc twice, ink wide underneath, red on top. The
  // opening is wide so the heavy stroke can't close it into an o.
  const arc = "M70 22A34 34 0 1 0 70 78";
  return (
    <svg viewBox="0 0 100 100" className={cn("h-[0.6em] w-[0.6em] overflow-visible", className)} aria-hidden>
      <path d={arc} fill="none" stroke={INK} strokeWidth="34" strokeLinecap="round" />
      <path d={arc} fill="none" stroke="var(--pop-red)" strokeWidth="26" strokeLinecap="round" />
      <path d="M28 36c5-8 13-13 22-14" fill="none" stroke={GLOSS} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function CubeA({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("h-[0.62em] w-[0.62em] overflow-visible", className)} aria-hidden>
      <g stroke={INK} strokeWidth="4" strokeLinejoin="round">
        {/* top */}
        <path d="M50 4 96 27 50 50 4 27z" fill="#b89cff" />
        {/* left */}
        <path d="M4 27v46l46 23V50z" fill="var(--pop-purple)" />
        {/* right */}
        <path d="M96 27v46L50 96V50z" fill="#5a2fe0" />
      </g>
      {/* the hole, so it reads as an a */}
      <path d="M50 52 70 42v20L50 72z" fill="var(--background)" />
      <path d="M50 52 30 42v20l20 10z" fill="#2a1468" />
    </svg>
  );
}

function CrossT({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("h-[0.68em] w-[0.6em] overflow-visible", className)} aria-hidden>
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

function DotI({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex h-[0.74em] w-[0.3em] items-end justify-center", className)} aria-hidden>
      <span className="bg-foreground block h-[0.52em] w-[0.19em] rounded-[0.04em]" />
      <span className="glyph-bounce bg-pop-red absolute top-0 h-[0.2em] w-[0.2em] rounded-full border-[0.02em] border-foreground" />
    </span>
  );
}

function WaveV({ className }: { className?: string }) {
  // Drawn edge to edge of the box, so the e that follows sits as close as it would to a v.
  const wave = "M14 14c7 0 10 6 12 16s6 36 14 48c4 6 10 6 14 0 8-12 12-38 14-48s5-16 12-16";
  return (
    <svg viewBox="0 0 100 100" className={cn("h-[0.58em] w-[0.58em] overflow-visible", className)} aria-hidden>
      <path d={wave} fill="none" stroke={INK} strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
      <path d={wave} fill="none" stroke="var(--pop-lime)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A letter that stayed a letter. */
function L({ children }: { children: string }) {
  return <span className="text-foreground">{children}</span>;
}

/** Wraps an object so it can wobble on its own and swell under the pointer. */
function Obj({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-end leading-none transition-transform duration-300 ease-out hover:scale-110 hover:-rotate-6",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="creative developer"
      className={cn(
        "font-display text-[clamp(2.75rem,15vw,10.5rem)] leading-[0.88] select-none text-center",
        className,
      )}
    >
      {/* items-baseline: an object with no text sits its bottom edge on the letters' baseline. */}
      <div className="flex items-baseline justify-center">
        <Obj className="glyph-wobble mr-[0.02em]">
          <RingC />
        </Obj>
        <L>r</L>
        <L>e</L>
        <Obj className="mx-[0.02em]">
          <CubeA className="glyph-wobble" />
        </Obj>
        <Obj className="mx-[0.01em]">
          <CrossT className="glyph-tilt" />
        </Obj>
        <Obj className="mx-[0.02em]">
          <DotI />
        </Obj>
        <Obj className="-mr-[0.04em]">
          <WaveV className="glyph-wave" />
        </Obj>
        <L>e</L>
      </div>
      <div className="text-foreground">developer</div>
    </div>
  );
}
