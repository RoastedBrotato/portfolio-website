import type { WorkItem } from "@/types";
import type { ReelItem } from "@/remotion/Showreel";

/**
 * The showreel's scenes, from the featured work. Only pieces with both
 * captures make it in; `resolve` lets the Remotion CLI map a public path to
 * staticFile() while the Player uses it as is.
 */
export function reelItems(items: WorkItem[], resolve: (src: string) => string = (s) => s): ReelItem[] {
  return items
    .filter((item) => item.shots)
    .map((item) => ({
      title: item.title,
      meta: [item.kind, item.location].filter(Boolean).join(" · "),
      desktop: resolve(item.shots!.desktop),
      mobile: resolve(item.shots!.mobile),
    }));
}
