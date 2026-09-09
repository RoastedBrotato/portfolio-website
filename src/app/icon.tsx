import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** No initials, no wordmark — the red square the navbar uses as its mark. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
      }}
    >
      <div style={{ width: 16, height: 16, background: "#ff2b1f" }} />
    </div>,
    { ...size },
  );
}
