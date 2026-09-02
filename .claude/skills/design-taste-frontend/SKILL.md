---
name: design-taste-frontend
description: Anti-slop frontend skill for landing pages, portfolios, and redesigns. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. Real design systems when applicable, audit-first on redesigns, strict pre-flight check.
---

# tasteskill: Anti-Slop Frontend Skill

> Landing pages, portfolios, and redesigns. Not dashboards, not data tables, not multi-step product UI.
> Every rule below is **contextual**. None of it fires automatically. First read the brief, then pull only what fits.

---

## 0. BRIEF INFERENCE (Read the Room Before Anything Else)

Before touching code or tweaking dials, **infer what the user actually wants**. Most LLM design output is bad because the model jumps to a default aesthetic instead of reading the room.

### 0.A Read these signals first

1. **Page kind** - landing (SaaS / consumer / agency / event), portfolio (dev / designer / creative studio), redesign (preserve vs overhaul), editorial / blog.
2. **Vibe words** the user used - "minimalist", "calm", "Linear-style", "Awwwards", "brutalist", "premium consumer", "Apple-y", "playful", "serious B2B", "editorial", "agency-y", "glassy", "dark tech".
3. **Reference signals** - URLs they linked, screenshots they pasted, products they named, brands they're competing with.
4. **Audience** - B2B procurement panel vs. design-conscious consumer vs. recruiter scanning a portfolio. The audience picks the aesthetic, not your taste.
5. **Brand assets that already exist** - logo, color, type, photography. For redesigns, these are starting material, not optional input (see Section 11).
6. **Quiet constraints** - accessibility-first audiences, public-sector, regulated industries, trust-first commerce, kids' products. These constraints OVERRIDE aesthetic preference.

### 0.B Output a one-line "Design Read" before generating

Before any code, state in one line: **"Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <design system or aesthetic family>."**

Example reads:

- *"Reading this as: B2B SaaS landing for technical buyers, with a Linear-style minimalist language, leaning toward Tailwind utilities + Geist + restrained motion."*
- *"Reading this as: solo designer portfolio for hiring managers, with an editorial / kinetic-type language, leaning toward native CSS + scroll-driven animation + custom typography."*
- *"Reading this as: redesign of a public-sector service site, with a trust-first language, leaning toward GOV.UK Frontend or USWDS."*

### 0.C If the brief is ambiguous, ask one question, do not guess

Ask exactly **one** clarifying question - never a multi-question dump - and only when the design read genuinely diverges. Example: *"Should this feel closer to Linear-clean or Awwwards-experimental?"*

If you can confidently infer from context, **do not ask**. Just declare the design read and proceed.

### 0.D Anti-Default Discipline

Do not default to: AI-purple gradients, centered hero over dark mesh, three equal feature cards, generic glassmorphism on everything, infinite-loop micro-animations everywhere, Inter + slate-900. These are the LLM defaults. Reach past them deliberately based on the design read.

---

## 1. THE THREE DIALS (Core Configuration)

After the design read, set three dials. Every layout, motion, and density decision below is gated by these.

- **`DESIGN_VARIANCE: 8`** - 1 = Perfect Symmetry, 10 = Artsy Chaos
- **`MOTION_INTENSITY: 6`** - 1 = Static, 10 = Cinematic / Physics
- **`VISUAL_DENSITY: 4`** - 1 = Art Gallery / Airy, 10 = Cockpit / Packed Data

**Baseline:** `8 / 6 / 4`. Use these unless the design read overrides them. Do not ask the user to edit this file - overrides happen conversationally.

### 1.A Dial Inference (design read → dial values)

| Signal | VARIANCE | MOTION | DENSITY |
| --- | --- | --- | --- |
| "minimalist / clean / calm / editorial / Linear-style" | 5-6 | 3-4 | 2-3 |
| "premium consumer / Apple-y / luxury / brand" | 7-8 | 5-7 | 3-4 |
| "playful / wild / Dribbble / Awwwards / experimental / agency" | 9-10 | 8-10 | 3-4 |
| "landing page / portfolio / marketing site (default)" | 7-9 | 6-8 | 3-5 |
| "trust-first / public-sector / regulated / accessibility-critical" | 3-4 | 2-3 | 4-5 |
| "redesign - preserve" | match existing | +1 | match existing |
| "redesign - overhaul" | +2 | +2 | match existing |

