import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    tag: "Work",
    headline: "Immersive sites, interactive 3D and the engineering underneath.",
  });
}
