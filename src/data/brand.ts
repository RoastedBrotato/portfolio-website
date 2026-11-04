/*
 * The brand in one place: the mark's geometry and the colours it is drawn
 * with, as literals. The site's CSS tokens (globals.css) carry the same values
 * for the page; these exist for the places that can't read CSS variables —
 * the favicon, the Apple icon and the share cards, all rendered by Satori at
 * build time — and for the static SVGs in public/brand.
 */
export const brand = {
  name: "Waleed Ajaz",
  paper: "#f6f0e4",
  ink: "#16130f",
  muted: "#57504a",
  subtle: "#6e665f",
  cobalt: "#2b3cf0",
  gloss: "rgba(255, 255, 255, 0.8)",
  pop: {
    red: "#ff3b2f",
    purple: "#7c4dff",
    yellow: "#ffc226",
    pink: "#ff4fc3",
    lime: "#7bd62a",
    blue: "#2b6cff",
  },
} as const;

/*
 * The mark: a W drawn as one zigzag stroke, the way the hero's wordmark draws
 * its v — a fat cobalt line over a wider ink line, round caps and joins, and a
 * gloss tick on the first stroke so it reads as a thing rather than a letter.
 * Four points of a zigzag is the whole drawing, which is why it survives 16px.
 *
 * Geometry is in a 120 × 88 box (the viewBox below), strokes included.
 */
export const mark = {
  viewBox: "0 8 120 88",
  width: 120,
  height: 88,
  path: "M12 22 34 82 60 36 86 82 108 22",
  gloss: "M16 24 24 44",
  /** Stroke widths: the ink underneath, the colour on top, the gloss. */
  outline: 26,
  stroke: 17,
  glossWidth: 5,
} as const;
