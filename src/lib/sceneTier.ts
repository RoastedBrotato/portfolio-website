/**
 * Which version of a real-time scene a device gets. Decided once, on the
 * client, before any three.js code is downloaded:
 *
 *   full      desktop-class: full resolution, the full instance count
 *   lite      phones and modest laptops (the Instagram in-app browser on a
 *             mid-range Android lands here): reduced resolution, fewer instances
 *   still     prefers-reduced-motion: the scene renders one frame and stops
 *   fallback  no WebGL, Save-Data, or a genuinely weak device: no three.js at
 *             all; the caller shows its 2D or poster version instead
 */
export type SceneQuality = "full" | "lite" | "still";

export type SceneTier =
  | { kind: "scene"; quality: SceneQuality }
  | { kind: "fallback"; reason: "save-data" | "no-webgl" | "low-end" };

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean };
  /** GB, rounded down to a power of two. Chromium only. */
  deviceMemory?: number;
};

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    // Hand the context straight back: browsers cap how many can be live.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function detectSceneTier(): SceneTier {
  const nav = navigator as NavigatorHints;

  // Save-Data first: it's an explicit request not to spend the bytes.
  if (nav.connection?.saveData) return { kind: "fallback", reason: "save-data" };
  if (!hasWebGL()) return { kind: "fallback", reason: "no-webgl" };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return { kind: "scene", quality: "still" };
  }

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  if (cores <= 2 || memory <= 2) return { kind: "fallback", reason: "low-end" };

  const touch = window.matchMedia("(pointer: coarse)").matches;
  if (touch || cores <= 4 || memory <= 4) return { kind: "scene", quality: "lite" };
  return { kind: "scene", quality: "full" };
}
