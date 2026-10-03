import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/config";

/** Shared by every route's opengraph-image.tsx. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * The site's share card: black, the 48px grid, a red tag and one big line —
 * the same language as the hero, so a link in an Instagram DM or a LinkedIn
 * post looks like the page it opens.
 */
export function renderOgImage({ tag, headline }: { tag: string; headline: string }) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        backgroundColor: "#000000",
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#000000",
          backgroundColor: "#ff2b1f",
          padding: "8px 14px",
          alignSelf: "flex-start",
        }}
      >
        {tag}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 64,
          fontWeight: 600,
          color: "#ffffff",
          maxWidth: 950,
          lineHeight: 1.1,
        }}
      >
        {headline}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 36,
          fontSize: 26,
          color: "#a3a3a3",
        }}
      >
        {siteConfig.name} · {siteConfig.role}
      </div>
    </div>,
    { ...ogSize },
  );
}
