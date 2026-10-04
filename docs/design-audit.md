# Design audit and redesign brief

**Site:** waleedajaz.com (Next.js 16, Tailwind 4, Framer Motion, Lenis, React Three Fiber)
**Original audit:** 4 October 2026, against commit `f67651d`.
**This revision:** 4 October 2026, against `5db34c2` (phases 1 to 4 in `e447110` and `7cdc95e`, performance pass in `5db34c2`). Sections 1 to 9 now describe the site **as it is**, with the pre-redesign state kept only where it explains a decision. Section 0 is the implementation log.
**Purpose:** handoff document. The goal of the site is to convert paid social traffic (Instagram, X, LinkedIn ads) into quote requests for creative-dev work: immersive landing pages, brand sites, interactive 3D.
**Status:** structurally done and committed (`7cdc95e`), with a performance pass on top. **Blocking ads:** prices and social handles (owner content) and a real-device pass. Full list in 0.3 and section 1.

---

## 0. Implementation log

### 0.1 Done (Phase 0 code items + Phase 1)

| Audit item | What shipped | Where |
|---|---|---|
| F3, 5.1 Five-section homepage | Hero, Work, What I build, Proof, Contact. Sections numbered 01 to 04 in the rail. About, Experience, Writing and the embedded form removed. | `src/app/page.tsx` |
| F1 interim | While `work.ts` has no real entries, the engineering strip takes the `#work` slot labelled "Work", so "See the work" never lands on nothing. Selected work takes over automatically once a non-placeholder entry exists. | `src/app/page.tsx` |
| 5.2 `/about` | Bio (location + resume in the rail), engineering strip, experience timeline (each role collapsed, current one open), stack, latest writing, "Elsewhere" links (Lab, Blog, Reviews), CTA. | `src/app/about/` |
| 5.2 `/work` index | Selected work (when it exists), then the engineering case studies. No type filter yet: there is only one type. | `src/app/work/page.tsx` |
| 5.2 `/services` | `/pricing` moved here, with a 308 redirect in `next.config.ts`. Package cards have anchors (`/services#interactive-3d`). Embedded form replaced by the CTA. `pricing_view` event name kept for continuity. | `src/app/services/` |
| F6, 7.4 Navbar | Work, Services, About, Blog, Get a quote (Blog added at the owner's request — posted to regularly, so worth one click; departs from 5.2). Search kept. Theme toggle removed. Red scroll-progress line on the header rule. | `src/data/nav.ts`, `Navbar.tsx` |
| F9 Light mode | Dark-only. `next-themes` and `ThemeToggle` removed; `[data-theme="light"]` tokens kept in CSS, unused. | `layout.tsx`, `globals.css` |
| 7.4 Footer | Availability + location; links to Work, Services, About, Lab, Blog, Reviews, Get a quote; socials. | `Footer.tsx` |
| 4.3 Depth range | `--plane-0..3` (`#050505` to `#161616`) as `bg-plane-*`. `Section` takes a `tone`; the homepage steps base → plane-1 → plane-2 → plane-1, footer on plane-0. | `globals.css`, `Section.tsx` |
| 4.3, 6.2 Grain | Fixed SVG-noise layer at 4%, stepped shimmer, static under reduced motion. | `.grain` in `globals.css`, div in `layout.tsx` |
| 5.3 Section weights | Immersive: `SelectedWork` lead piece (full-bleed, `text-mega` title over the clip's bottom edge). Editorial: `Section`. Utility: Proof. Documented in the README. | `SelectedWork.tsx`, `WorkCard.tsx` |
| 6.2 Page transitions | React `<ViewTransition>` in `app/template.tsx`. The old page lifts out (200 ms, exit ease) and the new page uncovers bottom-up (600 ms, entrance ease). The header is named `site-header` so it holds still. Reduced motion zeroes the durations. | `template.tsx`, `globals.css` |
| 4.3, 7.3 Media frame | Browser chrome removed. Screenshots sit inset on a `#161616` plane with a mono caption bar. | `ProjectVisual.tsx` |
| 7.3 Work card hover | Title slides 8 px, red rule draws under it, clip scales 1.03. | `WorkCard.tsx` |
| 7.4 What I build | Packages as large rows with "from" price and timeline (reads `formatPrice`, so real numbers show up as soon as they're set), linking to `/services#id`. A fourth row links to `/work#engineering`. | `Services.tsx` |
| F11, 7.4 Proof | Marquee phrases are now "Shipped / Live / Open source / In daily use". Sits directly above the CTA. | `Testimonials.tsx` |
| F11, 7.4 Contact | No embedded form: Get a quote + Book a call + email. The only form is on `/quote`; `QuotePlacement` narrowed to `"quote-page"`. | `ContactCTA.tsx`, `QuoteForm.tsx` |
| F2, F11, 5.4 Hero copy | Support line cut to one sentence, Lab link dropped, availability line moved to the footer, "See the work" → `/work`. Headline unchanged (still marked DRAFT, alternatives in a comment). | `Hero.tsx` |
| 5.4 Outcome lines | Moementum: "A coaching platform with 10 active clients logging in daily." ("active", not "paying": only "active" is verified.) KnowledgeOS and Meeting Intelligence as proposed. | `projects.ts` |
| F11 Resume link | Moved from the Experience rail to the bio rail on `/about`. | `About.tsx` |
| F10 partial | Share cards added for `/about`, `/work` and each case study. | `opengraph-image.tsx` files |
| Sitemap | `/services`, `/work`, `/about` added; `/lab` only listed when it has entries. | `sitemap.ts` |
| Bug (not in audit) | Reduced-motion headings joined inline words with non-breaking spaces, so long headings overflowed sideways on phones. Fixed. | `RevealText.tsx` |

Measured after Phase 1 (production build, placeholders hidden): homepage **4.6** viewport heights at 1440 × 900 (was ≈ 8.9) and **6.8** at 390 × 844. No horizontal overflow at 390 px.

### 0.2 Done (Phases 2, 3 and 4)

| Audit item | What shipped | Where |
|---|---|---|
| F2, 7.2 Hero scene (direction A) | Instanced slab field (748 slabs full / 468 lite, one draw call) lit by a red point light that follows the pointer, or drifts on touch. Scroll tilts the field and pulls the camera back. Fog hides the edges; a scrim keeps the copy legible. | `src/components/scene/HeroScene.tsx` |
| 6.4 Device tiers | Decided on idle after hydration, before three.js downloads: `full`, `lite` (touch / ≤4 cores / ≤4 GB: fewer slabs, dpr 0.75–1, no AA), `still` (reduced motion: one frame), `fallback` (no WebGL, Save-Data, ≤2 cores: the 2D `HeroGrid`, restored from `f67651d`). `HeroSpotlight` removed. | `src/lib/sceneTier.ts`, `useSceneTier.ts`, `HeroBackdrop.tsx` |
| 6.2 Pinned hero → work | CSS sticky: the hero pins for 50svh while Selected work slides over it; the scene keeps reading scroll underneath. Only when a real lead entry exists. | `src/app/page.tsx` |
| 6.1.8 Scene events | `hero_scene_loaded {tier}`, `hero_scene_fallback {reason}`. | `analytics.ts` |
| F10 OG image | Every share card now renders over a still of the hero scene (`public/og/hero.jpg`, inlined at build). | `src/lib/ogImage.tsx` |
| 7.1 Selected work | **Changed from the audit:** the site itself is *not* a piece (it read as the page repeating itself). Lineup: Benda Offroad (lead), 3dbanao, CreateXworks — client sites linking to their live builds — then the two Quarr One demos. Clips and posters were recorded from the live sites with Playwright + ffmpeg (all under 850 KB). | `src/data/work.ts`, `public/work/*` |
| 7.1 Configurator demo | Quarr One, a fictional speaker modelled from primitives (no model file), lit with Lightformers (no HDR). Three colourways, exploded view, scripted camera intro, orbit without zoom. ≈ 290 KB gz of scene JS, lazy. | `/lab/configurator`, `src/components/scene/speaker/*` |
| 7.1 Fictional launch page | Same speaker: display-type opener, 400svh pinned scroll sequence (turn / open / colour / hear, aria-live captions), the numbers, a waitlist that sends nothing. Fictional-product banner on every screen. | `/lab/launch`, `LaunchPage.tsx` |
| 5.2 Creative case-study template | Full-bleed lead clip, brief, sequence with sticky captions, "how it was built" (stack, measured budget, notes), result, next piece. Shares `/work/[slug]` with the engineering template. Used by the two Quarr pieces. | `CreativeStudyLayout.tsx`, `work.ts` (`study`) |
| Lab | Two real entries (the demos); internal links open in the same tab. Still out of the primary nav (rule: three entries). | `src/data/lab.ts` |
| 6.2 Cursor | Red square companion, fine pointer only, off under reduced motion; grows on interactive elements, opens to "View" on work media. Native cursor kept. | `src/components/Cursor.tsx` |
| 6.2 Count-ups | First number in a string counts up once on view (0.4 s); server renders the final value, no CLS. Proof stats, package prices (once set), launch-page numbers. | `src/components/ui/CountUp.tsx` |
| 6.2 Diagram draw-on | Architecture connectors are SVG paths drawn with pathLength; arrowheads land after. | `ArchitectureDiagram.tsx` |
| 8.9 Scroll depth | `scroll_depth {section}` once per view for work / services / reviews / contact. | `src/components/ScrollDepth.tsx` |
| 5.2 Two-step quote form | Step 1: type, budget, timeline → `quote_step` event with the choices, saved to sessionStorage. Step 2: details. One `<form>`, so server validation is unchanged. Success state lands the red square mark. | `QuoteForm.tsx` |
| 6.4 LCP fix (partial) | On-load reveals (`RevealText trigger="mount"`, hero copy) moved from Framer to CSS keyframes so they don't wait for hydration. Section numbers lifted to pass contrast. | `RevealText.tsx`, `Hero.tsx`, `globals.css` |
| 6.4 CLS fix | Lighthouse found a **0.19 layout shift** on the hero column: the fallback font wrapped the headline to 3 lines and Fraunces to 4, so everything below jumped 46 px when the font arrived. Fraunces now loads as the bold instance only (20 + 24 KB instead of 45 + 29), and its fallback face is declared by hand with a size-adjust measured against the bold (124.6%). The headline wraps identically in both fonts; CLS measured 0. | `layout.tsx`, `globals.css` |
| 6.3 Lighter Framer Motion | All animated elements are `m.*` inside a `LazyMotion` provider with `domAnimation`, so the drag and layout-projection code never ships. `strict` throws in dev if a `motion.*` slips back in. About 40 KB less JavaScript transferred. | `MotionProvider.tsx`, seven component files |
| Bundle hygiene | The command palette imported the full projects data, so every case study's prose shipped to the client on every page. The layout now passes `{slug, title, category}` only. | `layout.tsx`, `CommandPalette.tsx` |
| 6.4 First layout | Below-the-fold sections, Selected work and the footer use `content-visibility: auto` (`.defer-render`), so the first layout before first paint skips what the visitor can't see. The grain layer shrank from a 2×2-viewport box (`inset: -50%`) to a 6% bleed. | `globals.css`, `Section.tsx`, `SelectedWork.tsx`, `Testimonials.tsx`, `Footer.tsx` |
| 4.4 Mark | The favicon is now the red square alone (no monogram). The same square is the cursor companion, the nav mark, the footer mark, the bullet and the quote success state. | `src/app/icon.tsx`, `Cursor.tsx` |

Lighthouse, homepage, mobile perf preset (simulated slow 4G, 4× CPU), local production build, two runs per stage:

| Stage | Performance | FCP | LCP | TBT | CLS | Transfer |
|---|---|---|---|---|---|---|
| Before the perf pass (`7cdc95e`) | 61 | 2.7 s | 2.8 s | 730 ms | **0.19** | 956 KB |
| Bold-only Fraunces, LazyMotion, slim palette, content-visibility | 65 | 2.6 s | 2.6 s | 680 ms | 0.19 | 897 KB |
| Plus the hand-tuned fallback face | **71–74** | 2.6 s | 2.6–2.7 s | 680–760 ms | **0** | 897 KB |

Accessibility 100, SEO 100 and Best practices 96 are unchanged from the earlier full run (the two misses are the Cloudflare beacon's CORS error on localhost and missing source maps). The earlier note of "LCP 4.8 s" came from a different Lighthouse configuration; the perf preset above is the comparable baseline going forward.

### 0.3 Still open

**Content only the owner can supply (blocks ads):**
- Prices in `src/data/pricing.ts`, **two per package** since regional pricing landed: `startingFrom: { pk, intl }`, PKR for visitors in Pakistan and USD elsewhere. **Draft market rates are live** (Rs 150k / 400k / 550k; $2,500 / $6,000 / $8,000, marked `// DRAFT — market rate, Oct 2026`) pending the owner's review. The budget bands in `budgetRangesByRegion` bracket them as they stand; revisit if the prices move much. Region is decided client-side before paint from the time zone (`Asia/Karachi` → PKR), with a visible switch that remembers the choice; pages stay static. See `src/lib/region.ts`.
- Year, and ideally a write-up (`study`), for the three client pieces in `work.ts`. Without a study they link straight to the live site.
- Hero headline: still the pre-redesign line, marked DRAFT. Alternatives are in a comment in `Hero.tsx`.
- Third proof item in `proof.ts` is a dev-only placeholder; the strip ships with two cards.

**Performance:**
- **LCP is 2.6–2.7 s on the mobile preset against a 2.5 s budget.** The remaining gap is one task: the page's first layout, about 640 ms at 4× CPU throttle, which runs before first paint. Measurement showed it is the cost of laying out text in the size-adjusted `local()` fallback faces while the web fonts are still loading (fallback layout ≈ 480 ms, web-font layout ≈ 180 ms, plain system fonts ≈ 220 ms). That cost is at least partly specific to Windows font lookup and may not reproduce on Android or on PageSpeed Insights' Linux runners, so check PSI against the deployed site before spending more on it. If it does reproduce: drop the adjusted fallback for the body fonts (`adjustFontFallback: false` on Geist and Geist Mono, keeping the hand-tuned Fraunces face), or `display: "optional"` for the body fonts only.
- TBT 680–760 ms. Largest contributors in order: the first layout above, three.js evaluation (≈ 310 ms; it loads on idle so it lands inside the measurement window), React hydration (≈ 200 ms).
- Real-device pass on a mid-range Android inside the Instagram in-app browser (not done; only desktop GPU and SwiftShader were tested).

**Deferred:**
- Inline visuals for the What I build rows (5.1, 6.2).
- One visual per package on `/services` (5.2).
- Engineering case-study tightening (merge Overview + Problem, fold Challenges + Decisions into "Notes").
- `/work` type filter; preloader (6.2 — skipped: the scene loads on idle and fades in, so there is nothing to wait for).
- A/B hero headlines via ad landing variants (needs the ad setup).
- Lab back into the nav at three entries. Reviews back into the nav at three approved reviews.

### 0.4 Handoff notes

- **Re-cutting clips.** Pieces are recorded from the live sites in headless Chrome on the real GPU (`channel: "chrome"`, `--use-angle=d3d11`; SwiftShader runs at ~2 fps and is useless for video), then trimmed and encoded with `ffmpeg -c:v libx264 -crf 27 -movflags +faststart`. Hide the site header and the cursor companion (`[class*='z-[90]']`) when recording this site's own pages, or the footage shows the site inside itself.
- **OG still.** Re-capture `public/og/hero.jpg` (1200 × 630, scene only, light off to the right) whenever the hero scene changes.
- **One scroll system.** Lenis owns scroll; every scroll-linked effect (hero scene, launch sequence, nav progress) reads native scroll or Framer's `useScroll`, both of which work under Lenis. No GSAP was needed.
- **Three.js stays out of the main bundle.** Scenes load through `next/dynamic` with `ssr: false`; anything a page needs from the speaker (colourways) lives in `colorways.ts`, which imports no three.
- **React Compiler lint.** Mutating values from `useMemo` or props inside `useFrame` fails `react-hooks/immutability`; use refs created lazily inside the frame callback (see `HeroScene.tsx`) or read from the R3F `state` argument.
- **Framer Motion.** Use `m.div`, never `motion.div`; the provider is `strict`. Hooks (`useScroll`, `useSpring`, `animate`) are unaffected. If a future piece needs `drag` or `layoutId`, switch the provider to `domMax` and re-check the bundle.
- **Fonts.** Fraunces ships as the 700 instance only. If a non-bold display weight is ever needed, add it to `weight` and re-measure the fallback's `size-adjust` (method in the `@font-face` comment in `globals.css`). The measurements behind the perf pass were Playwright + CDP `Performance.getMetrics` at 4× CPU throttle, and Lighthouse's mobile perf preset.
- **Deferred rendering.** `.defer-render` is on `Section`, `SelectedWork`, `Testimonials` and the footer. Anything that measures a section's size before it has scrolled near the viewport will read the placeholder height (900 px) instead of the real one.

---

## 1. Where the site stands

The structural problems from the original audit are fixed. The site now does the thing it sells: the hero is a real-time scene, the work section leads with full-bleed motion, routes transition, and two of the five work pieces are live demos of the exact packages on the services page. The homepage is about half its previous length and nothing on it is CV content.

What a visitor from an ad sees today:

- A 100svh hero with an instanced 3D field lit by a red light that follows their pointer, a headline, one sentence, and two buttons. On a phone the light drifts on its own; on a weak device the 2D grid takes over; under reduced motion a single still frame.
- Five creative pieces: three client sites (Benda Offroad full-bleed as the lead, 3dbanao, CreateXworks) and the two Quarr One demos, each with a looping clip.
- The three packages as large rows with timeline and a "from" price slot, then a small link to the engineering case studies.
- A proof strip of two verifiable facts over the oversized marquee, directly above the closing CTA.

The brand gap the audit named, **Physical**, is closed at the level that matters: light, depth and material are now on the page, and they extend the existing black-and-red system rather than replacing it.

What still stands between the site and an ad campaign, in order:

1. **Prices.** All three packages still render "Quote on request". This was finding F7 and it is untouched because only the owner can set the numbers.
2. **The hero's mobile LCP.** 2.6–2.7 s against a 2.5 s budget in Lighthouse's mobile preset after the perf pass (the 0.19 layout shift found in the same run is fixed). What remains is the page's first layout while fonts load, which may be a Windows-only cost. Verify on PageSpeed Insights once deployed before doing more.
3. **Social handles.** Instagram and X are empty in config, so the icons do not render.
4. **A real-device pass** on a mid-range Android in the Instagram in-app browser. Tier detection should land these devices on `lite`, but it has only been reasoned about, not watched.
5. **Years and write-ups for the client pieces**, and a decision on the hero headline, which is still the pre-redesign draft.

Smaller things that would lift the page further are in 0.3 under "Deferred". None of them block launch.

---

## 2. What exists today

### 2.1 Information architecture

| Route | What it is | State |
|---|---|---|
| `/` | Hero (pinned) → Selected work → What I build → Proof → Contact | Live. Five real work pieces. Prices show "Quote on request". |
| `/work` | Selected work, then the engineering case studies, then CTA | Live. No type filter (not needed yet). |
| `/work/[slug]` | Engineering case studies (Moementum, KnowledgeOS, AI Meeting Intelligence) and creative studies (Quarr configurator, Quarr launch) under one route, two templates | Live. Meeting Intelligence still has no cover image and uses the generated visual; two engineering studies have no demo or repo link. |
| `/services` | 3 packages + custom, process, FAQ, CTA. `/pricing` redirects here (308). | Live. Every `startingFrom` is `TODO_PRICE`. |
| `/quote` | Two-step quote form with UTM attribution | Live, complete. The only form on the site. |
| `/about` | Bio, engineering strip, experience (collapsed), stack, writing, Elsewhere links, CTA | Live. |
| `/lab` | Experiments feed | Live, two entries (the Quarr demos). Footer and About only, not in the nav. |
| `/lab/configurator`, `/lab/launch` | The two live demos | Live. Three.js loads lazily per page. |
| `/reviews` | Approved testimonials + submit form | Live, no approved reviews yet. Footer and About only. |
| `/blog`, `/blog/[slug]` | 5 published posts | Live. In the nav at the owner's request. |
| `/admin/reviews` | Moderation for reviews, feedback and quote requests | Private. |

Navigation: Work, Services, About, Blog, plus Search and Get a quote. Four destinations and one CTA. Lab and Reviews return to the nav when each has three real entries.

### 2.2 Visual system (from `globals.css` and the README)

- **Palette:** black as a range, not a value. `--plane-0` to `--plane-3` (`#050505`, `#0a0a0a`, `#111`, `#161616`) step section backgrounds one level at a time. White text, greys at 7a and a3. Red `#ff2b1f` as the single accent, now also used as *light*: the hero's point light, the speaker studio's red strip. The light-theme tokens remain in CSS but nothing sets the attribute.
- **Type:** Fraunces (display), Geist Sans (body), Geist Mono (labels, nav, buttons, numbers). Fluid scales: `--text-display`, `--text-h1`, `--text-h2`, plus `--text-mega` (`clamp(3.5rem, 1rem + 9vw, 11rem)`) for titles meant to be read as images.
- **Structure:** 2 px white rules between sections, 1 px hairlines inside. No border radius. `.brutal` hard offset shadow for UI cards. One 10 rem rail with a red label and a running section number on Editorial sections. Three section weights: Immersive (full-bleed, no rail), Editorial (the rail grid), Utility (compact band).
- **Texture:** fixed SVG grain at 4% over the whole page, stepped shimmer, static under reduced motion. The 48 px grid is now a secondary texture (hero poster, page headers).
- **Motion:** Lenis smooth scroll. CSS keyframe reveals for on-load elements (so LCP does not wait for hydration), Framer `Reveal` for on-scroll blocks. View Transitions between routes with a held header. Scroll-linked marquee. Hero scene reads pointer and scroll. Red-square cursor companion on fine pointers. Count-up numbers. SVG draw-on for the architecture diagram. Everything respects reduced motion and Save-Data.
- **3D:** React Three Fiber + drei + three 0.186. Two scenes: the hero field (instanced, one draw call) and the Quarr One speaker (primitives, Lightformer studio, no texture or model downloads). All scene code is dynamically imported with `ssr: false`.
- **Mark:** the red square. Favicon, nav, footer, cursor, bullets, quote success state.
- **Components:** Button, SectionLabel + SectionIndex, Section (with `tone`), PageHeader, Badge, PackageCard, WorkCard + LeadWorkCard, MediaPreview, ProjectCard + ProjectVisual (plane and caption bar, no browser chrome), ProofCard, ReviewCard, CountUp, Cursor, ScrollDepth, FormField, HeroBackdrop + HeroScene, CreativeStudyLayout, CaseStudyLayout, ArchitectureDiagram.

### 2.3 What is working and should be protected

- The **data-driven content layer** (`src/data/*`). Work, lab, pricing, proof and projects are all data; the layouts have no hard-coded content.
- The **lead funnel**: `/quote` with two steps, UTM capture, placement, honeypot, rate limiting, and the Plausible events `quote_start`, `quote_step`, `quote_submit`, `booking_click`, `scroll_depth`, `hero_scene_loaded`, `hero_scene_fallback`.
- The **tiering and fallback discipline**: tier decided before three.js downloads, poster paints first, the 2D grid for weak devices, a still frame for reduced motion, clips that only play on screen and never under Save-Data. Keep this for anything added.
- **One scroll system.** Lenis owns scroll; every scroll-linked effect reads it. GSAP was not needed and should not be added casually.
- **Three.js out of the main bundle.** Both scenes are lazy; shared data (`colorways.ts`) imports no three.
- The **red square as the mark** and **Fraunces italic red as the emphasis gesture**. Both are now consistent across the site.
- The **blog's voice**, now reachable in one click without sitting in the funnel.

---

## 3. Findings from the original audit, with current status

Each finding keeps its original statement so the reasoning survives, followed by where it stands.

### F1. The flagship section was empty in production — **resolved**
`work.ts` had three placeholders, so Selected work did not render in a build. Now five real entries: Benda Offroad, 3dbanao, CreateXworks, Quarr One configurator, Quarr One launch page. The lead runs full-bleed. "See the work" goes to `/work`.
*Open:* year and `study` write-ups for the three client pieces.

### F2. The hero made the claim and showed nothing — **resolved**
A text headline over a faint grid with a near-invisible canvas effect. Now a tiered real-time scene (7.2 direction A) with the pinned transition into Selected work.
*Open:* the headline copy is still the original draft; mobile LCP is over budget (6.4).

### F3. The homepage was a CV — **resolved**
Nine sections, around nine viewport heights, most of it hiring-manager content. Now five sections, measured at 4.6 viewport heights on desktop and 6.8 on a 390 px phone. About, Experience, Writing and the embedded form moved to `/about`.

### F4. The three case studies pulled the brand toward "backend engineer" — **resolved**
Fake browser chrome around dark dashboards, titled "Engineering range", first thing under the hero. Now a compact strip under Selected work on `/work` and `/about`, linked from the homepage by a one-line row. Screenshots sit on a `#161616` plane with a caption bar. Outcome lines rewritten for a buyer.
*Open:* template tightening (merge Overview + Problem, fold Challenges + Decisions) is deferred. Meeting Intelligence still has no screenshot.

### F5. Nothing on the site used the medium it sells — **resolved**
No WebGL, no 3D, no pinning, no transitions, no video. Now: hero scene, two product scenes, a 400svh pinned scroll sequence, View Transitions, five looping clips, scroll-linked marquee, draw-on diagram, cursor companion. The package copy's promises ("camera choreography", "page transitions", "scroll-driven motion") each have a live example on the site.

### F6. Two nav links went to empty pages — **resolved**
Lab and Reviews removed from the nav; both live in the footer and on `/about`. Lab now has two entries and returns at three. Blog was added to the nav at the owner's request.

### F7. Pricing with no prices — **open, owner content**
All three packages still render "Quote on request" on `/services` and in the What I build rows. Set `startingFrom` in `pricing.ts`, then re-bracket `budgetRanges` around the real numbers. This is the single largest remaining conversion issue.

### F8. Visual monotony across the scroll — **resolved**
Every section was the same shape on flat black. Now the homepage steps through planes (base → plane-1 → plane-2 → plane-1, footer plane-0), alternates Immersive / Editorial / Utility weights, has a full-bleed lead piece and grain over everything.

### F9. Light mode worked against the brand — **resolved**
Toggle and `next-themes` removed. Site is dark-only; light tokens kept in CSS, unused.

### F10. The share card showed the problem too — **resolved**
Every OG image now renders over a still of the hero scene. Per-route cards exist for home, work, each case study, about, services, lab and quote.
*Maintenance:* re-capture `public/og/hero.jpg` when the scene changes.

### F11. Smaller issues

| Issue | Status |
|---|---|
| About repeated the tech stack; both duplicated the resume | Resolved. Stack is its own section on `/about`; resume link is in the bio rail only. |
| Services had no visuals | **Partially open.** Rows are large, with price and timeline slots, but no inline clip or canvas yet. Same for package cards on `/services`. |
| Marquee spent on filler words | Resolved. "Shipped / Live / Open source / In daily use". |
| Generated mockup shipped for Meeting Intelligence | **Open.** Needs a cover image. |
| Quote form appeared three times | Resolved. One form, on `/quote`. |
| Instagram and X empty in config | **Open, owner content.** |
| Resume link invited recruiters on the homepage | Resolved. Moved to `/about`. |
| Availability line was the last thing in the hero | Resolved. Moved to the footer. |

---

## 4. Brand identity

### 4.1 Positioning

Who it is for: founders, marketing leads and small studios who want a launch page, brand site or product showcase that **looks expensive and ships fast**, and who are nervous that a "creative" developer will deliver something beautiful and broken.

The differentiator: **six years shipping production systems, now applied to creative work.** Most creative developers are designers who learned enough code. You are an engineer who can do the creative work and will also wire the CMS, the analytics, the auth and the backend if the project needs it.

Working positioning line (the About page intro now carries a version of it):

> Immersive websites, engineered properly. Motion, 3D and the full-stack work underneath, from one developer.

### 4.2 Brand attributes

| Attribute | What it means on the page | What it rules out | Status |
|---|---|---|---|
| **Precise** | Grid-true layouts, mono labels, exact spacing, type that lines up. Motion with physical easing, never bouncy. | Rounded blobby shapes, pastel gradients, playful cartoon 3D. | Held throughout. The speaker is hard-edged primitives; the hero field is slabs. |
| **Physical** | Light, depth, material. Scenes have mass and respond to the cursor. Hard red stays, but the black gains depth. | Flat illustration, stock 3D icons, glassmorphism cards. | Delivered: plane range, grain, hero light, Lightformer studio, full-bleed media. |
| **Direct** | Short copy, prices on the page, one CTA per section, no filler sections. | Testimonial carousels, logo walls of nobody, "passionate about" copy. | Held, except **prices are not on the page yet**. |

### 4.3 Visual identity: evolve, do not replace

The system was extended by one dimension rather than replaced. What the audit asked for and what landed:

**Colour.** Depth range in place (`--plane-0..3`). Red appears as light in both scenes. A steel neutral is used in the speaker's rim light only; the UI still has one accent. Nothing else to do.

**Type.** `--text-mega` added for titles read as images (lead work card, launch opener). Fraunces italic red emphasis is the one headline gesture. The hero headline itself is still the pre-redesign draft.

**Shape.** Square corners everywhere in UI. Scene geometry is slabs, boxes and cylinders. Consistent.

**Texture.** Grain over the whole page at 4%. The 48 px grid demoted to a secondary texture. Done.

**Depth.** `.brutal` kept for cards. Real depth in the hero field, the speaker scenes, and the lead piece's title overlapping the clip. Done.

**Imagery.** Browser chrome gone. Work is shown as motion, full-bleed for the lead. Engineering screenshots on a plane with a caption bar. The remaining gap is the Meeting Intelligence cover.

**Voice.** Hero support line is one sentence. Hedges removed. Work descriptions and the Quarr studies are in the same dry first person. The headline is the one piece of copy still to decide.

### 4.4 Logo and marks — **done**

The red square is the mark. It is the favicon (no monogram), the nav and footer mark, the cursor companion, the bullet, and the quote form's success state. No separate logotype is needed; the name in mono caps plus the square is the wordmark.

---

## 5. Page structure

### 5.1 Homepage: five sections, one scroll story — **built**

Target was about 5 viewport heights on desktop and 7 on mobile. Measured: **4.6 and 6.8**.

| # | Section | Job | What is there | Weight | Gaps |
|---|---|---|---|---|---|
| 1 | **Hero** | Prove the claim in three seconds. | Tiered R3F scene, headline, one sentence, "See the work" + "Get a quote". Pins for 50svh while Selected work slides over it. | Immersive | Headline is a draft. Mobile LCP over budget. |
| 2 | **Selected work** | Show the creative pieces. | Benda Offroad full-bleed lead with `text-mega` title over the clip; four more in a two-up grid, each with clip, tags, one line, links. | Immersive | Client pieces lack year and study. |
| 3 | **What I build** | Translate work into something buyable. | Three large rows: number, name, outcome, "from" price (count-up once set), timeline, link to `/services#id`. Fourth small row to the engineering case studies. | Editorial (plane-1) | Prices. Inline visuals per row deferred. |
| 4 | **Proof** | Lower risk. | Two proof cards (10 active clients on Moementum; KnowledgeOS open source) over the marquee. Switches to reviews automatically once any are approved. | Utility (plane-2) | A third verifiable fact; eventually real reviews. |
| 5 | **Contact** | Convert. | "Tell me what you're building.", one paragraph, Get a quote + Book a call + email. No form. | Editorial (plane-1) | Book a call hidden until `NEXT_PUBLIC_BOOKING_URL` is set. |

Scroll-depth events fire once per view for work, services, reviews and contact.

### 5.2 Other pages

| Page | Audit ask | Status |
|---|---|---|
| `/work` | Index of creative pieces plus engineering studies, filterable. | Built without the filter; one type of creative piece so far. |
| `/work/[slug]` creative template | Full-bleed clip, brief, sequence with sticky captions, how it was built, result, next. | Built (`CreativeStudyLayout`). Used by the two Quarr pieces. |
| `/work/[slug]` engineering template | Tighten: merge Overview + Problem, fold Challenges + Decisions into Notes, replace the browser frame. | Frame replaced. Section merge deferred; seven sections remain. |
| `/services` | Rename from pricing with redirect, real prices, process, FAQ, CTA, one visual per package. | Built with redirect. Prices and per-package visuals open. |
| `/about` | Bio, engineering strip, collapsed experience, stack, resume, location, review link. | Built. Review link is in "Elsewhere". |
| `/lab` | Hidden from nav until three entries. | Two entries; footer and About only. |
| `/blog` | Footer and About only. | Owner chose to keep it in the nav. Reasonable: it is posted to weekly and is not an empty page. |
| `/quote` | Consider a two-step form. | Built. Step one's choices persist in sessionStorage and fire `quote_step`. |

### 5.3 Three section weights — **in use**

| Weight | Layout | Background | Type | Motion | Where it is used |
|---|---|---|---|---|---|
| **Immersive** | Full-bleed, no rail. Content floats over media. | Scene, clip or large image. Grain. | `--text-mega`, often over the media. | Scroll-linked: pinning, parallax, scrubbed sequences. | Hero, lead work card, launch page opener and sequence, creative study hero. |
| **Editorial** | The rail grid. Label and number left, content right. | A plane one step from its neighbours. | h2 at `--text-h2`, body 1.125 rem. | Entrance reveals, hover states. | `Section` everywhere else. |
| **Utility** | Full-width band, compact. | Thin rules. | Mono labels and numbers. | Minimal. Marquee allowed. | Proof, footer. |

Rule held: the only place two Immersive sections touch is Hero into Selected work, and that join is the pinned transition.

### 5.4 Copy direction for key surfaces

- **Hero headline.** Still "Websites people remember, engineered to last." Alternatives are in a comment in `Hero.tsx`: "Websites that move. Engineering that holds." / "Immersive sites, built like software." Decide, keep one italic red word, and consider A/B via ad landing variants once ads run.
- **Hero support line.** Done: "Immersive landing pages, brand sites and interactive 3D, built on years of shipping full-stack and AI systems."
- **Engineering outcome lines.** Done, with "active" rather than "paying" clients because only "active" is verified.
- **Work descriptions.** Marked DRAFT in `work.ts`. They are serviceable. Review once the client pieces have years.
- **Proof numbers.** Two defensible facts. Add a third only when it can carry a link.

---

## 6. Motion and interaction design

### 6.1 Principles

These were the brief and they are now the rules to hold additions to.

1. **Motion is content, not decoration.** Every effect on the site is something a client could buy: the scene, the pinned sequence, the transitions, the clips.
2. **Scroll is the timeline.** The hero tilt, the launch sequence, the marquee and the nav progress line are all scroll-linked. Nothing autoplays except muted clips on screen.
3. **Physical easing.** Entrances `[0.16, 1, 0.3, 1]`, exits `[0.7, 0, 0.84, 0]`, springs only for the cursor and nav progress. No bounce.
4. **Durations are short.** Reveals 0.4 to 0.8 s, transitions 0.2 s out / 0.6 s in, count-ups 0.4 s. Only pinned sequences take longer, and the visitor scrubs them.
5. **One hero moment per page.** Home: the scene. Launch page: the sequence. Configurator: the camera intro. Creative study: the lead clip. Everything else is Editorial or Utility.
6. **Budget first.** Target is 60 fps on a 2022 mid-range Android in the Instagram in-app browser. Hero field: one instanced mesh, one draw call, one point light plus two fills, no post-processing, fog instead of geometry. Speaker: primitives, Lightformers, ≈ 290 KB gzipped scene JS, no model or HDR download. Clips all under 850 KB.
7. **Always a fallback.** Four hero tiers. Clips never render under Save-Data or reduced motion (poster instead). Transitions and grain go static under reduced motion. Cursor companion only on fine pointers.
8. **Measure.** `hero_scene_loaded {tier}`, `hero_scene_fallback {reason}`, `scroll_depth {section}`, `quote_step`, `quote_start`, `quote_submit`, `booking_click`.

### 6.2 Where motion goes, section by section — status

**Global**
- *Page transitions.* ✅ View Transitions via `app/template.tsx`; header held still with a named group.
- *Preloader.* Skipped on purpose. The poster paints first and the scene fades in on its first frame, so there is nothing to wait for.
- *Cursor.* ✅ Red square companion, fine pointer only, grows on interactive elements, reads "View" over work media. Native cursor kept.
- *Grain.* ✅ Fixed layer at 4%.
- *Smooth scroll.* ✅ Lenis. No GSAP.

**Hero**
- ✅ Scene fills the viewport behind the type and is visible before the words land (CSS reveals, not Framer).
- ✅ Pinned transition into Selected work: sticky hero for 50svh while the work section slides over it. The audit asked for roughly 1.5 viewport heights; 0.5 was chosen to keep the page short on phones. Revisit if analytics show people stopping in the hero.

**Selected work**
- ✅ Lead piece full-bleed with the title in `--text-mega` over the clip's bottom edge, darkened strip under the title.
- ✅ Two-up grid; clips play on screen only; hover scales the clip, slides the title, draws the red rule.
- Parallax on the lead clip (0.85× scroll) was not added. Low priority.
- Horizontal strip at five or more pieces: there are now five; still not warranted on desktop. Revisit at eight.

**What I build**
- ✅ Large rows, count-up on price (once prices exist).
- ⏳ Inline visual per row (3 s clip crop or small canvas) deferred.

**Proof**
- ✅ Marquee with real words. ✅ Count-ups on stats.

**Contact**
- ✅ Display headline, red emphasis word, `.brutal` press.

**Creative case study pages**
- ✅ Lead clip, sequence with sticky captions, how it was built with measured budget.
- Live embed of the piece inside the study was not added; the "View live" link opens the demo instead.

**Engineering case study pages**
- ✅ Architecture diagram draws on view.

**Services page**
- ✅ FAQ with `<details>`. ⏳ Package card hover lift and per-package visual deferred.

**Quote page**
- ✅ Two steps; success state lands the red square.

### 6.3 Libraries: what was recommended and what was used

| Need | Recommended | Used | Note |
|---|---|---|---|
| Smooth scroll | Lenis | **Lenis** | Owns scroll sitewide. |
| Scroll-linked and pinned sequences | GSAP + ScrollTrigger | **Framer `useScroll` + CSS sticky** | Sufficient for the hero tilt, the 400svh launch sequence and the nav progress. Add GSAP only if a future piece needs timeline sequencing Framer cannot express. |
| UI entrances, presence | Framer Motion | **Framer Motion**, plus CSS keyframes for on-load reveals | CSS for anything that must show before hydration (LCP). |
| Page transitions | View Transitions API with Framer fallback | **React `<ViewTransition>`** | Browsers without the API swap pages plainly. |
| Real-time 3D | Three.js via R3F + drei | **R3F 9, drei 10, three 0.186** | Dynamic import, `ssr: false`. |
| Scroll scrubbing in 3D | Drive from the page's scroll system | **Scene reads the page scroll value** | One scroll owner. |
| Shaders | GLSL via `shaderMaterial` | **Not needed yet** | Standard materials and Lightformers cover both scenes. |
| Text splitting | Framer per-word | **Framer per-word (on scroll), CSS per-word (on load)** | |
| Image sequences | Canvas with WebP frames | **Not needed** | The launch sequence is live 3D. |

Still do not add: Locomotive Scroll, AOS, Swiper, Lottie for anything structural, Spline embeds.

### 6.4 Performance and accessibility budget — status

| Budget | Status |
|---|---|
| LCP under 2.5 s on 4G, poster as LCP element | **Close.** 2.6–2.7 s in Lighthouse's mobile preset. Bounded by the first layout while fonts load (see 0.3); verify on PSI after deploy. |
| CLS zero | ✅ Measured 0 after the fallback-font fix (was 0.19 with the hero headline re-wrapping on font swap). |
| Main thread idle before scene init | ✅ Tier decided on idle after hydration; three.js downloads only then. |
| Device tiers | ✅ `full`, `lite`, `still`, `fallback` (see 0.2). Not yet observed on a real mid-range Android. |
| Reduced motion | ✅ Scene renders one frame; clips show posters; transitions and grain static; cursor off. |
| Contrast | ✅ Lighthouse accessibility 100. Section numbers lifted to pass. Red stays off body text. |
| Focus | ✅ Visible ring kept; cursor companion does not hide the native cursor. |
| Autoplay video | ✅ Muted, `playsInline`, `preload="none"`, poster, on-screen only. |

---

## 7. Design elements and 3D: what was built

### 7.1 Filling the flagship slot

The audit proposed shipping the redesign itself as piece one. That was tried and dropped: a clip of the site inside the site read as the page repeating itself. The lineup instead:

1. **Benda Offroad** (lead): bilingual EN/AR dealer site with a full-bleed desert video hero. Live link.
2. **3dbanao**: live 3D keychain configurator with WhatsApp ordering. Live link.
3. **CreateXworks**: 3D-printing studio site with a print-status loader. Live link.
4. **Quarr One configurator**: self-initiated. Demonstrates the Interactive 3D package. Live at `/lab/configurator`, study at `/work/quarr-configurator`.
5. **Quarr One launch page**: self-initiated. Demonstrates the Immersive Landing Page package. Live at `/lab/launch`, study at `/work/quarr-launch`.

The Quarr pieces are explicitly fictional (banner on every screen, waitlist sends nothing) and their studies publish measured budgets, which is the honest version of a "look what I can do" demo. The client pieces need years and, when there is something to say, a `study` each so they stop linking straight out.

### 7.2 The hero scene — direction A, built

The 48 px grid taken literally: an instanced field of slabs (34 × 22 on `full`, 26 × 18 on `lite`) on a plane, one red point light that follows the pointer or drifts on touch, slabs near the light rising and catching it on their edges, fog losing the field's edges, the camera pulling back and the field tilting as the page scrolls. One material, one draw call, no post-processing. A scrim keeps the copy legible from the bottom on phones and from the left on desktop.

Directions B (extruded type) and C (light and material study) remain future options. B would be the natural next iteration if the field starts to feel familiar.

### 7.3 Section-level design elements — status

- **Numbers and labels.** ✅ Section numbers 01 to 04 in the rail; red scroll-progress line on the header rule.
- **The red rule as a motif.** ✅ Draws under work titles on hover, along architecture connectors, under the nav links. Not yet used as a full-width rule between Immersive sections; the plane steps do that job.
- **Media frames.** ✅ Caption bar with name on a `#161616` plane; no browser chrome.
- **Work card hover.** ✅ Clip scale, title slide, rule draw, cursor reads "View".
- **Marquee.** ✅ One place on the homepage, real words.
- **Image treatment.** ✅ Engineering screenshots on a plane with grain. Angled-in-3D presentation on case study pages not done; not needed.

### 7.4 Component changes — status

| Component | Audit ask | Status |
|---|---|---|
| `Hero` | R3F scene with tiers; keep headline mechanics; move availability to footer | ✅ via `HeroBackdrop`. Headline copy pending. |
| `SelectedWork` / `WorkCard` | Full-bleed lead, caption frame, hover choreography | ✅ `LeadWorkCard` added. |
| `EngineeringRange` / `ProjectCard` | Demote to compact strip; remove browser chrome | ✅ |
| `Services` | "What I build" rows with visuals and prices | ✅ rows and price slots; ⏳ visuals, prices. |
| `Testimonials` | Proof mode, real marquee words, count-ups | ✅ |
| `About`, `Experience`, `Writing` | Move to `/about` | ✅ |
| `ContactCTA` | Drop the form | ✅ |
| `Navbar` | Work, Services, About, Get a quote; no theme toggle; progress line | ✅ plus Blog. |
| `Footer` | Location, availability, socials, secondary links | ✅ Socials render once handles are set. |
| `ogImage` | Hero still with headline | ✅ |
| New | `Scene`, `SceneFallback`, `PageTransition`, `Cursor`, `Grain`, `CountUp`, `PinnedSequence` | ✅ as `HeroScene` + `HeroBackdrop` + `HeroGrid`, `template.tsx`, `Cursor`, `.grain`, `CountUp`, and the launch page's sticky sequence. Plus `CreativeStudyLayout`, `ScrollDepth`, `sceneTier`, the speaker scenes. |

---

## 8. UX principles to hold the site to

1. **One job per section, one CTA per section.** Holding. The homepage has one primary action per section.
2. **Show before tell.** Holding for work. Not yet for What I build rows or package cards, which are still text-first.
3. **Price on the page.** **Not yet.** The single biggest open item.
4. **Mobile is the primary viewport.** Homepage measured at 390 px: 6.8 viewport heights, no horizontal overflow, lead clip in 4:5. LCP still over budget on the mobile preset.
5. **Never ship an empty state to the public.** Holding. Lab and Reviews out of the nav; placeholders filtered from builds; `/lab` only in the sitemap when it has entries.
6. **Three clicks to a quote from anywhere.** Holding: nav button, section CTA, footer link.
7. **Trust signals near the ask.** Holding: Proof sits directly above Contact.
8. **Fallbacks are designs, not apologies.** Holding: the 2D grid, the still frame and the posters are deliberate.
9. **Measure the funnel.** Wired end to end. Needs `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL` set in production for any of it to record.
10. **Consistency over novelty below the fold.** Holding. Novelty is spent in the hero, the lead piece and transitions; the rest is calm.

---

## 9. Plan and status

Status key: ✅ done · ⏳ open.

### Phase 0: content
- ⏳ Set prices in `pricing.ts`. Set Instagram and X in `config.ts`.
- ✅ Clips and posters: five pieces recorded from the live sites (the audit's "site hero, Moementum, KnowledgeOS" list was replaced by the real work lineup).
- ✅ Hide Lab and Reviews from the nav. Remove the theme toggle.
- ✅ Write the three buyer-facing outcome lines.
- ⏳ Decide the hero headline.

### Phase 1: structure ✅
- ✅ Five-section homepage; About, Experience, Writing to `/about`; forms removed from home and services.
- ✅ `/work` index. `/pricing` → `/services` with redirect.
- ✅ Section weights, plane range, grain. Browser-chrome frame replaced.
- ✅ Page transitions.
- ✅ Scroll progress line, section numbers, work card hover.

### Phase 2: the hero and the first piece ✅
- ✅ Hero direction A in R3F with four tiers and the pinned transition.
- ✅ ~~Site itself as piece one~~ replaced by three client sites.
- ✅ OG image from a hero still.

### Phase 3: fill the portfolio ✅
- ✅ Configurator demo and fictional launch page, as work pieces and Lab entries.
- ✅ Creative case study template.

### Phase 4: polish and measurement
- ✅ Cursor, count-ups, diagram draw-on, scroll-depth events, two-step quote form.
- ⏳ Mobile LCP under 2.5 s (2.6–2.7 s locally; CLS 0, performance 71–74). Check PSI after deploy.
- ⏳ Real-device pass on a mid-range Android in the Instagram in-app browser.
- ⏳ A/B hero headline via ad landing variants.
- ⏳ Inline visuals for What I build rows and package cards.
- ⏳ Engineering case study tightening.
- ⏳ Years and studies for the client pieces; Meeting Intelligence cover image.
- ✅ Commit the Phase 2 to 4 work (`7cdc95e`).

**Ads can start once Phase 0's two open items (prices, socials) are in.** LCP is within 0.2 s of budget locally and should be confirmed on PSI after deploy. Everything else in Phase 4 improves efficiency rather than gating launch.

---

## 10. Reference points

For shared vocabulary, not for copying.

- **Scroll-pinned hero into work** and restrained choreography: Awwwards-winning studio sites from 2024 to 2026 by Locomotive, Immersive Garden, and Resn. Note how little moves at once.
- **Instanced-geometry heroes** with a single light source: Bruno Simon's course demos and the R3F `Instances` examples. The hero field is in this family.
- **Type-led brutalism with real depth**: Studio Dumbar's and Pentagram's recent digital work.
- **Pricing on a freelancer site**: senior independents and small studios presenting "from" prices with a scope list. `PackageCard` and the What I build rows are ready for the numbers.
- **Case studies for engineering work aimed at buyers**: Linear's and Vercel's customer stories. Outcome first, architecture second, screenshots on a plane.

---

## Appendix A: homepage length

Approximate viewport heights at 1440 × 900, production content.

| Section | Before (f67651d) | Now |
|---|---|---|
| Hero | 0.8 | 1.0 (100svh) + 0.5 pin |
| Selected work | hidden | ≈ 1.6 |
| Engineering range | 1.3 | row in What I build |
| Hire me for / What I build | 0.7 | ≈ 0.8 |
| Proof + marquee | 1.0 | ≈ 0.7 |
| About + stack | 1.2 | moved to `/about` |
| Experience | 1.6 | moved to `/about` |
| Writing | 0.7 | moved to `/about` |
| Contact (+ form before) | 1.4 | ≈ 0.5 |
| Footer | 0.2 | 0.3 |
| **Total** | **≈ 8.9** | **4.6 measured** (6.8 at 390 × 844) |

## Appendix B: where things live now

Content: `src/data/config.ts`, `nav.ts`, `work.ts` (pieces + creative studies), `lab.ts`, `pricing.ts`, `proof.ts`, `services.ts`, `projects.ts` (engineering studies), `experience.ts`, `techStack.ts`.
Pages: `src/app/page.tsx`, `about/`, `work/` + `work/[slug]/`, `services/`, `quote/`, `lab/` + `lab/configurator/` + `lab/launch/`, `reviews/`, `blog/`, `template.tsx` (transitions), `layout.tsx` (fonts, grain, cursor, analytics).
Sections: `src/components/sections/` (Hero, SelectedWork, EngineeringRange, Services, Testimonials, ContactCTA, About + Stack, Experience, Writing).
Scenes: `src/components/scene/HeroScene.tsx`, `HeroBackdrop.tsx`, `speaker/` (SpeakerModel, Studio, ConfiguratorScene, LaunchScene, colorways). Tiering in `src/lib/sceneTier.ts`, `useSceneTier.ts`. 2D fallback `src/components/HeroGrid.tsx`.
Lab demos: `src/components/lab/Configurator.tsx`, `LaunchPage.tsx`.
Case studies: `src/components/case-study/CaseStudyLayout.tsx` (engineering), `CreativeStudyLayout.tsx`, `ArchitectureDiagram.tsx`.
UI: `Section` (+ `SectionLabel`, `SectionIndex`, tones), `PageHeader`, `Button`, `CountUp`, `Reveal`, `RevealText`, `MediaPreview`, `WorkCard` + `LeadWorkCard`, `ProjectCard`, `ProjectVisual`, `PackageCard`, `ProofCard`, `ScrollMarquee`, `Cursor`, `ScrollDepth`.
Styles: `src/app/globals.css` (planes, grain, view transitions, `fade-up`, `text-mega`, `.defer-render`, the hand-tuned `Fraunces Fallback` face, unused light tokens).
Motion: `src/components/MotionProvider.tsx` (LazyMotion, `domAnimation`, strict).
Meta: `src/lib/ogImage.tsx` + per-route `opengraph-image.tsx`; `public/og/hero.jpg`.
Media: `public/work/<slug>/preview.mp4` + `poster.jpg` (+ `exploded.jpg`, `opener.jpg` for the studies), `public/lab/configurator/poster.jpg`.
Analytics: `src/lib/analytics.ts`, `AnalyticsListener.tsx`, `ScrollDepth.tsx`, `lib/attribution.ts`.
