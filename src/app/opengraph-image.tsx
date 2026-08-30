import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0b",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
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
            color: "#f2a93b",
          }}
        >
          {siteConfig.role}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 64,
            fontWeight: 600,
            color: "#f5f5f4",
            maxWidth: 900,
            lineHeight: 1.1,
          }}
        >
          I build software that solves real business problems.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 26,
            color: "#a1a1aa",
          }}
        >
          {siteConfig.name}
        </div>
      </div>
    ),
    { ...size }
  );
}
