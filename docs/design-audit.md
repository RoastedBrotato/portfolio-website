# Design audit and redesign brief

**Site:** waleedajaz.com (Next.js 16, Tailwind 4, Framer Motion, Lenis)
**Audited:** 4 October 2026, from the repo at commit `f67651d` plus the uncommitted `HeroSpotlight` experiment
**Purpose:** handoff document for a redesign. The goal of the site is to convert paid social traffic (Instagram, X, LinkedIn ads) into quote requests for creative-dev work: immersive landing pages, brand sites, interactive 3D.
**Status:** Phase 0 (code parts) and Phase 1 shipped on 4 October 2026. **Next up: Phase 2.** Section 0 lists what was done, what is still open, and handoff notes. Sections 1 to 8 are the original audit and describe the site *before* that work.

---

## 0. Implementation status

### 0.1 Done (Phase 0 code items + Phase 1)

| Audit item | What shipped | Where |
|---|---|---|
| F3, 5.1 Five-section homepage | Hero, Work, What I build, Proof, Contact. Sections numbered 01 to 04 in the rail. About, Experience, Writing and the embedded form removed. | `src/app/page.tsx` |
| F1 interim | While `work.ts` has no real entries, the engineering strip takes the `#work` slot labelled "Work", so "See the work" never lands on nothing. Selected work takes over automatically once a non-placeholder entry exists. | `src/app/page.tsx` |
| 5.2 `/about` | Bio (location + resume in the rail), engineering strip, experience timeline (each role collapsed, current one open), stack, latest writing, "Elsewhere" links (Lab, Blog, Reviews), CTA. | `src/app/about/` |
| 5.2 `/work` index | Selected work (when it exists), then the engineering case studies. No type filter yet: there is only one type. | `src/app/work/page.tsx` |
| 5.2 `/services` | `/pricing` moved here, with a 308 redirect in `next.config.ts`. Package cards have anchors (`/services#interactive-3d`). Embedded form replaced by the CTA. `pricing_view` event name kept for continuity. | `src/app/services/` |
| F6, 7.4 Navbar | Work, Services, About, Get a quote. Search kept. Theme toggle removed. Red scroll-progress line on the header rule. | `src/data/nav.ts`, `Navbar.tsx` |
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
| F10 partial | Share cards added for `/about`, `/work` and each case study. Still the static template (see 0.3). | `opengraph-image.tsx` files |
| Sitemap | `/services`, `/work`, `/about` added; `/lab` only listed when it has entries. | `sitemap.ts` |
| Bug (not in audit) | Reduced-motion headings joined inline words with non-breaking spaces, so long headings overflowed sideways on phones. Fixed. | `RevealText.tsx` |

Measured after the change (production build, placeholders hidden): homepage **4.6** viewport heights at 1440 × 900 (was ≈ 8.9) and **6.8** at 390 × 844. No horizontal overflow at 390 px.

### 0.2 Still open

**Content only the owner can supply (Phase 0, blocks ads):**
- Prices in `src/data/pricing.ts`. Every `startingFrom` is still `TODO_PRICE`, which renders "Quote on request". Then re-bracket `budgetRanges` around them.
- `instagram` and `x` in `src/data/config.ts`.
- Three clips + posters (site hero, Moementum, KnowledgeOS), 5 to 8 s, 1280 px, under 1.5 MB.
- Real Selected work entries in `src/data/work.ts` (7.1).

**Deferred from Phase 1:**
- Inline visuals for the What I build rows (need the clips).
- Case-study template tightening (5.2): merge Overview + Problem, fold Challenges + Decisions into one expandable "Notes" section.
- `/work` type filter, once there is more than one type.

### 0.3 Handoff notes for Phase 2

- **Hero fallback.** `HeroGrid.tsx` (the canvas grid) was replaced by the CSS `HeroSpotlight` experiment, which is what ships now. Direction A (7.2) wants the canvas back as the lite tier; restore it with `git show f67651d:src/components/HeroGrid.tsx`. `HeroSpotlight` makes a reasonable poster/no-WebGL tier.
- **Where the scene goes.** `Hero.tsx` stacks the grid and spotlight layers (absolutely positioned) behind the rail grid; the R3F canvas replaces those two layers. Keep `min-h-[70svh]`, or raise it to `100svh` for the pinned transition.
- **Pinned hero → work transition.** Only possible once `work.ts` has a real lead entry; until then the section after the hero is the engineering strip, not an Immersive section. `SelectedWork` renders its own `<section id="work">` with `LeadWorkCard` first, so a pinned wrapper can span Hero + lead card.
- **One scroll system.** Lenis owns scroll (`SmoothScroll.tsx`, exposes `useLenis()`). If GSAP ScrollTrigger comes in, drive it from Lenis per 6.3. The navbar progress line uses Framer `useScroll`, which reads native scroll and already works under Lenis.
- **Page transitions** are View Transitions, not Framer. Anything given a `viewTransitionName` is skipped by hit-testing during a transition, so don't name interactive elements.
- **Planes and grain.** Use `bg-plane-*` for scene backgrounds so the canvas matches the page. The grain sits at `z-index: 60` over everything, canvas included, so the scene doesn't need its own.
- **Events to add.** `hero_scene_loaded`, `hero_scene_fallback` and the scroll-depth events go in the `AnalyticsEvent` union in `src/lib/analytics.ts`.
- **OG image.** `src/lib/ogImage.tsx` takes `tag` + `headline`; add an optional background image for the hero still.

