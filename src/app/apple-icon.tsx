import { ImageResponse } from "next/og";
import { brand, mark } from "@/data/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * The home-screen icon: the mark in paper on a cobalt tile. iOS rounds the
 * corners itself, so the tile is drawn square and bleeds to the edge.
 */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: brand.cobalt,
      }}
    >
      <svg
        viewBox={mark.viewBox}
        width={124}
        height={91}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={mark.path} stroke={brand.ink} strokeWidth={mark.outline} />
        <path d={mark.path} stroke={brand.paper} strokeWidth={mark.stroke} />
      </svg>
    </div>,
    { ...size },
  );
}
