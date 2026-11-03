import { WorkItem } from "@/types";

/**
 * "Selected work" — the client pieces, shown first on the homepage.
 *
 * To add a piece:
 * 1. Capture the live site into /public/work/<slug>/: desktop.jpg (1600×900)
 *    and mobile.jpg (860×1720). A short looping clip is optional —
 *    preview.mp4 (~5–10s, muted, H.264, ≤1.5MB) plus poster.jpg.
 * 2. Add an entry below. `featured: true` puts it in the homepage reel and
 *    index; order here is order on the page.
 * 3. For a write-up, fill `study` and point `caseStudy` at "/work/<slug>" —
 *    the creative template renders it. (Engineering write-ups live in
 *    src/data/projects.ts instead.)
 *
 * Entries with `placeholder: true` show up in `next dev` so you can see the
 * layout filled, and are dropped from every build — nothing invented ships.
 *
 * Captures were taken from the live sites on 2 November 2026; re-capture
 * when a site changes. Lines marked DRAFT are starting points to correct —
 * in particular `scope` for the pieces built with a team.
 */
export const work: WorkItem[] = [
  {
    slug: "benda-offroad",
    title: "Benda Offroad",
    featured: true,
    kind: "Dealer site · EN / AR",
    location: "Doha, Qatar",
    scope: "Design and build", // DRAFT
    description:
      "A bilingual site for Benda's ATV and side-by-side dealer: a full-bleed desert video hero, the whole lineup spec by spec, and WhatsApp as the sales channel.",
    tags: ["Brand site", "EN / AR", "WhatsApp sales"],
    media: {
      type: "video",
      src: "/work/benda-offroad/preview.mp4",
      poster: "/work/benda-offroad/poster.jpg",
      alt: "Benda Offroad's video hero: an ATV in the Qatar desert",
    },
    shots: { desktop: "/work/benda-offroad/desktop.jpg", mobile: "/work/benda-offroad/mobile.jpg" },
    href: "https://bendaoffroad.qa/",
    caseStudy: "/work/benda-offroad",
    // Facts from the build log (content/blog/adding-testimonials.mdx). The
    // result wants a number from White Peaks: enquiries a month, or sales
    // traced to the site. Ask, then replace the sentence.
    study: {
      brief:
        "White Peaks is Benda's partner in Qatar, launching ten off-road vehicles into a market where a sale starts as a WhatsApp message. The site had to make each model worth that message: the lineup spec by spec, every colourway, a gallery, all of it in English and Arabic.",
      sequence: [
        {
          media: {
            type: "video",
            src: "/work/benda-offroad/preview.mp4",
            poster: "/work/benda-offroad/poster.jpg",
            alt: "Benda Offroad's video hero: an ATV in the Qatar desert",
          },
          caption: "The hero is the desert, full-bleed, and a vehicle moving through it. The lineup starts one scroll down.",
        },
        {
          media: { type: "image", src: "/work/benda-offroad/desktop.jpg", alt: "The Benda Offroad homepage, desktop" },
          caption: "Ten models, from the Redstone quads to the six-seat Supernovae, each with its spec sheet, its colourway picker and one button: WhatsApp.",
        },
        {
          media: { type: "image", src: "/work/benda-offroad/mobile.jpg", alt: "The Benda Offroad homepage on a phone" },
          caption: "Most visitors arrive from Instagram on a phone, so the phone layout came first and the video hero is budgeted for it.",
        },
      ],
      build: {
        stack: ["Next.js", "Netlify"],
        budget: [
          ["Models", "10, spec by spec"],
          ["Languages", "English, Arabic"],
          ["Enquiries", "Straight to WhatsApp"],
          ["First commit to client review", "7 days"],
        ],
        notes: [
          {
            title: "Arabic is a URL, not a toggle",
            body: "Every page exists at an Arabic address with hreflang between the pair, so a search in either language lands on the right version and the right-to-left layout is the page, not a reflow.",
          },
          {
            title: "Built to be checked",
            body: "Specs were sourced from Benda's published numbers and flagged for a check against the import sheets, and the README listed everything outstanding before go-live. The client knew exactly what they were approving.",
          },
        ],
      },
      result: "Live at bendaoffroad.qa: the whole lineup, in both languages, with every model one tap from a sales conversation.",
    },
  },
  {
    slug: "createxworks",
    title: "CreateXworks",
    featured: true,
    kind: "Studio site",
    location: "Karachi, Pakistan",
    scope: "Design and build", // DRAFT
    description:
      "A site for a 3D-printing and manufacturing studio: loud type, a print-status loader, live production numbers and a quote form that gets answered in 72 hours.",
    tags: ["Brand site", "Lead generation"],
    media: {
      type: "video",
      src: "/work/createxworks/preview.mp4",
      poster: "/work/createxworks/poster.jpg",
      alt: "The CreateXworks homepage: its loader, then the Designed Loud, Printed Precise hero",
    },
    shots: { desktop: "/work/createxworks/desktop.jpg", mobile: "/work/createxworks/mobile.jpg" },
    href: "https://createxworks.com/",
    caseStudy: "/work/createxworks",
    // A result number (quotes a month through the form) is still to come.
    study: {
      brief:
        "CreateXworks prints and manufactures parts for other businesses in Karachi, and came for a site early, before most companies have one. It had to feel as confident as the work, show what the studio makes in the medium it makes it in, and turn a visit into a quote request.",
      sequence: [
        {
          media: {
            type: "video",
            src: "/work/createxworks/preview.mp4",
            poster: "/work/createxworks/poster.jpg",
            alt: "The CreateXworks homepage: its loader, then the Designed Loud, Printed Precise hero",
          },
          caption: "The loader reads like a printer's status line, then the headline lands: Designed Loud, Printed Precise. The site talks the way the studio does.",
        },
        {
          media: { type: "image", src: "/work/createxworks/desktop.jpg", alt: "The CreateXworks homepage, desktop" },
          caption: "Custom 3D elements built from the kind of parts the studio prints, and live production numbers, so the proof is the studio's own output rather than a paragraph about it.",
        },
        {
          media: { type: "image", src: "/work/createxworks/mobile.jpg", alt: "The CreateXworks homepage on a phone" },
          caption: "The quote form is the one destination. Every section ends at it, and the promise beside it is a reply within 72 hours.",
        },
      ],
      build: {
        stack: ["React Three Fiber", "Node.js"],
        budget: [
          ["3D", "Custom, in the browser"],
          ["Destination", "One quote form"],
          ["Reply promise", "72 hours"],
          ["Proof", "Live production numbers"],
        ],
        notes: [
          {
            title: "A loader that earns its place",
            body: "The loading screen is written as a print job, status by status, so the wait says what the studio does before the first screen has drawn.",
          },
          {
            title: "One ask per page",
            body: "No contact page, no phone number buried in a footer: the quote form is where every path ends, and the 72-hour promise sits next to it so there is a reason to send one today.",
          },
        ],
      },
      result: "Live at createxworks.com: a studio that sounds like itself, and a quote form at the end of every scroll.",
    },
  },
  {
    slug: "al-mahhar-holding",
    title: "Al Mahhar Holding",
    featured: true,
    kind: "Corporate site · EN / AR",
    location: "Doha, Qatar",
    scope: "Build", // DRAFT — set to what you actually did on this one
    description:
      "The corporate site for a Qatar Stock Exchange-listed energy and infrastructure group: ten portfolio companies, investor relations, news, and every page in English and Arabic.",
    tags: ["Corporate", "EN / AR", "Investor relations"],
    media: {
      type: "image",
      src: "/work/al-mahhar-holding/desktop.jpg",
      alt: "The Al Mahhar Holding homepage: glass towers behind the FTSE Russell announcement",
    },
    shots: { desktop: "/work/al-mahhar-holding/desktop.jpg", mobile: "/work/al-mahhar-holding/mobile.jpg" },
    href: "https://www.almahharholding.com/en",
    caseStudy: "/work/al-mahhar-holding",
    // Scope above is still DRAFT: if you designed too, say so here and in the
    // brief.
    study: {
      brief:
        "Al Mahhar Holding is listed on the Qatar Stock Exchange, with ten portfolio companies in energy and infrastructure. The existing site needed bringing up to date, and a listed group's site is read by investors, regulators and the press: it had to carry ten company profiles, the integrations the group reports through, and a way for the team to publish investor relations documents themselves, in English and Arabic, without a loose end.",
      sequence: [
        {
          media: { type: "image", src: "/work/al-mahhar-holding/desktop.jpg", alt: "The Al Mahhar Holding homepage, desktop" },
          caption: "The homepage leads with the group's latest announcement, the FTSE Russell inclusion, over the Doha skyline. News first, because that is what a shareholder opens the site for.",
        },
        {
          media: { type: "image", src: "/work/al-mahhar-holding/mobile.jpg", alt: "The Al Mahhar Holding homepage on a phone" },
          caption: "Ten portfolio companies, investor relations and news, each a section the group's own team updates in Sanity. The phone layout keeps the same order.",
        },
      ],
      build: {
        stack: ["Svelte", "Sanity", "Node.js"],
        budget: [
          ["Portfolio companies", "10"],
          ["Languages", "English, Arabic"],
          ["IR publishing", "By the team, in Sanity"],
          ["Audience", "Investors, press, regulators"],
        ],
        notes: [
          {
            title: "Investor relations is a system, not a page",
            body: "Announcements, reports and disclosures accumulate for years. The publishing flow is built for that: the team files a document in Sanity, typed and dated, and it appears on the site in both languages without a developer in the loop.",
          },
          {
            title: "Corporate without being beige",
            body: "A listed company's site has conventions to respect. Within them, the type, the photography and the pacing are chosen, not defaulted, so the group reads as the size it is.",
          },
        ],
      },
      result: "Live at almahharholding.com: a listed group's full presence, both languages, built for the years of filings still to come.",
    },
  },
  {
    slug: "alsufun",
    title: "AlSufun",
    featured: true,
    kind: "Studio site",
    location: "Doha, Qatar",
    scope: "Design and build",
    description:
      "My own studio's site: websites, business software and PCB design for companies in Doha, with a live launch checklist in the hero instead of a stock photo.",
    tags: ["Brand site", "Studio"],
    media: {
      type: "image",
      src: "/work/alsufun/desktop.jpg",
      alt: "The AlSufun homepage: Software and PCBs for business, beside a launch checklist",
    },
    shots: { desktop: "/work/alsufun/desktop.jpg", mobile: "/work/alsufun/mobile.jpg" },
    href: "https://alsufun.com/",
  },
  {
    slug: "moementum",
    title: "Moementum",
    featured: true,
    kind: "Coaching platform · SaaS",
    location: "Doha, Qatar",
    scope: "Design, build and run",
    description:
      "A coaching platform for a personal trainer: clients log training and daily metrics, the trainer reviews and replies against each session. Ten clients use it every day.",
    tags: ["Web app", "Supabase", "In daily use"],
    media: {
      type: "image",
      src: "/work/moementum/desktop.jpg",
      alt: "The Moementum landing page: Train. Track. Grow.",
    },
    shots: { desktop: "/work/moementum/desktop.jpg", mobile: "/work/moementum/mobile.jpg" },
    href: "https://moementum.fit/",
    caseStudy: "/work/moementum-fit",
  },
  {
    slug: "3dbanao",
    title: "3dbanao",
    kind: "Configurator · E-commerce",
    location: "Pakistan",
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
    slug: "quarr-configurator",
    title: "Quarr One configurator",
    kind: "Lab demo",
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
    kind: "Lab demo",
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

/** The homepage five, in order. */
export function getFeaturedWork(): WorkItem[] {
  return getWork().filter((item) => item.featured);
}

/** Pieces with a write-up — each gets /work/<slug>. */
export function getStudies(): WorkItem[] {
  return getWork().filter((item) => item.study);
}

export function getWorkBySlug(slug: string): WorkItem | undefined {
  return getStudies().find((item) => item.slug === slug);
}