### 1.B Use-Case Presets

| Use case | VARIANCE | MOTION | DENSITY |
| --- | --- | --- | --- |
| Landing (SaaS, mainstream) | 7 | 6 | 4 |
| Landing (Agency / creative) | 9 | 8 | 3 |
| Landing (Premium consumer) | 7 | 6 | 3 |
| Portfolio (Designer / studio) | 8 | 7 | 3 |
| Portfolio (Developer) | 6 | 5 | 4 |
| Editorial / Blog | 6 | 4 | 3 |
| Public-sector service | 3 | 2 | 5 |
| Redesign - preserve | match | match+1 | match |
| Redesign - overhaul | +2 | +2 | match |

### 1.C How the Dials Drive Output

Use these (or user-overridden values) as global variables. Cross-references throughout this document refer to these exact variable names - never invent aliases like `LAYOUT_VARIANCE` or `ANIM_LEVEL`.

---

## 2. BRIEF → DESIGN SYSTEM MAP

Once you have the design read (Section 0) and dials (Section 1), pick the right foundation. Do not invent CSS for things that have an official package. Do not pretend an aesthetic trend is an official system.

### 2.A When to reach for a real design system (use official packages)

| Brief reads as… | Reach for | Why |
| --- | --- | --- |
| Microsoft / enterprise SaaS / dashboards | `@fluentui/react-components` or `@fluentui/web-components` | Official Fluent UI, Microsoft tokens, accessibility done |
| Google-ish UI, Material-flavored product | `@material/web` + Material 3 tokens | Official, theme-able via Material Theming |
| IBM-style B2B / enterprise analytics | `@carbon/react` + `@carbon/styles` | Official Carbon, mature data-density patterns |
| Shopify app surfaces | `polaris.js` web components / Polaris React | Required for Shopify admin UI |
| Atlassian / Jira-style product | `@atlaskit/*` + `@atlaskit/tokens` | Official Atlassian DS |
| GitHub-style devtool / community page | `@primer/css` or `@primer/react-brand` | Official Primer; Brand variant for marketing |
| Public-sector UK service | `govuk-frontend` | Legally / regulatorily expected |
| US public-sector / trust-first | `uswds` | Same |
| Fast local-business / agency MVP | Bootstrap 5.3 | Boring, fast, works |
| Modern accessible React foundation | `@radix-ui/themes` | Primitives + polished theme |
| Modern SaaS where you own the components | shadcn/ui (`npx shadcn@latest add ...`) | You own the code, easy to customise; never ship default state |
| Tailwind-based modern SaaS / AI marketing | Tailwind v4 utilities + `dark:` variant | Default for indie + small team builds |

**Honesty rule:** if the brief reads as one of the systems above, install and use the **official** package. Do not recreate its CSS by hand. Do not import a system's tokens but then override 90% of them.

**One system per project.** Do not mix Fluent React with Carbon in the same tree. Do not import shadcn/ui components into a Material 3 app.

### 2.B When the brief is an aesthetic, not a system

For these directions, there is **no single official package**. Build with native CSS + Tailwind + a maintained component library. Be honest in code comments about what is borrowed inspiration vs. official material.

| Aesthetic | Honest implementation |
| --- | --- |
| Glassmorphism / "frosted glass" | `backdrop-filter`, layered borders, highlight overlays. Provide solid-fill fallback for `prefers-reduced-transparency`. |
| Bento (Apple-style tile grids) | CSS Grid with mixed cell sizes. No single library owns this. |
| Brutalism | Native CSS, monospace, raw borders. No library. |
| Editorial / magazine | Serif type, asymmetric grid, generous whitespace. No library. |
| Dark tech / hacker | Mono + accent neon, terminal motifs. No library. |
| Aurora / mesh gradients | SVG or layered radial gradients. No library. |
| Kinetic typography | Native CSS animations, scroll-driven animations, GSAP for hijacks. No library. |
| **Apple Liquid Glass** | Apple documents this for Apple platforms only. **There is no official `liquid-glass.css`.** Web implementations are approximations using `backdrop-filter` + layered borders + highlights. Label clearly as approximation. |

---

## 3. DEFAULT ARCHITECTURE & CONVENTIONS

Unless the design read picks a real design system (Section 2.A), these are the defaults:

### 3.A Stack

