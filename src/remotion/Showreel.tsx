import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/*
 * The showreel: one scene per featured site, cut together in code. Each scene
 * is a desktop capture that drifts very slightly, a phone capture that lands
 * beside it, and the site's name set in the display serif.
 *
 * It is a Remotion composition, so the same file plays in the hero through
 * @remotion/player and renders to an MP4 for an Instagram or LinkedIn ad
 * (see src/remotion/Root.tsx). Nothing here reads the DOM or the clock: every
 * value is a function of the frame, which is what makes it renderable.
 */

export const REEL_FPS = 30;
/** 4.5 seconds per site: long enough to read the name and the page, short enough to keep moving. */
export const SCENE_FRAMES = 135;
export const REEL_WIDTH = 1600;
export const REEL_HEIGHT = 1000;

export type ReelItem = {
  title: string;
  /** One line under the title: what it is and where. */
  meta: string;
  /** 16:9 desktop capture. */
  desktop: string;
  /** 1:2 phone capture. */
  mobile: string;
};

export type ShowreelProps = {
  items: ReelItem[];
};

export function reelDuration(count: number) {
  return Math.max(1, count) * SCENE_FRAMES;
}

const ARRIVE = Easing.bezier(0.16, 1, 0.3, 1);
const LEAVE = Easing.in(Easing.cubic);
const IN = 20;
const OUT = 12;

const COLORS = {
  canvas: "#f6f0e4",
  elevated: "#ede5d5",
  fg: "#16130f",
  muted: "#57504a",
  line: "rgba(22, 19, 15, 0.16)",
  accent: "#2b3cf0",
};

const SERIF = "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif";
const SANS = "var(--font-geist-sans), Geist, system-ui, sans-serif";

/** The desktop frame: inset from the canvas edge, 16:9, hairline. */
const DESK = { x: 56, y: 56, w: 1184, h: 666, r: 14 };
/** The phone: bottom right, 1:2, with a thin bezel. */
const PHONE = { w: 236, h: 472, r: 34, right: 72, bottom: 72 };

function Scene({ item, index, count }: { item: ReelItem; index: number; count: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Arrive and leave: the leave is faster than the arrival and overlaps the
  // next scene's arrival by nothing, so the cut reads as a breath, not a hold.
  const arrive = interpolate(frame, [0, IN], [0, 1], {
    extrapolateRight: "clamp",
    easing: ARRIVE,
  });
  const leave = interpolate(frame, [SCENE_FRAMES - OUT, SCENE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: LEAVE,
  });
  const opacity = arrive * (1 - leave);
  const rise = (1 - arrive) * 28 - leave * 20;

  // A slow drift on the desktop capture so a still never reads as a still.
  const drift = interpolate(frame, [0, SCENE_FRAMES], [1.035, 1], {
    extrapolateRight: "clamp",
  });

  // The phone lands a beat after the desktop, on a critically damped spring.
  const phone = spring({
    frame: frame - 8,
    fps,
    config: { damping: 26, stiffness: 140, mass: 0.9 },
  });
  const phoneY = (1 - phone) * 140;

  // The title arrives a word at a time, from under a mask.
  const words = item.title.split(" ");

  // The progress segment for this scene fills over its length.
  const progress = interpolate(frame, [0, SCENE_FRAMES - OUT], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, transform: `translateY(${rise}px)` }}>
      {/* Progress: one segment per site, the current one filling. */}
      <div
        style={{
          position: "absolute",
          left: DESK.x,
          top: 24,
          width: DESK.w,
          display: "flex",
          gap: 6,
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: COLORS.line,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${i < index ? 100 : i === index ? progress * 100 : 0}%`,
                background: COLORS.accent,
              }}
            />
          </div>
        ))}
      </div>

      {/* Desktop capture. */}
      <div
        style={{
          position: "absolute",
          left: DESK.x,
          top: DESK.y,
          width: DESK.w,
          height: DESK.h,
          borderRadius: DESK.r,
          overflow: "hidden",
          border: `1px solid ${COLORS.line}`,
          background: COLORS.elevated,
        }}
      >
        <Img
          src={item.desktop}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            transform: `scale(${drift})`,
            transformOrigin: "50% 0%",
          }}
        />
      </div>

      {/* Phone capture. */}
      <div
        style={{
          position: "absolute",
          right: PHONE.right,
          bottom: PHONE.bottom,
          width: PHONE.w,
          height: PHONE.h,
          borderRadius: PHONE.r,
          padding: 6,
          background: "#1a1717",
          border: `1px solid ${COLORS.line}`,
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.55)",
          transform: `translateY(${phoneY}px)`,
          opacity: phone,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: PHONE.r - 6,
            overflow: "hidden",
            background: COLORS.elevated,
          }}
        >
          <Img
            src={item.mobile}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          />
        </div>
      </div>

      {/* Caption. */}
      <div
        style={{
          position: "absolute",
          left: DESK.x,
          bottom: 64,
          width: 1000,
          fontFamily: SANS,
          color: COLORS.fg,
        }}
      >
        <div
          style={{
            fontSize: 18,
            letterSpacing: "0.02em",
            color: COLORS.muted,
            fontVariantNumeric: "tabular-nums",
            opacity: arrive,
          }}
        >
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: SERIF,
            fontSize: 104,
            lineHeight: 0.98,
            letterSpacing: "-0.02em",
            display: "flex",
            flexWrap: "wrap",
            gap: "0 0.22em",
          }}
        >
          {words.map((word, i) => {
            const t = spring({
              frame: frame - 4 - i * 3,
              fps,
              config: { damping: 30, stiffness: 160, mass: 0.8 },
            });
            return (
              <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.12em", marginBottom: "-0.12em" }}>
                <span
                  style={{
                    display: "inline-block",
                    transform: `translateY(${(1 - t) * 110}%)`,
                  }}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: 14, fontSize: 26, color: COLORS.muted, opacity: arrive }}>
          {item.meta}
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function Showreel({ items }: ShowreelProps) {
  return (
    <AbsoluteFill style={{ background: COLORS.canvas }}>
      {items.map((item, i) => (
        <Sequence key={item.title} from={i * SCENE_FRAMES} durationInFrames={SCENE_FRAMES} layout="none">
          <Scene item={item} index={i} count={items.length} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
