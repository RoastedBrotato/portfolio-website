import { WorkItem } from "@/types";

/**
 * "Selected work" — the creative pieces, shown first on the homepage.
 *
 * To add a piece:
 * 1. Drop the media under /public/work/<slug>/ — a short clip (preview.mp4,
 *    ~5–10s, muted, H.264, ≤1.5MB, 1280px wide is plenty) and a poster frame
 *    (poster.jpg, same aspect, 16:10 crops best).
 * 2. Add an entry below. Order here is order on the page; the first entry gets
 *    the wide slot.
 * 3. For a write-up, fill `study` and point `caseStudy` at "/work/<slug>" —
 *    the creative template renders it. (Engineering write-ups live in
 *    src/data/projects.ts instead.)
 *
 * Entries with `placeholder: true` show up in `next dev` so you can see the
 * layout filled, and are dropped from every build — nothing invented ships.
 *
 * Three client sites first, linking straight to the live builds (no write-up
 * yet: add a `study` once there's something to say about how each was
 * built), then two self-initiated Lab demos around a fictional product.
 * Copy is DRAFT — edit freely. The demos' budget numbers were measured from
 * a production build on 4 October 2026; re-measure if the scenes change.
 *
 * Clips are recorded from the live sites; re-cut them when a site changes.
 */
