import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/config";

/*
 * A still of the hero scene (public/og/hero.jpg, 1200 × 630), captured from the
 * live site: the slab field with the red light off to the right, empty on the
 * left where the headline goes. Inlined as a data URL because the card is
 * rendered at build time, with no server to fetch it from. Re-capture it when
 * the scene changes.
 */
const heroStill = `data:image/jpeg;base64,${readFileSync(
  path.join(process.cwd(), "public/og/hero.jpg"),
).toString("base64")}`;

/** Shared by every route's opengraph-image.tsx. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * The site's share card: the hero scene behind a red tag and one big line —
 * so a link in an Instagram DM or a LinkedIn post shows the thing the site
 * sells, not just a description of it.
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
        position: "relative",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> only. */}
      <img
        src={heroStill}
        alt=""
        width={ogSize.width}
        height={ogSize.height}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* Keeps the headline on black whatever the still shows behind it. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.1) 100%)",
        }}
      />
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
