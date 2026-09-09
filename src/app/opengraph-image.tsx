import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          color: "#ffffff",
          maxWidth: 900,
          lineHeight: 1.1,
        }}
      >
        I build software people open every day.
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 36,
          fontSize: 26,
          color: "#a3a3a3",
        }}
      >
        {siteConfig.name}
      </div>
    </div>,
    { ...size },
  );
}