---

## 1. Verdict in one page

The site is a well-engineered engineer's portfolio wearing a "creative developer" label it has not earned yet. The code quality is high, the design system is disciplined, and the lead funnel (pricing, quote form, UTM attribution, Plausible events) is more complete than most agencies have. But a visitor arriving from an ad sees none of that. They see:

- A text headline over a faint grid, with a canvas effect so restrained it is nearly invisible.
- A "Selected work" section that **does not render in production** because all three entries are placeholders. The first thing a creative-dev client wants to see is the one thing that is missing.
- Three dashboard screenshots of admin-style SaaS tools (dark cards, forms, tables). They are good engineering proof, but they are visually the opposite of "immersive" and "3D".
- Then around 2,500 words of services, proof cards, a four-paragraph bio, five jobs of CV bullets, a tech-stack list, three blog posts about travelling, and a six-field form.

The homepage currently has **nine sections** and runs roughly **8 to 9 viewport heights** on desktop, more on mobile. Everything after the first two sections is there to reassure, not to sell, and most of it reassures the wrong buyer (a hiring manager, not a founder buying a landing page).

The brand problem is structural, not cosmetic: the site tells people you build immersive, motion-rich, 3D experiences, and then demonstrates none of them. For a creative developer the website **is** the portfolio piece. Right now the strongest piece of evidence for your pitch is the pricing page's copy, not anything the visitor can see or feel.

The recommendation is not "add Three.js to the hero". It is a three-part fix, in this order:

1. **Make the site itself the flagship case study.** Hero, transitions, scroll choreography, one real-time scene. Treat it as the first entry in "Selected work".
2. **Cut the homepage to five sections and one scroll story.** Move CV, stack, bio and blog off the homepage to pages where they belong.
3. **Reframe the three engineering projects** as "built the whole thing" proof under the creative work, not as the main event, and get three real creative pieces in front of them, even if two are self-initiated Lab pieces.

The rest of this document is specific about how.

---

## 2. What exists today

### 2.1 Information architecture

| Route | What it is | State |
|---|---|---|
| `/` | Hero, Selected work, Engineering range, Services, Proof/Reviews, About, Experience, Writing, Contact + quote form | Live. Selected work hidden in prod (all placeholders). |
| `/work/[slug]` | Case studies for Moementum, KnowledgeOS, AI Meeting Intelligence | Live. One has no cover image, two have no demo or repo link. |
| `/lab` | Experiments feed | Empty in prod. Renders "First experiments are on the way". |
| `/pricing` | 3 packages + custom, process, FAQ, embedded quote form | Live. Every price is `TODO_PRICE`, so renders "Quote on request". |
| `/quote` | The quote form | Live, complete. |
| `/reviews` | Approved testimonials + submit form | Live, zero approved reviews. |
| `/blog`, `/blog/[slug]` | 5 published posts, all tagged "yapping" | Live. |
| `/admin/reviews` | Moderation | Private. |

Navigation: Work, Lab, Pricing, About, Reviews, Blog, plus Search, Theme toggle, Get a quote. Seven destinations plus two utilities is heavy for a conversion site. Two of them (Lab, Reviews) land on empty pages in production.

### 2.2 Visual system (from `globals.css` and the README)

- **Palette:** pure black `#000`, white, red accent `#ff2b1f` (dark) / `#cc0000` (light). Greys at 0d, 1a, 2b, 7a, a3.
- **Type:** Fraunces (display, bold, italic for emphasis), Geist Sans (body), Geist Mono (labels, nav, buttons). Fluid `clamp()` scales for display, h1, h2.
- **Structure:** 2 px white rules between sections, 1 px hairlines inside. No border radius anywhere. Hard 5 px offset shadow (`.brutal`) for depth. 48 px background grid. One 10 rem left "rail" that holds a red section label on every section of every page.
- **Motion:** Lenis smooth scroll. Per-word mask-lift text reveal on headings. Fade-and-rise on scroll for blocks (`Reveal`, 24 px, 0.6 s, `[0.16,1,0.3,1]`). A scroll-linked oversized type marquee behind the testimonials. Pointer-reactive grid cells in the hero (canvas), and an uncommitted CSS spotlight alternative. Reduced-motion is respected everywhere.
- **Components:** Button (primary red / secondary outlined / ghost), SectionLabel (red block), Badge, PackageCard, WorkCard, ProjectCard with a fake browser chrome, ProofCard, ReviewCard, PageHeader, FormField.

This is a coherent neo-brutalist system. It is also, by its own rules, a **static** system: hard edges, no gradients, no depth beyond a flat offset shadow, no imagery language beyond screenshots in a frame. Those rules were right for the "3 projects, black/red brutalist" engineer portfolio they were written for (commit `0d5dce1`). They are now in tension with the pivot to immersive and 3D, which lives on light, depth, material and motion.

### 2.3 What is working and should be kept

- The **data-driven content layer** (`src/data/*`). Everything below is a content and layout change on top of it.
- The **lead funnel**: `/quote` with UTM capture, placement tracking, the honeypot, rate limiting, Plausible events. This is the business end and it is done.
- The **pricing structure**: three packages mapped to the quote form's project types, a custom path, a process section, an FAQ. The copy is good. It needs prices.
- The **reduced-motion and Save-Data handling** in `MediaPreview`, `HeroGrid`, `Reveal`. Carry these habits into anything heavier.
- **Fraunces as display face.** It has real character, and the italic red emphasis word is the one thing in the current system that already feels like a brand gesture.
- **Red as the single accent.** Keep it. Change what sits around it.
- The **rail label idea**. Keep the concept of a single running left index, but it should not be the only heading style on the site (see 5.3).
- The **blog's voice.** It is honest and personal. It just should not sit between a founder and the quote form.

