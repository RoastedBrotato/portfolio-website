import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LaunchPage } from "@/components/lab/LaunchPage";

export const metadata: Metadata = pageMetadata({
  title: "Launch page demo",
  description:
    "A launch page for Quarr One, a fictional speaker: a pinned, scroll-driven 3D sequence and a waitlist. A demo of the Immersive Landing Page package.",
  path: "/lab/launch",
});

export default function LaunchDemoPage() {
  return <LaunchPage />;
}
