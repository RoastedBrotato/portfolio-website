import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    tag: "Get a quote",
    headline: "Tell me what you're building. I reply within one working day.",
  });
}