- **Framework:** React or Next.js. Default to Server Components (RSC).
  - **RSC SAFETY:** Global state works ONLY in Client Components. In Next.js, wrap providers in a `"use client"` component.
  - **INTERACTIVITY ISOLATION:** Any component using Motion, scroll listeners, or pointer physics MUST be an isolated leaf with `'use client'` at the top. Server Components render static layouts only.
- **Styling:** **Tailwind v4** (default). Tailwind v3 only if the existing project demands it.
  - For v4: do NOT use `tailwindcss` plugin in `postcss.config.js`. Use `@tailwindcss/postcss` or the Vite plugin.
- **Animation:** **Motion** (the library formerly known as Framer Motion). Import from `motion/react` (`import { motion } from "motion/react"`). The `framer-motion` package still works as a legacy alias - prefer `motion/react` in new code.
- **Fonts:** Always use `next/font` (Next.js) or self-host with `@font-face` + `font-display: swap`. Never link Google Fonts via `<link>` in production.

### 3.B State

- Local `useState` / `useReducer` for isolated UI.
- Global state ONLY for deep prop-drilling avoidance - Zustand, Jotai, or React context.
- **NEVER** use `useState` to track continuous values driven by user input (mouse position, scroll progress, pointer physics, magnetic hover). Use Motion's `useMotionValue` / `useTransform` / `useScroll`. `useState` re-renders the React tree on every change and collapses on mobile.

### 3.C Icons

- **Allowed libraries (priority order):** `@phosphor-icons/react`, `hugeicons-react`, `@radix-ui/react-icons`, `@tabler/icons-react`.
- **Discouraged:** `lucide-react`. Acceptable only when the user explicitly asks for it or the project already depends on it.
- **NEVER hand-roll SVG icons.** If a glyph is missing, install a second library or compose from primitives - do not draw icon paths from scratch.
- **One family per project.** Do not mix Phosphor with Lucide in the same component tree.
- **Standardize `strokeWidth` globally** (e.g. `1.5` or `2.0`).

### 3.D Emoji Policy

Discouraged by default in code, markup, and visible text. Replace symbols with icon-library glyphs. **Override:** allow emojis only when the user explicitly asks for a playful / chat-style / social-native vibe - and even then use them sparingly with intent.

### 3.E Responsiveness & Layout Mechanics

- Standardize breakpoints (`sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`).
- Contain page layouts using `max-w-[1400px] mx-auto` or `max-w-7xl`.
- **Viewport Stability:** NEVER use `h-screen` for full-height Hero sections. ALWAYS use `min-h-[100dvh]` to prevent layout jumping on mobile (iOS Safari address bar).
- **Grid over Flex-Math:** NEVER use complex flexbox percentage math (`w-[calc(33%-1rem)]`). ALWAYS use CSS Grid (`grid grid-cols-1 md:grid-cols-3 gap-6`).

### 3.F Dependency Verification (mandatory)

Before importing ANY 3rd-party library, check `package.json`. If the package is missing, output the install command first. **Never** assume a library exists.

---

## 4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)

LLMs default to clichés. Override these defaults proactively. Each rule has a context-aware override path.

### 4.1 Typography

- **Display / Headlines:** Default `text-4xl md:text-6xl tracking-tighter leading-none`.
- **Body / Paragraphs:** Default `text-base text-gray-600 leading-relaxed max-w-[65ch]`.
- **Sans font choice:**
  - **Discouraged as default:** `Inter`. Pick `Geist`, `Outfit`, `Cabinet Grotesk`, `Satoshi`, or a brand-appropriate serif first.
  - **Override:** Inter is acceptable when the user explicitly asks for a neutral / standard / Linear-style feel, or when the brief is a public-sector / accessibility-first site.
