import { ImageResponse } from "next/og";
import { brand, mark } from "@/data/brand";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * The favicon: the mark on paper (src/data/brand.ts). No gloss at this size —
 * a two-pixel highlight only reads as a flaw in a tab strip.
 */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: brand.paper,
      }}
    >
      <svg
        viewBox={mark.viewBox}
        width={26}
        height={19}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={mark.path} stroke={brand.ink} strokeWidth={mark.outline} />
        <path d={mark.path} stroke={brand.cobalt} strokeWidth={mark.stroke} />
      </svg>
    </div>,
    { ...size },
  );
}
