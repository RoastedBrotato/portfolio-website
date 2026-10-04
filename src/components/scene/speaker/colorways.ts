/*
 * The Quarr One colourways. Kept apart from SpeakerModel so UI can import them
 * without pulling three.js into the page bundle.
 */
export type Colorway = "graphite" | "bone" | "signal";

export const COLORWAYS: Record<
  Colorway,
  { label: string; body: string; baffle: string; accent: string; metal: string }
> = {
  graphite: { label: "Graphite", body: "#1c1c1c", baffle: "#0e0e0e", accent: "#ff2b1f", metal: "#9a9a9a" },
  bone: { label: "Bone", body: "#d9d3c5", baffle: "#c3bcac", accent: "#161616", metal: "#b5ad9c" },
  signal: { label: "Signal", body: "#e8291d", baffle: "#141414", accent: "#f1f1f1", metal: "#cfcfcf" },
};