- **Pairings to know:** `Geist` + `Geist Mono`, `Satoshi` + `JetBrains Mono`, `Cabinet Grotesk` + `Inter Tight`, `GT America` + `IBM Plex Mono`.
- **SERIF DISCIPLINE (VERY DISCOURAGED AS DEFAULT):**
  - Serif is **very discouraged as the default font for any project.** "It feels creative / premium / editorial" is NOT a reason to reach for serif.
  - **Serif is only acceptable when ONE of these is explicitly true:** the brand brief literally names a serif font, OR the aesthetic family is genuinely editorial / luxury / publication / manuscript / heritage / vintage AND you can articulate why this specific serif fits this specific brand.
  - For everything else, **default sans-serif display** (Geist Display, ABC Diatype, Söhne Breit, Cabinet Grotesk Display, Migra Sans, GT Walsheim, Inter Display, PP Neue Montreal).
  - **EMPHASIS RULE:** Use italic or bold of the SAME font for emphasis. Do NOT inject a random serif word into a sans headline.
  - **Specifically BANNED as defaults:** `Fraunces` and `Instrument_Serif`.
  - **If a serif is justified**, rotate from this pool, do NOT reuse the same serif across consecutive projects: PP Editorial New, GT Sectra Display, Cardinal Grotesque, Reckless Neue, Tiempos Headline, Recoleta, Cormorant Garamond, Playfair Display, EB Garamond, IvyPresto, Migra, Editorial Old, Saol Display, Söhne Breit Kursiv, Domaine Display, Canela, Schnyder, Tobias, NB Architekt, ITC Galliard.
- **ITALIC DESCENDER CLEARANCE (mandatory):** When italic is used in display type and the word contains a descender letter (`y g j p q`), `leading-[1]` or `leading-none` will clip the descender. Use `leading-[1.1]` minimum and add `pb-1` or `mb-1` reserve on the wrapping element.

### 4.2 Color Calibration

- Max 1 accent color. Saturation < 80% by default.
- **THE LILA RULE:** The "AI Purple / Blue glow" aesthetic is discouraged as a default. Use neutral bases (Zinc / Slate / Stone) with high-contrast singular accents (Emerald, Electric Blue, Deep Rose, Burnt Orange, etc.).
- **Override:** if the brand or brief explicitly asks for purple / violet / lila, embrace it with intent.
- **One palette per project.**
- **COLOR CONSISTENCY LOCK (mandatory):** Once an accent color is chosen, use it on the WHOLE page.
- **PREMIUM-CONSUMER PALETTE BAN (mandatory):** For premium-consumer briefs, the LLM default warm beige/cream + brass/clay/oxblood/ochre + espresso/ink dark text is BANNED as default. Concretely banned hex families:
  - Backgrounds: `#f5f1ea`, `#f7f5f1`, `#fbf8f1`, `#efeae0`, `#ece6db`, `#faf7f1`, `#e8dfcb`
  - Accents: `#b08947`, `#b6553a`, `#9a2436`, `#9c6e2a`, `#bc7c3a`, `#7d5621`
  - Text: `#1a1714`, `#1a1814`, `#1b1814`
  - **Default alternatives (rotate, do not reuse):** Cold Luxury (silver-grey + chrome + smoke), Forest (deep green + bone + amber), Black and Tan (true off-black + warm tan), Cobalt + Cream, Terracotta + Slate, Olive + Brick + Paper, Pure monochrome + single saturated pop.
  - **Override:** acceptable only when the brand brief explicitly names those colors, or the brand identity is genuinely vintage / artisan / warm-craft with clear justification.

### 4.3 Layout Diversification

- **ANTI-CENTER BIAS:** Centered Hero / H1 sections are avoided when `DESIGN_VARIANCE > 4`. Force "Split Screen" (50/50), "Left-aligned content / right-aligned asset", "Asymmetric white-space", or scroll-pinned structures.
- **Override:** centered hero is OK for editorial / manifesto / launch-announcement briefs.

### 4.4 Materiality, Shadows, Cards

- Use cards ONLY when elevation communicates real hierarchy. Otherwise group with `border-t`, `divide-y`, or negative space.
- When a shadow is used, tint it to the background hue. No pure-black drop shadows on light backgrounds.
- For `VISUAL_DENSITY > 7`: generic card containers are banned.
- **SHAPE CONSISTENCY LOCK (mandatory):** Pick ONE corner-radius scale for the page and stick to it.

### 4.5 Interactive UI States

Always implement full cycles:

- **Loading:** Skeletal loaders matching the final layout's shape.
- **Empty States:** Beautifully composed; indicate how to populate.
- **Error States:** Clear, inline (forms), or contextual (toasts only for transient).
- **Tactile Feedback:** On `:active`, use `-translate-y-[1px]` or `scale-[0.98]`.
- **BUTTON CONTRAST CHECK (mandatory, a11y):** Verify button text is readable against the button background (WCAG AA min 4.5:1 body, 3:1 large text).
- **CTA BUTTON WRAP BAN (mandatory):** Button text MUST fit on one line at desktop.
- **NO DUPLICATE CTA INTENT (mandatory):** One label per intent on the whole page.
- **FORM CONTRAST CHECK (mandatory, a11y):** Inputs, placeholders, focus rings, helper/error text all pass WCAG AA.