---

## 3. Findings, ranked by impact on conversion

Each finding names where it is in the code so it can be fixed without re-auditing.

### F1. The flagship section is empty in production
`src/data/work.ts` has three `placeholder: true` entries, so `SelectedWork` renders nothing in a build and `EngineeringRange` takes the `#work` anchor. A visitor who clicks the hero's primary button "See the work" lands on three SaaS dashboards under a label that says "Work". For a site selling immersive websites that is a broken promise on the first click.

**Fix:** three real creative pieces before any ad spend, even self-initiated. This site's own redesign should be piece one. See 7.1.

### F2. The hero makes the claim and shows nothing
`Hero.tsx` is a headline, a paragraph, two buttons and an availability line over a grid that lights up red cells near the cursor at 55% alpha. On touch, one ambient cell blinks every 900 ms. A creative-dev hero needs to be the demo. The first three seconds decide whether the ad click was wasted.

**Fix:** a real-time scene or a scroll-driven showreel in the hero. Details in 6.1 and 7.2.

### F3. The homepage is a CV
Order today: Hero, Selected work, Engineering range, Services, Proof, About, Experience, Writing, Contact. Of these, **Experience** (five jobs, fourteen bullet points), **About** (four paragraphs plus a five-row tech stack), and **Writing** (three travel posts) are hiring-manager content. A founder buying a landing page does not need to know you optimised Entity Framework queries in 2021 or that you like metal.

**Fix:** homepage becomes Hero, Work, Capabilities, Proof, CTA. Everything else moves to `/about`. See 5.1.

### F4. The three case studies pull the brand toward "backend engineer"
`ProjectCard` wraps every screenshot in a fake browser window with three square dots, and the screenshots are dark admin dashboards. The copy is excellent engineering writing (RLS, pgvector, diarization), which is exactly what a CTO would want and exactly what a marketing lead would scroll past. The section is titled "Engineering range" and its intro says "the engineering underneath the motion", but there is no motion above it yet.

**Fix:** keep the case studies, reposition them as a "Full-stack and AI under the hood" strip beneath the creative work, with a tighter visual treatment. Rewrite the three outcome lines for a buyer, not a reviewer. See 5.1 and 5.4.

### F5. Nothing on the site uses the medium it sells
Zero WebGL, zero 3D, no scroll-pinned sequences, no page transitions, no video. The two most expressive effects (the reviews marquee and the hero grid) are small and sit in low-traffic spots. The package copy promises "camera choreography", "page transitions", "scroll-driven motion". None of it is on the page.

**Fix:** sections 6 and 7 of this document.

### F6. Two nav links go to empty pages
`/lab` and `/reviews` both render "nothing yet" copy in production. Every empty page an ad visitor hits lowers trust.

**Fix:** remove Lab and Reviews from the primary nav until they have at least three entries each. Fold the review form into `/about` or the footer. Nav becomes Work, Services, Pricing, About, plus Get a quote.

### F7. Pricing with no prices
`formatPrice` renders "Quote on request" for all three packages because every `startingFrom` is `TODO_PRICE`. A pricing page that lists no prices is a brochure. Social traffic in particular will bounce rather than fill a form to find out a number.

**Fix:** publish "from" prices. If you want to keep flexibility, publish a range per package. Also fix the budget bands in the quote form so they bracket those prices.

### F8. Visual monotony across the scroll
Every section is the same shape: a 2 px rule, a red label on the left, text or a grid of same-size rectangles on the right, full black background. There is no change of pace, no full-bleed moment, no colour-field shift, no large imagery. A long page with no rhythm changes reads as a document, which is what "bland" means here.

**Fix:** section 5.3 defines three section "weights" and 6.2 defines where the breathing moments go.

### F9. Light mode works against the brand
The theme toggle flips to white with black rules and dark red. It is correct and accessible, but it doubles every design decision, and the immersive direction (light on dark, material, depth) only really works on dark. A creative-dev portfolio does not need a light mode.

**Fix:** remove the toggle. Keep `[data-theme="light"]` tokens in CSS if you want them for case-study pages later, but take the control out of the nav.

### F10. The share card shows the problem too
`ogImage.tsx` is a black card, the grid, a red tag and a headline. It is consistent with the site, and equally static. Ads and social posts live or die on the preview image.

**Fix:** the OG image should be a still from the hero scene or the lead work piece, with the headline over it.

### F11. Smaller issues

- `About.tsx` repeats the tech stack that `Experience` already implies, and both duplicate the resume PDF.
- `Services.tsx` is a definition list with no visuals. For a services section that is selling visual work, that is a missed opportunity.
- `Testimonials.tsx` "proof" mode shows two cards ("10 active clients", "Open source") and a marquee reading "In production / Shipped". The marquee is the most expressive element on the site and it is spent on filler words.
- `ProjectVisual.tsx` fallback mockups (abstract bars and tags) ship for AI Meeting Intelligence because it has no cover image.
- The quote form appears three times (home, pricing, quote). On the homepage it adds roughly a viewport of inputs below the fold on mobile. One form on `/quote`, one short CTA everywhere else.
- `siteConfig.instagram` and `siteConfig.x` are empty, so the channels the ads will run on are not linked from the site.
- The resume download link in the Experience rail invites recruiters, which is the wrong audience for this site. Move it to `/about`.
- Hero availability line reads "Booking client projects · Islamabad, Pakistan". Location is a useful trust signal but should not be the last thing in the hero. Use it in the footer and the About page.

