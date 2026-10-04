import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
/*
 * Lenis's own stylesheet, and it is not optional. Its first rule is
 * `html.lenis, html.lenis body { height: auto }`, and that rule is what keeps
 * the scroll limit honest.
 *
 * Lenis caches a scroll limit of `documentElement.scrollHeight - innerHeight`
 * and re-reads it only when a ResizeObserver on <html> fires. A ResizeObserver
 * watches a *box*, so pinning the root to `height: 100%` pins it to the
 * viewport forever: the page can grow underneath it and the observer never
 * fires. The limit measured during hydration is then the limit for the life of
 * the page. See SmoothScroll.tsx for what that looks like from the user's side.
 */
import "lenis/dist/lenis.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CommandPaletteProvider } from "@/components/CommandPalette";
import { AnalyticsListener } from "@/components/AnalyticsListener";
import { siteConfig } from "@/data/config";
import { getAllPosts } from "@/data/blog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const title = `${siteConfig.name} — ${siteConfig.role}`;
const description =
  "Creative developer building immersive landing pages, brand websites and interactive 3D product showcases — on top of real full-stack and AI engineering. Get a quote or book a call.";

/*
 * Plausible's per-site script URL (Site settings → "Site installation" in the
 * dashboard, e.g. https://plausible.io/js/pa-XXXXXXXX.js). Unset means no
 * script, and every track() call quietly does nothing.
 */
const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: title,
    template: `%s — ${siteConfig.name}`,
  },
  description,
  keywords: [
    "Creative Developer",
    "Immersive Website",
    "Landing Page",
    "Interactive 3D",
    "WebGL",
    "Next.js",
    "Full-Stack Engineer",
    "AI Engineer",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.siteUrl,
    title,
    description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const posts = getAllPosts();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
    >
      {/* min-h-dvh, not min-h-full: the sticky footer needs to measure against
          the viewport, not against a percentage of <html> — which is `auto`
          both before Lenis mounts and after lenis.css applies. */}
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        {/* Dark-only: there is no theme provider and no toggle. The immersive
            direction (light on dark, depth, material) only works on dark. */}
        <CommandPaletteProvider posts={posts}>
          <SmoothScroll>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </SmoothScroll>
          <AnalyticsListener />
        </CommandPaletteProvider>
        <div aria-hidden className="grain" />
      </body>

      {/*
       * Cloudflare Web Analytics. The token is public by design — it ships in
       * the HTML either way — so it lives here rather than in the environment.
       *
       * Through next/script rather than a raw tag so it loads exactly once
       * across client-side navigations; a plain tag in the root layout would
       * re-run on every route change. `afterInteractive` over `lazyOnload`
       * because the latter waits for browser idle, which can miss a quick
       * bounce — the visit most worth counting.
       *
       * Counts are a floor, not a total: the beacon is client-side, so
       * adblockers remove an unmeasurable slice of real traffic.
       *
       * Production only, so `next dev` refreshes stay out of the numbers.
       * NODE_ENV is inlined at build time, so this compiles the beacon out of
       * the development bundle entirely rather than deciding at runtime.
       */}
      {process.env.NODE_ENV === "production" && (
        <Script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "d500335376f846078037fea7d9f38dc0"}'
          strategy="afterInteractive"
        />
      )}

      {/*
       * Plausible, for the custom events Cloudflare's beacon can't record —
       * pricing views, quote starts and submits, booking and social clicks
       * (see lib/analytics.ts). The inline stub queues any event fired before
       * the script arrives, so an early click isn't lost. Production only, for
       * the same reason as the beacon.
       */}
      {process.env.NODE_ENV === "production" && plausibleSrc && (
        <>
          <Script id="plausible-init" strategy="afterInteractive">
            {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
          </Script>
          <Script src={plausibleSrc} strategy="afterInteractive" />
        </>
      )}
    </html>
  );
}