### 4.6 Data & Form Patterns

- Label ABOVE input. Helper text optional but present. Error text BELOW input. Standard `gap-2` for input blocks.
- No placeholder-as-label. Ever.

### 4.7 Layout Discipline (Hard Rules)

- **Hero MUST fit in the initial viewport.** Headline max 2 lines, subtext max 20 words AND max 3-4 lines, CTAs visible without scroll.
- **Hero font-scale discipline.** Plan font size and image size together.
- **HERO TOP PADDING CAP (mandatory):** max `pt-24` at desktop.
- **HERO STACK DISCIPLINE (max 4 text elements):** Eyebrow, Headline, Subtext, CTAs. No tiny tagline, trust micro-strip, pricing teaser, feature bullet list, or social-proof avatar row inside the hero.
- **"Used by" logo wall belongs UNDER the hero, never inside it.**
- **Navigation MUST render on a single line on desktop.** Height cap 80px, default 64-72px.
- **Bento grids MUST have rhythm.** BENTO CELL COUNT RULE: exact cell count matching content, no empty cells.
- **Section-Layout-Repetition Ban:** a layout family can appear at most once per page.
- **ZIGZAG ALTERNATION CAP:** max 2 consecutive image+text-split sections.
- **EYEBROW RESTRAINT (mandatory):** Maximum 1 eyebrow per 3 sections (hero counts as 1).
- **SPLIT-HEADER BAN:** "left big headline + right small explainer paragraph" pattern is banned as default.
- **Bento Background Diversity:** at least 2-3 cells need real visual variation.
- **Mobile collapse must be explicit per section.**

### 4.8 Image & Visual Asset Strategy

Priority order: (1) image-generation tool first, (2) real web images (e.g. `https://picsum.photos/seed/{descriptive-seed}/{w}/{h}`), (3) last resort - clearly labeled placeholder slots and tell the user.

- Div-based fake screenshots are banned.
- Real company logos for social proof (Simple Icons / devicon), never plain text wordmarks.
- Hand-rolled decorative SVGs strongly discouraged.

### 4.9 Content Density

- Default content shape per section: short headline (≤ 8 words) + short sub-paragraph (≤ 25 words) + one visual asset OR one CTA.
- No data-dump sections; use top highlights + "view full list", marquee/carousel, or a different page.
- Long lists (> 5 items) need a different UI component than a plain `<ul>`.
- **COPY SELF-AUDIT (mandatory before ship):** re-read every visible string for grammatical errors, unclear referents, or AI-hallucination-sounding phrases.
- Fake-precise numbers are flagged unless real, explicitly mocked, or brand-appropriate.
- One copy register per page.

### 4.10 Quotes & Testimonials

- Max 3 lines of quote body.
- No em-dash inside quote text.
- Attribution: name + role + (optionally) company.
- Use real typographic quotes, not straight ASCII.

### 4.11 Page Theme Lock (Light / Dark Mode Consistency)

The page has ONE theme. Sections do not invert (with a rare, deliberate exception for a documented "theme switch on scroll" device).

---

## 5. CONTEXT-AWARE PROACTIVITY

Tools, not defaults - use only when the design read calls for them.

- **Liquid Glass / Glassmorphism:** premium consumer / Apple-adjacent / luxury / media-overlay vibes only.
- **Magnetic Micro-physics:** `MOTION_INTENSITY > 5` and premium/playful/agency brief. Implement via `useMotionValue`/`useTransform`, never `useState`.
- **Perpetual Micro-Interactions:** use spring physics, not linear easing; not every card needs an infinite loop.
- **"Motion claimed, motion shown."** If `MOTION_INTENSITY > 4`, the page must actually move.
- **MOTION MUST BE MOTIVATED:** hierarchy, storytelling, feedback, or state transition - never "it looked cool."
- **MARQUEE MAX-ONE-PER-PAGE (mandatory).**
- **GSAP Sticky-Stack / Horizontal-Pan Patterns:** see canonical skeletons below (`start: "top top"`, `pin: true`).

### 5.A Sticky-Stack - Canonical Skeleton

```jsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function StickyStack({ cards }: { cards: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>(".stack-card");
      cardEls.forEach((card, i) => {
        if (i === cardEls.length - 1) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cardEls[cardEls.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: cardEls[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={ref} className="relative">
      {cards.map((card, i) => (
        <div
          key={i}
          className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center"
        >
          {card}
        </div>
      ))}
    </div>
  );
}
```

### 5.B Horizontal-Pan - Canonical Skeleton

```jsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function HorizontalPan({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;
    const ctx = gsap.context(() => {
      const distance = track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section ref={wrap} className="relative overflow-hidden">
      <div ref={track} className="flex h-[100dvh] items-center">
        {children}
      </div>
    </section>
  );
}
```

### 5.C Scroll-Reveal Stagger - Canonical Skeleton (lighter alternative)

```jsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export function RevealStagger({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="grid gap-6">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            delay: i * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {item}
        </motion.li>
      ))}
    </ul>
  );
}
```

### 5.D Forbidden Animation Patterns

- `window.addEventListener("scroll", ...)` is banned.
- Custom scroll progress via `window.scrollY` in React state is banned.
- `requestAnimationFrame` loops touching React state - use motion values instead.
- Use Motion's `layout`/`layoutId` for visible state changes only where needed.
- Use `staggerChildren` (Motion) or CSS cascade for sequenced reveals.

---

## 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS

### 6.A Hardware Acceleration
Animate ONLY `transform` and `opacity`. Use `will-change: transform` sparingly.

### 6.B Reduced Motion (mandatory)
Any motion above `MOTION_INTENSITY > 3` MUST honor `prefers-reduced-motion`.

### 6.C Dark Mode (mandatory for any consumer-facing page)
Design for both modes from the start. Maintain WCAG AA contrast (AAA for body) in both.

### 6.D Core Web Vitals Targets
LCP < 2.5s, INP < 200ms, CLS < 0.1. Run Lighthouse before declaring done.

### 6.E DOM Cost
Grain/noise filters only on fixed `pointer-events-none` pseudo-elements, never on scrolling containers.

### 6.F Z-Index Restraint
Use z-index strictly for systemic layer contexts; document the scale.

---

## 7. DIAL DEFINITIONS (Technical Reference)

**DESIGN_VARIANCE (1-10):** 1-3 Predictable (symmetrical grid), 4-7 Offset (overlaps, varied ratios), 8-10 Asymmetric (masonry, fractional grids). Mobile override: levels 4-10 collapse to single-column below 768px.

**MOTION_INTENSITY (1-10):** 1-3 Static (hover/active only), 4-7 Fluid CSS (transitions, cascades), 8-10 Advanced Choreography (scroll-triggered reveals, parallax - never `window.addEventListener('scroll')`).

**VISUAL_DENSITY (1-10):** 1-3 Art Gallery (huge gaps), 4-7 Daily App (standard spacing), 8-10 Cockpit (tight paddings, mono numbers).

---

## 8. DARK MODE PROTOCOL

Dual-mode by default.

- **Token Strategy:** Tailwind `dark:` variant OR CSS variables - pick one.
- **Do not prescribe specific colors** - the brief decides. Enforce contrast, hierarchy parity, brand fidelity.
- No pure `#000000` / `#ffffff` - use off-black/off-white.
- Respect `prefers-color-scheme`; add a manual toggle if either mode loses brand expression.
- Test in both modes before finishing.

---

## 9. AI TELLS (Forbidden Patterns)

Avoid these unless the brief explicitly asks for them.

### 9.A Visual & CSS
No neon/outer glows, no pure black, no oversaturated accents, no excessive gradient text, no custom mouse cursors.

### 9.B Typography
Avoid Inter as default (see 4.1). No oversized screaming H1s. Serif for editorial/luxury only.

### 9.C Layout & Spacing
No mathematically-perfect-but-generic spacing with awkward floating gaps. No 3-column equal feature cards.

### 9.D Content & Data ("Jane Doe" Effect)
No generic names/avatars, no fake-perfect numbers, no startup-slop brand names (Acme, Nexus, SmartFlow), no filler verbs (Elevate, Seamless, Unleash, Next-Gen, Revolutionize).

### 9.E External Resources & Components
No hand-rolled SVG icons, no div-based fake screenshots, no broken Unsplash links, shadcn/ui must be customized not left default.

