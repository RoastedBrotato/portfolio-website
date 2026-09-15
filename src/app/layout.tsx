import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
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

const title = `${siteConfig.name} — Full-Stack & AI Engineer`;
const description =
  "Full-stack and AI engineer. I take client projects from the first discovery call to production — web apps, RAG systems, and the backends behind them.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: title,
    template: `%s — ${siteConfig.name}`,
  },
  description,
  keywords: ["Full-Stack Engineer", "AI Engineer", "RAG", "Next.js", "Freelance Developer"],
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
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CommandPaletteProvider posts={posts}>
            <SmoothScroll>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </SmoothScroll>
          </CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
