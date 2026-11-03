import { Composition, staticFile } from "remotion";
import { REEL_FPS, REEL_HEIGHT, REEL_WIDTH, Showreel, reelDuration } from "@/remotion/Showreel";
import { reelItems } from "@/remotion/reel";
import { getFeaturedWork } from "@/data/work";

/*
 * Entry point for the Remotion CLI, so the hero reel can be rendered to a
 * file for ads and socials. Not imported by the site.
 *
 *   npm i -D @remotion/cli@4.0.539
 *   npx remotion studio src/remotion/index.ts
 *   npx remotion render src/remotion/index.ts Showreel out/showreel.mp4
 *
 * The site's fonts are loaded by Next, not by Remotion, so a render from the
 * CLI falls back to Georgia and system-ui unless the fonts are loaded here
 * with @remotion/google-fonts first.
 */
const items = reelItems(getFeaturedWork(), (src) => staticFile(src.replace(/^\//, "")));

export function RemotionRoot() {
  return (
    <Composition
      id="Showreel"
      component={Showreel}
      durationInFrames={reelDuration(items.length)}
      fps={REEL_FPS}
      width={REEL_WIDTH}
      height={REEL_HEIGHT}
      defaultProps={{ items }}
    />
  );
}
