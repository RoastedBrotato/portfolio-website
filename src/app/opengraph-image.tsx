import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";
import { siteConfig } from "@/data/config";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    tag: siteConfig.role,
    headline: "Make it interesting. Make it work.",
  });
}