---

## 4. Brand identity

### 4.1 Positioning

Who it is for: founders, marketing leads and small studios who want a launch page, brand site or product showcase that **looks expensive and ships fast**, and who are nervous that a "creative" developer will deliver something beautiful and broken.

The differentiator is the thing the current site buries: **you have shipped production systems for six years and you are now applying that to creative work.** Most creative developers are designers who learned enough code. You are an engineer who can do the creative work and will also wire the CMS, the analytics, the auth and the backend if the project needs it. That is the brand.

Working positioning line (to refine, not to ship verbatim):

> Immersive websites, engineered properly. Motion, 3D and the full-stack work underneath, from one developer.

### 4.2 Brand attributes

Pick three and design every decision against them.

| Attribute | What it means on the page | What it rules out |
|---|---|---|
| **Precise** | Grid-true layouts, mono labels, exact spacing, type that lines up. Motion with physical easing, never bouncy. | Rounded blobby shapes, pastel gradients, playful cartoon 3D. |
| **Physical** | Light, depth, material. Scenes feel like they have mass and respond to the cursor. Hard red stays, but the black gains depth. | Flat illustration, stock 3D icons, glassmorphism cards. |
| **Direct** | Short copy, prices on the page, one CTA per section, no filler sections. | Testimonial carousels, logo walls of nobody, "passionate about" copy. |

The current brutalist system already delivers **Precise** and **Direct**. It is missing **Physical**, and that is the whole gap.

### 4.3 Visual identity: evolve, do not replace

Keep the skeleton of the current system and add one dimension to it.

**Colour.** Keep black and red. Introduce a **near-black depth range** instead of flat `#000`: `#050505`, `#0a0a0a`, `#111`, `#161616`, used as planes in the 3D scene and as section backgrounds that shift subtly as you scroll. Allow the red to appear as **light** (emissive glow, rim light, a red light source in the scene) and not only as a flat fill. Add one cool neutral for contrast in scenes only (a desaturated `#8a9bb0` steel) so red has something to play against in 3D. Do not add a second brand colour to the UI.

**Type.** Keep Fraunces, Geist, Geist Mono. Push Fraunces larger and use its optical sizing axis and italic more aggressively in heroes and section openers. Allow display type at `clamp(4rem, 10vw, 11rem)` for section titles that are meant to be read as images. Keep Geist Mono for labels, numbers, prices.

**Shape.** Keep square corners for UI. In scenes, geometry can be anything, but prefer hard-edged solids (slabs, extruded type, planes, wire frames) over spheres and blobs, so the 3D reads as the same brand as the UI.

**Texture.** Add film grain (a subtle animated noise overlay at 3 to 4% opacity) over dark sections and scenes. It is the cheapest way to make flat black feel like a material, and it hides banding in gradients. The 48 px grid stays as a secondary texture, not as the only one.

**Depth.** Keep `.brutal` offset shadows for UI cards. Add real depth where it matters: parallax layers in the hero, the 3D scene, images that sit in space rather than in a frame.

**Imagery.** Stop framing everything in a fake browser window. Work pieces should be shown as **motion** (looping clips, 5 to 8 s, muted) at large sizes, full-bleed where possible. Engineering case studies can keep a device or browser frame, but a simpler one (a single 2 px rule and a title bar, no traffic-light dots).

**Voice.** The current copy is already the right voice: first person, short, slightly dry. Keep it. Remove hedges like "I try new tech in the open" from the hero.

### 4.4 Logo and marks

There is no mark, only the name in mono caps plus a red square. That is fine as a wordmark, and the red square can become the brand's atomic unit: it appears as the cursor marker, as the loading indicator, as the 3D hero's primitive, as the bullet. Design one square-based mark (for favicon, OG, loader) and use it everywhere the red square currently appears.

---

## 5. Page structure

### 5.1 Homepage: five sections, one scroll story

Target length: **about 5 viewport heights on desktop, 7 on mobile.** Nothing on the homepage that is not either showing work or asking for the quote.

| # | Section | Job | Content | Weight (see 5.3) |
|---|---|---|---|---|
| 1 | **Hero** | Prove the claim in three seconds. | Real-time scene or showreel, headline, one line of support copy, two CTAs: "See the work" and "Get a quote". | Immersive |
| 2 | **Selected work** | Show three creative pieces. | Lead piece full-bleed with a looping clip; two more in a two-up grid. Each: clip, title, one line, tags, link. | Immersive |
| 3 | **What I build** | Translate work into something buyable. | The three packages as three large rows, each with a short visual (a clip crop or a small live canvas), name, one outcome line, "from" price, link to pricing. Fourth row, small: "Full-stack and AI under the hood" linking to the engineering case studies. | Editorial |
| 4 | **Proof** | Lower risk. | One strip: Moementum live with 10 clients, KnowledgeOS open source, years shipping, the current client count. Up to two testimonials when they exist. The oversized marquee can live here with real words ("Shipped", "Live", client names). | Utility |
| 5 | **CTA** | Convert. | Headline ("Tell me what you're building."), one paragraph, "Get a quote" primary, "Book a call" secondary, email. No embedded form. | Editorial |

