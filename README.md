# Portfolio

A full-stack & AI engineer portfolio built with Next.js (App Router), TypeScript, Tailwind CSS,
and Framer Motion. Content lives in typed data files, not scattered across components, so the
whole site can be updated without touching markup.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The homepage auto-reloads as you edit.

Other scripts:

```bash
npm run build   # production build (also runs the TypeScript check)
npm run start   # serve the production build locally
npm run lint    # ESLint
```

## Where to edit things

Everything you're likely to change lives in `src/data/`:

| File | Controls |
|---|---|
| `src/data/config.ts` | Your name, email, GitHub/LinkedIn URLs, resume path, site URL |
| `src/data/projects.ts` | The 3 featured projects and their full case-study content (problem, solution, architecture, challenges, tech decisions, outcome) |
| `src/data/services.ts` | The 4 "What I Build" service cards |
| `src/data/experience.ts` | Your work history timeline |
| `src/data/techStack.ts` | The grouped technology lists in "Toolbox" |
| `src/data/nav.ts` | The nav bar links |
| `content/blog/*.mdx` | Blog posts — one file per post (see "Writing a post" below) |

Page copy that isn't data-driven (hero headline, about paragraph, contact section wording) lives
directly in its section component under `src/components/sections/`.

### Writing a post

Drop a `.mdx` file in `content/blog/`. The filename is the slug, so
`content/blog/rag-chunking.mdx` becomes `/blog/rag-chunking`. No code changes — the listing
page, post page, `sitemap.xml`, the RSS feed and the ⌘K search all pick it up.

```md
---
title: "Post Title"
description: "One sentence for the listing page, search results and the RSS feed."
date: "2026-09-10"          # YYYY-MM-DD, drives sort order and <pubDate>
tags: ["ai", "backend"]     # optional
draft: true                 # optional — see below
---
```

- **Drafts.** `draft: true` shows the post under `npm run dev` and excludes it from every build,
  the sitemap and the feed — so half-written posts are safe to commit and push. Delete the line
  to publish.
- **Code.** Fenced blocks are highlighted at build time by Shiki via `rehype-pretty-code`; both
  palettes ship as CSS variables so blocks follow the theme toggle with no client-side JS. Use
  ```` ```ts title="lib/chunk.ts" ```` for the caption bar and ```` ```ts {2,5} ```` to mark lines.
- **Images.** Put them in `public/images/blog/<slug>/` and use a normal Markdown image. The alt
  text doubles as the caption. These render as plain lazy `<img>`, not `next/image`, because
  `next/image` needs intrinsic dimensions — fine for in-body screenshots; swap in `next/image`
  if a post ever needs a heavy above-the-fold hero.
- **Reading time** is derived from word count, not frontmatter.

`content/blog/hello-world.mdx` is a live reference for all of the above and can be deleted once
real posts exist.

### Adding or editing a project / case study

1. Open `src/data/projects.ts` and edit an existing entry, or copy one to add a new project — the
   `Project` type (`src/types/index.ts`) documents every field.
2. The route `/work/<slug>` is generated automatically from the `slug` field — nothing else to wire up.
3. `caseStudy.architecture` drives the architecture diagram: `primary.steps` is the main flow
   (rendered top to bottom), and an optional `secondary` flow renders alongside it — used on the
   real-time project for the "return path" (DB → SignalR → Client).
4. The project ordering in the array controls both the homepage order and the prev/next
   navigation at the bottom of each case study.

### Adding screenshots

Each project has an `image` field (a path under `/public`) on the `Project` type. Leave it
`undefined` and the site renders a generated abstract visual instead (a stylized browser-frame
mockup, distinct per project) — this is what ships by default since there are no real screenshots
yet.

To add a real screenshot:

1. Drop the image in `public/images/projects/<slug>/cover.png` (folders already exist for all
   three seed projects, each with a `README.txt` reminder).
2. Set `image: "/images/projects/<slug>/cover.png"` on that project in `src/data/projects.ts`.
3. **Recommended dimensions:** 1600×1000px (16:10), PNG or JPG, under ~500KB. The image is
   rendered through `next/image` and cropped to fill its frame (`object-cover`), so anything close
   to 16:10 will look right; extreme aspect ratios will crop awkwardly.

### Resume

`public/resume.pdf` is your real resume. To update it later, replace that file (keep the filename,
or update `resumeUrl` in `src/data/config.ts` if you rename it).

## Project structure

```
src/
  app/                    Routes (App Router)
    page.tsx              Homepage — assembles the section components
    layout.tsx             Root layout, fonts, global <head> metadata
    work/[slug]/page.tsx    Case-study route, statically generated per project
    sitemap.ts, robots.ts   SEO files
    opengraph-image.tsx     Generated OG/social preview image
    not-found.tsx           Custom 404
  components/
    layout/                Navbar, Footer
    sections/               Hero, FeaturedWork, Experience, About, Services, ContactCTA
    project/                ProjectShowcase (homepage card), ProjectVisual (mockup/screenshot frame)
    case-study/              CaseStudyLayout (full case-study template), ArchitectureDiagram
    ui/                      Reusable primitives — Button, Badge, Container,
                              Section/SectionLabel, ExperienceTimeline, Reveal/RevealText,
                              icons (GitHub/LinkedIn)
  data/                    All editable content (see table above)
  types/                   Shared TypeScript types for the data layer
  lib/                     className helper, reduced-motion hook, project visual lookup
```

