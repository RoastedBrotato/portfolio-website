import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/config";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          fontFamily: "serif",
          fontStyle: "italic",
          fontSize: 20,
          fontWeight: 600,
          color: "#c96a43",
        }}
      >
        {siteConfig.initials}
      </div>
    ),
    { ...size }
  );
}