Removed from the homepage: Engineering range as a full section (becomes a row in What I build and a strip on `/about`), About, Experience, Writing, the embedded quote form.

### 5.2 Other pages

**`/work`** (new index page): all creative pieces plus the engineering case studies, filterable by type. This gives "Work" in the nav a real destination instead of a hash link.

**`/work/[slug]`**: two templates.
- *Creative piece*: full-bleed hero clip or live embed, one paragraph brief, large stills and clips in a vertical sequence with sticky captions, a short "how it was built" block (stack, performance budget, one or two technical notes), result, next piece. Image-led, light on text.
- *Engineering case study*: the current template is good. Tighten by merging Overview and Problem, and collapse Challenges and Decisions into one "Notes" section with expandable items. Replace the traffic-light browser frame.

**`/services`** (rename of `/pricing`, keep `/pricing` as a redirect): packages with real prices, process, FAQ, CTA. Remove the embedded form; the CTA goes to `/quote`. Add one visual per package.

**`/about`**: the bio, a photo or a short self-portrait clip, the engineering strip (three case studies as compact cards), the experience timeline (collapsed by default), the tech stack, resume link, location, the review form at the bottom. This is where recruiters and the curious go. It can be long.

**`/lab`**: unchanged structure, but hidden from the nav until it has three or more entries. Link it from the footer and from `/about`.

**`/blog`**: unchanged. Linked from footer and `/about`. Not in the primary nav.

**`/quote`**: unchanged. It is good. Consider a two-step form (project type and budget first, details second) to lift completion from ad traffic, with the first step's choices stored so a bounce still records intent.

### 5.3 Three section weights

Every section on the site should be one of these three, and the homepage should alternate them. This is the fix for F8.

| Weight | Layout | Background | Type | Motion |
|---|---|---|---|---|
| **Immersive** | Full-bleed, edge to edge, no rail. Content floats over media. | Scene, clip or large image. Grain overlay. | Display type at 8 to 11 rem, often in the media. | Scroll-linked: pinning, parallax, scrubbed sequences. |
| **Editorial** | The current rail grid. Label on the left, content right. | Near-black plane, may shift one step lighter or darker than its neighbours. | h2 at `--text-h2`, body at 1.125 rem. | Entrance reveals only. Hover states on rows. |
| **Utility** | Full-width band, compact, no rail label or a tiny one. | Thin 2 px rules top and bottom. | Mono labels and numbers. | Minimal. Marquee allowed. |

Rule: never two Immersive sections back to back on the homepage except Hero into Selected work, where the transition itself is the design moment (see 6.2).

### 5.4 Copy direction for key surfaces

- **Hero headline.** Current: "Websites people remember, engineered to last." Decent, but passive. Options in the same voice: "Websites that move. Engineering that holds." / "Immersive sites, built like software." Keep one italic red word.
- **Hero support line.** One sentence, max 20 words. Drop the Lab reference.
- **Engineering outcome lines.** Rewrite for a buyer. Moementum: "A coaching platform with 10 paying clients logging in daily." KnowledgeOS: "An AI assistant over your own documents, every answer cited." Meeting Intelligence: "Live translated meetings, searchable afterwards."
- **Proof numbers.** Use numbers you can defend: years shipping, live products, clients active now. No invented logos.

---

## 6. Motion and interaction design

### 6.1 Principles

1. **Motion is content, not decoration.** On this site, motion is what the client is buying. Every effect should be something you would be happy to sell. Delete anything that only exists to look busy.
2. **Scroll is the timeline.** Prefer scroll-linked (scrubbed) motion over time-based autoplay. The visitor controls the pace, nothing moves while they read, and it demos "scroll-driven motion" from the package copy.
3. **Physical easing.** One ease for entrances (`[0.16, 1, 0.3, 1]`, already in use), one for exits (`[0.7, 0, 0.84, 0]`), springs for pointer-following only. No bounce, no elastic.
4. **Durations are short.** 0.4 to 0.8 s for UI reveals, 0.6 to 1.0 s for page transitions. Pinned sequences are the only thing allowed to take seconds, and the visitor scrubs those.
5. **One hero moment per page.** Each page gets one Immersive section that carries the budget. The rest is Editorial and Utility.
6. **Budget first.** 60 fps on a 2022 mid-range Android in the Instagram in-app browser is the target, because that is where the ad clicks come from. Set budgets before building: hero scene under 1.5 MB total transfer, under 100k triangles, one draw call per material, no post-processing on mobile, first paint before the scene loads.
7. **Always a fallback.** Reduced motion, Save-Data, no WebGL and low-end devices each get a poster frame or a CSS-only version. The current codebase already does this well; keep the discipline.
8. **Measure.** Track `hero_scene_loaded`, `hero_scene_fallback`, and scroll depth to the CTA in Plausible so you know what the ad audience actually sees.

### 6.2 Where motion goes, section by section