## Design system notes

Neo-brutalist black & red. The rules are encoded in `src/app/globals.css` so components don't
each invent their own — read that file's header comment before adding UI.

**Colour.** CSS variables mapped into Tailwind via `@theme inline` (`bg-background`,
`text-foreground-muted`, `border-border-strong`, `text-accent`, …). Both themes are live:
`[data-theme="light"]` redefines the same tokens and `ThemeToggle` flips the attribute, so
nothing else needs light/dark variants. Never hardcode `bg-white/x` — use `bg-foreground/x`
so surfaces invert with the theme. The light accent is a darker red (`#cc0000`): the dark
theme's `#ff2b1f` only reaches 3.7:1 on white and fails body-text contrast.

**Spacing scale.** Four vertical rhythms, and nothing else:

| Level | Padding | Used by |
| --- | --- | --- |
| Page section | `py-20 sm:py-28` | `Section`, hero, case-study header, blog pages |
| Article section | `py-14 sm:py-16` | `CaseStudySection`, case-study visuals |
| List row (large) | `py-12` | project rows, case-study prev/next |
| List row (small) | `py-6` | services, blog index rows |

Chrome is separate: navbar `h-16 sm:h-20`, footer `py-10`.

**Columns.** One rail, sitewide. `--rail` (10rem) and `--rail-gap` (3rem) in `globals.css` drive
`lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]`, used by `Section`, the hero, and every
case-study section — so the content column sits on the same left edge on every page and does not
shift when you navigate from `/#work` into a case study. Nested label columns (e.g. the About
stack list) use `8rem`. Don't introduce a third width.

**Structure.** 2px `border-border-strong` rules separate sections; 1px `border-border` hairlines
divide rows *inside* a section. Depth is the `.brutal` / `.brutal-fg` hard offset shadow (no
blur), never a gradient or glow. Nothing is rounded — there are no `rounded-*` classes in the
codebase and new UI shouldn't add any.

**Labels.** `SectionLabel` (solid red block, mono, uppercase) is the only section-heading style.
Sections do not get an eyebrow + serif heading + description stack; the hero and the closing CTA
are the only large type on the homepage.

> **Gotcha:** the global `* { border-color }` reset **must** stay inside `@layer base`. Unlayered
> declarations outrank every layered one, so a bare `*` rule silently beats `border-border-strong`
> and every other border-colour utility — which is exactly what it did until it was wrapped.

- `prefers-reduced-motion` is handled globally in `globals.css`, including the `.brutal` press.
- No CSS/JS animation or icon libraries beyond Framer Motion and `lucide-react`. `lucide-react`
  dropped brand icons from its core set, so GitHub/LinkedIn glyphs are small local SVGs in
  `src/components/ui/icons.tsx`.

## Deployment

Any Next.js host works. The easiest path:

**Vercel** (zero-config):
1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. After the first deploy, confirm the assigned `.vercel.app` URL (or your custom domain once
   added) matches `siteUrl` in `src/data/config.ts` — it feeds `metadataBase`, the sitemap, and
   OpenGraph tags. Update and redeploy if it doesn't match.

**Self-hosted / Docker / any Node host:**
```bash
npm run build
npm run start   # serves on port 3000 by default
```

## Remaining placeholders

Name, email, GitHub/LinkedIn, work history, tech stack, and resume are filled in with real
information. Search `src/data/` for `TODO` to find what's still open:

- **`src/data/config.ts`** — `siteUrl` is still the placeholder
  (`https://portfolio-website.vercel.app`). It feeds `metadataBase`, every URL in `sitemap.xml`,
  the sitemap reference in `robots.txt`, the OpenGraph tags and the RSS feed, so set it to the
  real domain before relying on search or link previews.
- **`src/data/projects.ts`** — Moementum now leads the list with a real screenshot, gallery, and
  live demo link (`links.github` still needs the repo URL — it's a `TODO` in the file). The other
  three case studies (AI Meeting Intelligence, Real-Time Task & Notification Platform, Donor &
  Campaign Platform Modernization) are written from real work, but still have no live demo URL,
  GitHub link, or screenshot — add those in `links` / `image` if/when available. The realtime
  platform is a generalized architecture pattern rather than a named past project; swap in a real
  one if you have it.
- **Screenshots** — Moementum's cover and gallery images
  (`public/images/projects/moementum-fit/`) were cropped from small browser captures
  (~720–790px wide), not the recommended 1600×1000. They work but will look soft on large/retina
  screens — swap in full-resolution captures when convenient. A project's `gallery` field
  (`src/types/index.ts`) renders extra screenshots on its case-study page beneath the main cover
  image; `image` alone is enough if you don't have extras.
- **Favicon** — `src/app/icon.tsx` now generates one from the site's own palette (dark background,
  accent-colored "WA" monogram), replacing the old default Next.js icon.
- **OG image** — `src/app/opengraph-image.tsx` generates the social preview from `siteConfig`, no
  action needed unless you want a different design.
