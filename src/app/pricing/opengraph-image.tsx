import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    tag: "Pricing",
    headline: "Immersive landing pages, brand sites and interactive 3D — packages and prices.",
  });
}
