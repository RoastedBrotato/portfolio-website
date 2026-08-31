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

Page copy that isn't data-driven (hero headline, about paragraph, contact section wording) lives
directly in its section component under `src/components/sections/`.

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
    sections/               Hero, CredibilityStrip, FeaturedWork, Services,
                             Experience, TechStack, About, ContactCTA
    project/                ProjectShowcase (homepage card), ProjectVisual (mockup/screenshot frame)
    case-study/              CaseStudyLayout (full case-study template), ArchitectureDiagram
    ui/                      Reusable primitives — Button, Badge, Container, SectionHeading,
                              ServiceCard, ExperienceTimeline, icons (GitHub/LinkedIn)
  data/                    All editable content (see table above)
  types/                   Shared TypeScript types for the data layer
  lib/utils.ts             Small className helper
```

## Design system notes

- Colors are CSS variables defined in `src/app/globals.css` and mapped into Tailwind via
  `@theme inline` (`bg-background`, `text-foreground-muted`, `border-border`, `text-accent`, etc.).
  The site ships dark-only, but a `[data-theme="light"]` palette is already defined — wiring up a
  toggle later is a matter of adding a `data-theme` attribute switch, not restructuring colors.
- Respect `prefers-reduced-motion` is handled globally in `globals.css`.
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

- **`src/data/config.ts`** — `siteUrl` is set to the expected Vercel default
  (`https://portfolio-website.vercel.app`); confirm it matches the real deployment URL after your
  first deploy, or swap in a custom domain later.
- **`src/data/projects.ts`** — all three case studies (AI Meeting Intelligence, Real-Time Task &
  Notification Platform, Donor & Campaign Platform Modernization) are written from real work, but
  none have a live demo URL, GitHub link, or screenshot — add those in `links` / `image` if/when
  available. The realtime platform is a generalized architecture pattern rather than a named past
  project; swap in a real one if you have it. Note: moementum.fit (built at Al Sufun Trading, live,
  with a GitHub repo and 10 active clients) is a strong candidate for a 4th case study with real
  demo/GitHub links — worth adding as a full write-up later.
- **Favicon** — `src/app/icon.tsx` now generates one from the site's own palette (dark background,
  accent-colored "WA" monogram), replacing the old default Next.js icon.
- **OG image** — `src/app/opengraph-image.tsx` generates the social preview from `siteConfig`, no
  action needed unless you want a different design.
