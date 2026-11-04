import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    tag: "Blog",
    headline: "Notes from the work, the road, and the occasional yap.",
  });
}