**Global**
- *Page transitions.* A short (0.6 s) wipe or curtain between routes using the View Transitions API with a Framer Motion fallback. The red square or a red plane wiping across is on-brand. This single feature does more to make the site feel "built" than anything else on this list, because it demonstrates "page transitions" from the Brand Website package.
- *Preloader.* Only on first load of the homepage, only while the hero scene loads, max 1.5 s, showing the red square mark. Skip it entirely if the scene is cached or the device gets the fallback.
- *Cursor.* A small custom cursor (the red square, 8 px) that scales on interactive elements, desktop only. Cheap, reinforces the mark. Hide on touch.
- *Grain.* Full-page animated noise at 3 to 4% opacity, CSS or a tiny canvas, disabled on reduced motion.
- *Smooth scroll.* Keep Lenis. Sync GSAP ScrollTrigger to it if GSAP is adopted (6.3).

**Hero (Immersive)**
- The real-time scene (7.2) fills the viewport behind the type.
- Headline reveal as today (per-word mask lift), but the scene should already be visible before the words land.
- Scroll from hero into Selected work is **pinned**: as the visitor scrolls, the scene recedes or breaks apart and the first work clip slides up to replace it. Roughly 1.5 viewport heights of scroll for the transition. This is the one place two Immersive sections touch.

**Selected work (Immersive)**
- Lead piece: full-bleed clip with a slight parallax (clip moves at 0.85× scroll speed). Title in display type overlapping the clip's bottom edge.
- Secondary pieces: two-up grid. Clips play only on screen (current `MediaPreview` behaviour). On hover: clip scales 1.03 and a red rule draws under the title.
- Optional: a horizontal scroll strip on desktop if there are five or more pieces. Not before.

**What I build (Editorial)**
- Three large rows. On hover or when a row is centred in the viewport on mobile, a small inline visual plays (a 3 s clip crop or a tiny live canvas, 320 px wide).
- Price and timeline in mono, revealed with a counter tick (numbers count up over 0.4 s once on view). Small, satisfying, cheap.

**Proof (Utility)**
- The oversized scroll-linked marquee stays, with real words.
- Numbers count up once on view.

**CTA (Editorial)**
- Display headline reveal. The red emphasis word.
- The button's `.brutal` press stays.

**Creative case study pages (Immersive at top, Editorial below)**
- Hero clip full-bleed, then a scrubbed image sequence or a pinned side-by-side of stills with sticky captions.
- "How it was built" can include a small live embed of the piece (an iframe or a canvas) with a performance readout.

**Engineering case study pages (Editorial)**
- Current motion is right. Add one thing: the architecture diagram draws itself on view (SVG stroke animation, 1 s).

**Services page**
- Package cards: on hover, the card lifts (the `.brutal` press inverted) and its visual plays.
- FAQ: the existing `<details>` with a height animation.

**Quote page**
- Step transitions if the form becomes two-step (slide, 0.4 s). Success state: the red square mark animates in.

### 6.3 Library recommendations

The repo has Framer Motion 13 and Lenis. Recommendation for the redesign:

| Need | Use | Why |
|---|---|---|
| Smooth scroll | **Lenis** (keep) | Already integrated with the scroll-lock fixes. |
| Scroll-linked and pinned sequences | **GSAP + ScrollTrigger** | Pinning, scrubbing and timeline sequencing are far better in GSAP than in Framer's `useScroll`. GSAP has been free for all uses since 2025. Sync its ticker to Lenis. |
| UI entrances, layout animations, presence | **Framer Motion** (keep, as `motion`) | Already in use for reveals, nav, palette. Keep it for component-level motion. |
| Page transitions | **View Transitions API** with `motion` fallback | Native, cheap, works with the App Router. |
| Real-time 3D | **Three.js via React Three Fiber + Drei** | R3F fits the React codebase. Drei gives you `ScrollControls`, `Environment`, `MeshTransmissionMaterial`, instancing helpers. |
| Scroll scrubbing in 3D | Drive the R3F scene from GSAP ScrollTrigger progress or Lenis scroll value, not from `ScrollControls`, so one scroll system owns the page. |
| Shaders | **GLSL via R3F `shaderMaterial`** | For the hero's material, grain, and any displacement effects. |
| Text splitting | `motion`'s per-word approach (keep) or GSAP SplitText (now free). | Already solved; SplitText only if you need per-character. |
| Image sequences | **Canvas with preloaded WebP frames**, scrubbed by ScrollTrigger | Only if a case study needs it. Keep under 60 frames at 1280 px. |

Do not add: Locomotive Scroll (conflicts with Lenis), AOS, Swiper, Lottie for anything structural, Spline embeds (heavy, off-brand, and a client would wonder why you did not build it).

### 6.4 Performance and accessibility budget

- **LCP under 2.5 s on 4G** with the hero poster as LCP element, not the canvas. Scene mounts after first paint.
- **CLS zero.** Reserve every media box with an aspect ratio (already done in `MediaPreview`).
- **Main-thread idle before scene init.** Use `requestIdleCallback` or a 300 ms delay after hydration before mounting R3F.
- **Device tiers.** Detect via `navigator.hardwareConcurrency`, `deviceMemory`, and a quick WebGL capability probe. Three tiers: full (desktop), lite (no post-processing, half resolution, fewer instances), poster (static image). The Instagram in-app browser on Android should mostly land in lite.
- **Reduced motion** keeps everything it keeps today, and the hero scene renders a single still frame instead of animating.
- **Contrast.** Red `#ff2b1f` on black is about 5.6:1, fine for large type and labels, borderline for small body text. Keep body text in white and greys. Never set body copy over a moving scene without a solid or heavily darkened plane behind it.
- **Focus.** Keep the visible focus ring. Custom cursor must not remove the native one for keyboard users.
- **Autoplay video** always muted, `playsInline`, with `preload="none"` and poster. Already done.