export const work: WorkItem[] = [
  {
    slug: "benda-offroad",
    title: "Benda Offroad",
    description:
      "A bilingual (EN/AR) site for Benda's ATV and side-by-side dealer in Doha: a full-bleed desert video hero and the whole lineup, spec by spec.",
    tags: ["Brand site", "EN / AR"],
    media: {
      type: "video",
      src: "/work/benda-offroad/preview.mp4",
      poster: "/work/benda-offroad/poster.jpg",
      alt: "Benda Offroad's video hero: an ATV in the Qatar desert",
    },
    href: "https://bendaoffroad.qa/",
  },
  {
    slug: "3dbanao",
    title: "3dbanao",
    description:
      "A live 3D configurator for custom name keychains: type a name, pick a shape and colours, watch it update, order on WhatsApp.",
    tags: ["Interactive 3D", "E-commerce"],
    media: {
      type: "video",
      src: "/work/3dbanao/preview.mp4",
      poster: "/work/3dbanao/poster.jpg",
      alt: "Typing a name into the 3dbanao configurator and rotating the 3D keychain",
    },
    href: "https://3dbanado.netlify.app/",
  },
  {
    slug: "createxworks",
    title: "CreateXworks",
    description:
      "A site for a 3D-printing and manufacturing studio: loud type, a print-status loader, and work that gets its own world per project.",
    tags: ["Brand site"],
    media: {
      type: "video",
      src: "/work/createxworks/preview.mp4",
      poster: "/work/createxworks/poster.jpg",
      alt: "The CreateXworks homepage: its loader, then the Designed Loud, Printed Precise hero",
    },
    href: "https://createxworks.netlify.app/",
  },
  {
    slug: "quarr-configurator",
    title: "Quarr One configurator",
    description:
      "A product you can turn, recolour and open up, with a scripted camera move on arrival. Modelled from primitives, lit without a single image file.",
    tags: ["Interactive 3D"],
    year: "2026",
    media: {
      type: "video",
      src: "/work/quarr-configurator/preview.mp4",
      poster: "/work/quarr-configurator/poster.jpg",
      alt: "A speaker turning in the configurator as its colourway changes",
    },
    href: "/lab/configurator",
    caseStudy: "/work/quarr-configurator",
    study: {
      brief:
        "The Interactive 3D package, built for real: a configurator for Quarr One, a fictional bookshelf speaker. Three colourways, an exploded view and a camera that introduces the product before handing control over — the pieces a launch-day product page actually needs.",
      sequence: [
        {
          media: {
            type: "video",
            src: "/work/quarr-configurator/preview.mp4",
            poster: "/work/quarr-configurator/poster.jpg",
            alt: "A speaker turning in the configurator as its colourway changes",
          },
          caption: "On arrival the camera sweeps from behind to a front three-quarter, then orbit control is handed to the visitor.",
        },
        {
          media: { type: "image", src: "/work/quarr-configurator/exploded.jpg", alt: "The speaker in exploded view" },
          caption: "“Look inside” separates baffle, woofer and tweeter along the depth axis. Colours ease between finishes rather than snapping.",
        },
      ],
      build: {
        stack: ["React Three Fiber", "drei", "three.js"],
        budget: [
          ["Model", "Primitives, no file"],
          ["Lighting", "Lightformers, no HDR"],
          ["Scene JS", "≈ 290 KB gzipped"],
          ["Zoom", "Off, so pinch scrolls the page"],
        ],
        notes: [
          {
            title: "No downloads beyond code",
            body: "The environment is built from four Lightformers — a soft key, a steel rim, a thin red strip and a floor bounce — so the product looks studio-lit without fetching an HDR.",
          },
          {
            title: "Built for the real thing",
            body: "Swapping the primitives for a client's GLB is a one-component change; the colourway, exploded-view and camera logic don't care what the mesh is.",
          },
        ],
      },
      result: "A working demo of the Interactive 3D package, linked from every pitch for it.",
    },
  },
  {
    slug: "quarr-launch",
    title: "Quarr One launch page",
    description:
      "A launch page for a product that doesn't exist: a pinned, scroll-scrubbed 3D sequence, the numbers, and a waitlist.",
    tags: ["Landing page", "Scroll-driven"],
    year: "2026",
    media: {
      type: "video",
      src: "/work/quarr-launch/preview.mp4",
      poster: "/work/quarr-launch/poster.jpg",
      alt: "Scrolling the launch page as the speaker turns and comes apart",
    },
    href: "/lab/launch",
    caseStudy: "/work/quarr-launch",
    study: {
      brief:
        "The Immersive Landing Page package, end to end, for a clearly fictional speaker: one long page that turns scroll into a product reveal, then asks for one thing.",
      sequence: [
        {
          media: {
            type: "video",
            src: "/work/quarr-launch/preview.mp4",
            poster: "/work/quarr-launch/poster.jpg",
            alt: "Scrolling the launch page as the speaker turns and comes apart",
          },
          caption: "Four steps over four screens of scroll: turn it, open it, colour it, hear it. Nothing moves unless the visitor scrolls.",
        },
        {
          media: { type: "image", src: "/work/quarr-launch/opener.jpg", alt: "The launch page's opening headline" },
          caption: "A display-type opener, then straight into the sequence. The fictional-product banner never leaves the top of the page.",
        },
      ],
      build: {
        stack: ["React Three Fiber", "Framer Motion", "Lenis"],
        budget: [
          ["Pinned section", "400svh, one sticky frame"],
          ["Scroll owner", "Lenis (one system)"],
          ["Off screen", "Render loop stopped"],
          ["Reduced motion", "Renders on scroll only"],
        ],
        notes: [
          {
            title: "Scroll is the timeline",
            body: "Framer's scroll progress for the pinned section drives rotation, explosion and camera directly, with a little smoothing so a wheel tick never steps the model.",
          },
          {
            title: "Captions that are announced",
            body: "The step text is an aria-live region, so a screen reader hears each step as it changes, the way it's seen.",
          },
        ],
      },
      result: "A working demo of the Immersive Landing Page package — and the template for the next real one.",
    },
  },
];

const includePlaceholders = process.env.NODE_ENV !== "production";

/** What actually renders: placeholders in dev, real entries only in a build. */
export function getWork(): WorkItem[] {
  return work.filter((item) => includePlaceholders || !item.placeholder);
}

/** Pieces with a write-up — each gets /work/<slug>. */
export function getStudies(): WorkItem[] {
  return getWork().filter((item) => item.study);
}

export function getWorkBySlug(slug: string): WorkItem | undefined {
  return getStudies().find((item) => item.slug === slug);
}
