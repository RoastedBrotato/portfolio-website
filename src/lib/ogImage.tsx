import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { brand, mark } from "@/data/brand";
import { siteConfig } from "@/data/config";

/*
 * The two faces the page uses, as static TTFs for Satori (it reads font
 * files, not next/font). Both are the Google Fonts builds under the SIL Open
 * Font License: Bricolage Grotesque at 800 for the headline and the name,
 * Geist at 500 for everything else. Read once at module load — the cards are
 * rendered at build time, with no server to fetch from.
 */
const font = (file: string) => readFileSync(path.join(process.cwd(), "src/assets/fonts", file));
const bricolage = font("BricolageGrotesque-800.ttf");
const geist = font("Geist-500.ttf");

/** Shared by every route's opengraph-image.tsx. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** The mark, drawn with literal colours (Satori can't read CSS variables). */
function OgMark({ height, tone }: { height: number; tone: "ink" | "paper" }) {
  return (
    <svg
      viewBox={mark.viewBox}
      width={(height * mark.width) / mark.height}
      height={height}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={mark.path} stroke={brand.ink} strokeWidth={mark.outline} />
      <path d={mark.path} stroke={tone === "paper" ? brand.paper : brand.cobalt} strokeWidth={mark.stroke} />
      {tone === "ink" && <path d={mark.gloss} stroke={brand.gloss} strokeWidth={mark.glossWidth} />}
    </svg>
  );
}

/** Long headlines (a case study's title and outcome) step down rather than wrap off the card. */
function headlineSize(text: string) {
  if (text.length > 80) return 52;
  if (text.length > 44) return 64;
  return 80;
}

/**
 * The site's share card, on the site's paper: the lockup top-left, a cobalt
 * tag over one big line, availability and the address along the bottom, and the
 * mark again, large and tipped over, bleeding off the right edge — so a link
 * in a DM or a LinkedIn post looks like the site it leads to.
 */
export function renderOgImage({ tag, headline }: { tag: string; headline: string }) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 72px 56px",
        backgroundColor: brand.paper,
        color: brand.ink,
        fontFamily: "Geist",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -150,
          top: 130,
          display: "flex",
          transform: "rotate(-8deg)",
        }}
      >
        <OgMark height={400} tone="ink" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <OgMark height={38} tone="ink" />
        <div
          style={{
            display: "flex",
            fontFamily: "Bricolage Grotesque",
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: -1,
          }}
        >
          {siteConfig.name}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 790 }}>
        <div
          style={{
            display: "flex",
            fontSize: 19,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#ffffff",
            backgroundColor: brand.cobalt,
            padding: "8px 14px",
            borderRadius: 6,
            alignSelf: "flex-start",
          }}
        >
          {tag}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontFamily: "Bricolage Grotesque",
            fontWeight: 800,
            fontSize: headlineSize(headline),
            lineHeight: 1,
            letterSpacing: -2.5,
          }}
        >
          {headline}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          color: brand.muted,
        }}
      >
        <div style={{ display: "flex" }}>{`${siteConfig.availability} · ${siteConfig.location}`}</div>
        <div style={{ display: "flex" }}>{siteConfig.siteUrl.replace(/^https?:\/\//, "")}</div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Bricolage Grotesque", data: bricolage, style: "normal", weight: 800 },
        { name: "Geist", data: geist, style: "normal", weight: 500 },
      ],
    },
  );
}
