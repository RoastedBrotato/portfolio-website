import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    tag: "Lab",
    headline: "Experiments, creative challenges and AI-tool tests.",
  });
}