---

## 7. Design elements and 3D: specific proposals

### 7.1 The site is the first case study

Before building anything else, decide that this redesign ships as a Selected work entry titled something like "waleedajaz.com, 2026": a clip of the hero, two stills, a short note on the stack and the performance budget, and a link to the repo if you are comfortable with that. It fills the empty flagship slot immediately and makes the pitch self-evidencing.

Two more self-initiated pieces to fill the other slots while client work accrues, each scoped to a week or less:

- **A product configurator demo.** One hard-surface object (a speaker, a bottle, a watch, something with material variety), three colourways, orbit and a scripted camera move, a spec panel. Demonstrates the Interactive 3D package directly. Can live at `/lab/configurator` and be embedded.
- **A fictional launch page.** One long-form page for an imagined product with scroll-driven motion, a pinned sequence, and a waitlist form. Demonstrates the Immersive Landing Page package. Make the product plausible and clearly fictional.

Both are honest, both show the exact deliverable a client is buying, and both take less time than waiting for a client to let you publish.

### 7.2 The hero scene

Three directions that fit the brand attributes. Pick one.

**A. The grid, made physical (recommended first build).** Take the existing 48 px grid literally: a field of instanced black slabs on a plane, lit by a single red light that follows the cursor. Slabs near the light rise a few centimetres and catch a red rim. On scroll, the field tilts and the camera pulls back, revealing it as a surface the headline was sitting on. Instanced mesh, one material, one light, no post-processing. Under 500 KB, works at 60 fps on lite tier. Fallback: the current `HeroGrid` canvas, which becomes the lite-tier version. This is the direct evolution of what already exists and the uncommitted `HeroSpotlight` is a CSS sketch of the same idea.

**B. Extruded type.** The headline's emphasis word as a 3D extrusion in Fraunces Italic, red, rotating slowly, with the rest of the headline flat in HTML. Cursor tilts it. On scroll it falls through the floor. Needs a font-to-geometry step (Troika or a pre-baked glyph mesh) and careful kerning. Strong brand gesture, more fragile on low-end devices.

**C. Light and material study.** A single dark slab with a transmissive edge, a red light sweeping across it, grain and chromatic aberration. Very "premium agency". Risk: it looks like everyone else's 2024 portfolio and says nothing specific about you.

Direction A is specific to this brand, cheap, and extends what is already built. Build it first. If it lands, direction B can be a later iteration.

### 7.3 Section-level design elements

- **Numbers and labels.** Keep the mono label vocabulary and extend it: section numbers (`01` to `05`) in the rail on Editorial sections, a running scroll progress indicator in the nav as a thin red line.
- **The red rule as a motif.** A 2 px red line that draws itself under headings, across the viewport between Immersive sections, and along the architecture diagram. One motif, many sizes.
- **Media frames.** Replace the browser-chrome frame with a 2 px rule and a mono caption bar reading the piece's name and year. Clips sit edge to edge inside it.
- **Work card hover.** Clip plays, title slides 8 px right, the red rule draws under it, cursor grows and reads "View".
- **Marquee.** Keep the solid and outlined alternation. Use it in exactly one place per page.
- **Image treatment.** Screenshots of dark dashboards against a black site disappear. Put engineering screenshots on a `#161616` plane with the grain overlay, or show them at an angle in 3D space on the case study page (a single plane with perspective, no fake laptop).

### 7.4 Component changes

| Component | Change |
|---|---|
| `Hero` | Replace `HeroGrid` canvas with the R3F scene plus tiered fallbacks. Keep headline mechanics. Remove the availability line (move to footer). |
| `SelectedWork` / `WorkCard` | Full-bleed lead slot. Caption bar frame. Hover choreography. |
| `EngineeringRange` / `ProjectCard` | Demote to a compact three-up strip with a one-line outcome and a link. Remove browser-chrome `ProjectVisual`. |
| `Services` | Becomes "What I build" rows with visuals and prices. |
| `Testimonials` | Becomes Proof. Real words in the marquee. Count-up numbers. |
| `About`, `Experience`, `Writing` | Move to `/about`. |
| `ContactCTA` | Drop the embedded `QuoteForm`. Two buttons and an email. |
| `Navbar` | Work, Services, Pricing, About, Get a quote. Remove theme toggle. Keep search. Add scroll progress line. |
| `Footer` | Add location, availability, Instagram and X once set, Lab and Blog links, the review form link. |
| `ogImage` | Render from a hero still with the headline overlaid. |
| New: `Scene`, `SceneFallback`, `PageTransition`, `Cursor`, `Grain`, `CountUp`, `PinnedSequence`. |

---

## 8. UX principles to hold the redesign to