### 9.F Production-Test Tells (banned outright)
No version labels in hero (V0.6, BETA), no section-number eyebrows (`00/INDEX`), no `01/4`-style pagination, no over-used middle-dots, no decorative colored status dots, no `<br>`-broken-italicized headline clichés, no vertical rotated agency text, no crosshair decoration lines, no fake product-preview divs, no "Quietly in use at" style copy, no locale/weather strips (unless genuinely relevant), no generic step labels ("Stage 1/2/3"), no pills overlaid on images, no fake photo-credit captions, no version footers on marketing pages, no live-stock-counter decoration, no decoration text strips at hero bottom, no floating top-right sub-text, no filled-track progress bars as decoration, no scroll cues ("Scroll ↓").

### 9.G EM-DASH BAN (the single most-violated Tell)

**Em-dash (`—`) is COMPLETELY banned** - in headlines, eyebrows, labels, pills, buttons, captions, nav, body copy, quotes, attribution. No exceptions. En-dash (`–`) as a separator is also banned; use a regular hyphen (`-`) for ranges. Only permitted dash characters: regular hyphen and minus sign in math.

---

## 10. REFERENCE VOCABULARY (Pattern Names)

**Hero:** Asymmetric Split Hero, Editorial Manifesto Hero, Video/Media Mask Hero, Kinetic-Type Hero, Curtain-Reveal Hero, Scroll-Pinned Hero.

**Navigation:** Mac OS Dock Magnification, Magnetic Button, Gooey Menu, Dynamic Island, Contextual Radial Menu, Floating Speed Dial, Mega Menu Reveal.

**Layout/Grids:** Bento Grid, Masonry Layout, Chroma Grid, Split-Screen Scroll, Sticky-Stack Sections.

**Cards:** Parallax Tilt Card, Spotlight Border Card, Glassmorphism Panel, Holographic Foil Card, Tinder Swipe Stack, Morphing Modal.

**Scroll:** Sticky Scroll Stack, Horizontal Scroll Hijack, Locomotive/Sequence Scroll, Zoom Parallax, Scroll Progress Path, Liquid Swipe Transition.

**Galleries:** Dome Gallery, Coverflow Carousel, Drag-to-Pan Grid, Accordion Image Slider, Hover Image Trail, Glitch Effect Image.

**Typography:** Kinetic Marquee, Text Mask Reveal, Text Scramble Effect, Circular Text Path, Gradient Stroke Animation, Kinetic Typography Grid.

**Micro-interactions:** Particle Explosion Button, Liquid Pull-to-Refresh, Skeleton Shimmer, Directional Hover-Aware Button, Ripple Click Effect, Animated SVG Line Drawing, Mesh Gradient Background, Lens Blur Depth.

**Animation libraries:** Motion (`motion/react`) for UI/state-change; GSAP + ScrollTrigger for scrolltelling; Three.js/WebGL for canvas/3D. Never mix GSAP/Three.js with Motion in the same tree.

---

## 11. REDESIGN PROTOCOL

- **Detect the mode first:** Greenfield / Redesign-Preserve / Redesign-Overhaul. Ask once if ambiguous.
- **Audit before touching:** brand tokens, IA, content blocks, patterns to preserve/retire, dial reading of existing site, SEO baseline.
- **Preservation rules:** don't change IA unless asked, extract real brand colors first, preserve copy voice, honor existing a11y wins, respect analytics event names.
- **Modernisation levers (priority order):** typography refresh → spacing/rhythm → color recalibration → motion layer → hero/key-section recomposition → full block replacement.
- **Never change silently:** URL structure, primary nav labels, form field names/order, brand logo, legal/consent copy.

---

## 12. THE BLOCK LIBRARY (Schema)

Blocks live under `skills/taste-skill/blocks/<category>/<name>.md` with required frontmatter (name, category, dial_compatibility, when_to_use, not_for, stack) and required body sections (visual sketch, props API, code sketch, mobile fallback, motion variants, dark-mode notes, anti-patterns, references).

---

## 13. OUT OF SCOPE

Not for: dashboards/admin panels (use Fluent/Carbon/Atlassian/Polaris), data tables (TanStack/AG Grid), multi-step forms/wizards, code editors (Monaco/CodeMirror), native mobile (HIG/Material directly), realtime collab UIs.

---

## 14. FINAL PRE-FLIGHT CHECK