1. **One job per section, one CTA per section.** If a section does two things, split it or cut one.
2. **Show before tell.** Media above copy in every work and service block. The visitor should understand what you make before reading a word.
3. **Price on the page.** Visitors from ads will not fill a form to learn a price. A "from" number qualifies leads and saves everyone time.
4. **Mobile is the primary viewport.** Most ad clicks are phones in in-app browsers. Design the homepage at 390 px first, then expand. Every Immersive section needs a mobile composition, not a scaled desktop one.
5. **Never ship an empty state to the public.** If a section or page has no content, it does not render and is not linked. The codebase already does this for Work and Lab; extend it to the nav.
6. **Three clicks to a quote from anywhere.** Nav button, section CTA, footer. Already true; keep it true.
7. **Trust signals near the ask.** Proof sits directly above the CTA, and the quote page repeats one line of proof under the form heading.
8. **Fallbacks are designs, not apologies.** The poster-tier hero and the reduced-motion site should look intentional. Design them.
9. **Measure the funnel.** Hero loaded, scrolled to work, scrolled to CTA, quote start, quote submit. The events are mostly wired; add the scroll-depth ones.
10. **Consistency over novelty below the fold.** Spend the novelty budget on the hero, the work section and transitions. Everything else should be calm.

---

## 9. Prioritised plan

Ordered so each step is shippable on its own and the site is never worse than before.

Status key: ✅ done · ⏳ open. Details in section 0.

### Phase 0: content, one week, no design work
- ⏳ Set prices in `pricing.ts`. Set Instagram and X in `config.ts`.
- ⏳ Cut three clips (5 to 8 s, 1280 px, under 1.5 MB) and posters: the current site hero, Moementum, KnowledgeOS.
- ✅ Hide Lab and Reviews from the nav. Remove the theme toggle.
- ✅ Write the three buyer-facing outcome lines.

### Phase 1: structure, one to two weeks ✅
- ✅ Reorder the homepage to the five sections. Move About, Experience, Writing to `/about`. Remove the embedded quote form from home and pricing.
- ✅ Build `/work` index. Rename pricing to services with a redirect.
- ✅ Introduce the three section weights and the grain overlay. Replace the browser-chrome frame.
- ✅ Add page transitions.
- ✅ Pulled forward from 7.3: scroll progress line in the nav, section numbers in the rail, work card hover.

### Phase 2: the hero and the first piece, two to three weeks ⏳ next
Read section 0.3 first.
- Build hero direction A in R3F with the three device tiers and the pinned transition into Selected work.
- Publish the site itself as Selected work piece one, with the clip from Phase 0 updated.
- New OG image from a hero still.

### Phase 3: fill the portfolio, two to four weeks
- Configurator demo. Fictional launch page. Publish both as work pieces and Lab entries.
- Creative case study template.

### Phase 4: polish and measurement, ongoing
- Custom cursor, count-ups, architecture diagram draw-on.
- Scroll-depth events. Two-step quote form. A/B the hero headline via ad landing variants.
- Lighthouse and real-device pass on a mid-range Android in the Instagram browser.

Ads should not start before Phase 2 ships. Phase 3 is what makes them efficient.

---

## 10. Reference points

For the team's shared vocabulary, not for copying. Look at these for the specific thing named.

- **Scroll-pinned hero into work** and restrained GSAP choreography: Awwwards-winning studio sites from 2024 to 2026 by Locomotive, Immersive Garden, and Resn. Note how little actually moves at once.
- **Instanced-geometry heroes** with a single light source: Bruno Simon's course demos and the R3F `Instances` examples. The restraint is the point.
- **Type-led brutalism with real depth**: Studio Dumbar's and Pentagram's recent digital work shows hard edges coexisting with motion and material.
- **Pricing on a freelancer site**: look at how senior independent developers and small studios present "from" prices with a scope list. The current `PackageCard` is already close.
- **Case studies for engineering work aimed at buyers**: Linear's and Vercel's customer stories. Outcome first, architecture second, screenshots on a plane rather than in a laptop.

---

## Appendix A: homepage length estimate, build before the redesign

Measured as approximate viewport heights at 1440 × 900, production content (placeholders excluded):

| Section | Height |
|---|---|
| Hero | 0.8 |
| Engineering range (as "Work") | 1.3 |
| Hire me for | 0.7 |
| Proof + marquee | 1.0 |
| About + stack | 1.2 |
| Experience | 1.6 |
| Writing | 0.7 |
| Contact + form | 1.4 |
| Footer | 0.2 |
| **Total** | **≈ 8.9** |

Target after redesign: about 5. **Measured after Phase 1: 4.6 at 1440 × 900, 6.8 at 390 × 844.**

## Appendix B: files touched by the audit's recommendations

Phase 1 touched most of these; `src/app/pricing/` is now `src/app/services/`. Section 0.1 lists where each change landed.

Content: `src/data/config.ts`, `nav.ts`, `work.ts`, `lab.ts`, `pricing.ts`, `proof.ts`, `services.ts`, `projects.ts`.
Pages: `src/app/page.tsx`, new `src/app/about/page.tsx`, new `src/app/work/page.tsx`, `src/app/pricing/page.tsx` (rename), `src/app/work/[slug]/page.tsx`.
Sections: everything in `src/components/sections/`.
Components: `Navbar`, `Footer`, `WorkCard`, `MediaPreview`, `ProjectCard`, `ProjectVisual`, `PackageCard`, `ScrollMarquee`, `Hero`, `HeroGrid`, `HeroSpotlight` (uncommitted), `CaseStudyLayout`.
Styles: `src/app/globals.css` (depth range tokens, grain, section weight utilities, remove or isolate light theme).
Meta: `src/lib/ogImage.tsx`, `src/app/opengraph-image.tsx` and per-route variants.
New: `src/components/scene/*` (R3F), `PageTransition`, `Cursor`, `Grain`, `CountUp`, `PinnedSequence`.