Run this matrix before shipping. If any box fails, the output is not done. Key checks include: brief inference declared, dials reasoned explicitly, design system chosen or aesthetic labeled honestly, zero em-dashes anywhere, one theme lock, one accent color lock, one corner-radius system, button/form contrast (WCAG AA), no CTA wrap, serif discipline, premium-consumer palette check, italic descender clearance, hero fits viewport with padding cap and max 4 text elements, eyebrow count ≤ ceil(sections/3), no split-header pattern, zigzag cap, no duplicate CTA intent, logo-wall real SVGs with no category labels, copy self-audit for broken/hallucinated strings, motion motivated and actually shown, one marquee max, single-line nav ≤80px, no repeated layout families, exact bento cell count, proper long-list components, real images only (no fake screenshots/hand-rolled SVGs), no decorative pills/captions/version footers/locale strips/scroll cues/section-number eyebrows/decorative dots/every-row hairlines, sane content density, quotes ≤3 lines, GSAP skeletons correct, no `window.addEventListener('scroll')`, reduced-motion wrapped, dark mode tested both ways, mobile collapse explicit, `min-h-[100dvh]` not `h-screen`, cleanup functions present, empty/loading/error states provided, allowed icon libraries only, motion isolated to client leaves, no AI tells from Section 9, Core Web Vitals plausible, one design system per project.

---

## Appendix A - Install Commands per Design System

```bash
# Material Web (Material 3)
npm install @material/web

# Fluent UI React (v9)
npm install @fluentui/react-components

# Fluent UI Web Components (framework-free)
npm install @fluentui/web-components @fluentui/tokens

# IBM Carbon
npm install @carbon/react @carbon/styles

# Radix Themes
npm install @radix-ui/themes

# shadcn/ui (open code, owned components)
npx shadcn@latest init
npx shadcn@latest add button card badge separator input

# Primer CSS (GitHub product/devtool UI)
npm install --save @primer/css

# Primer Brand (GitHub marketing UI)
npm install @primer/react-brand

# GOV.UK Frontend
npm install govuk-frontend

# USWDS (US Web Design System)
npm install uswds

# Atlassian Design System (Atlaskit)
yarn add @atlaskit/css-reset @atlaskit/tokens @atlaskit/button @atlaskit/badge @atlaskit/section-message @atlaskit/card

# Bootstrap 5.3
npm install bootstrap
```

## Appendix B - Canonical Sources

- Material Web: https://github.com/material-components/material-web
- Fluent UI: https://fluent2.microsoft.design/get-started/develop
- Carbon: https://carbondesignsystem.com/
- Shopify Polaris: https://shopify.dev/docs/api/app-home/web-components
- Atlassian: https://atlassian.design/get-started/develop
- Primer: https://primer.style/
- GOV.UK: https://design-system.service.gov.uk/components/button/
- USWDS: https://designsystem.digital.gov/documentation/developers/
- Bootstrap: https://getbootstrap.com/docs/5.3/layout/grid/
- Tailwind: https://tailwindcss.com/docs/dark-mode
- Radix: https://www.radix-ui.com/themes/docs/components/theme
- shadcn/ui: https://ui.shadcn.com/docs

## Appendix C - Apple Liquid Glass: Honest Web Approximation

There is no official `liquid-glass.css` from Apple for websites. A labeled web approximation:

```css
.liquid-glass-web-approx {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / .32);
  background:
    linear-gradient(135deg, rgb(255 255 255 / .30), rgb(255 255 255 / .08)),
    rgb(255 255 255 / .12);
  backdrop-filter: blur(24px) saturate(180%) contrast(1.05);
  -webkit-backdrop-filter: blur(24px) saturate(180%) contrast(1.05);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .48),
    inset 0 -1px 0 rgb(255 255 255 / .12),
    0 18px 60px rgb(0 0 0 / .18);
}

@media (prefers-color-scheme: dark) {
  .liquid-glass-web-approx {
    border-color: rgb(255 255 255 / .18);
    background:
      linear-gradient(135deg, rgb(255 255 255 / .16), rgb(255 255 255 / .04)),
      rgb(15 23 42 / .42);
  }
}

@media (prefers-reduced-transparency: reduce) {
  .liquid-glass-web-approx {
    background: rgb(255 255 255 / .96);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

---

**Source:** https://github.com/Leonxlnx/taste-skill (skills/taste-skill/SKILL.md)
**License:** MIT — check the source repo for the latest version and full license text.
