# Handoff: Sankalp Tyagi Portfolio Redesign

## Overview
A complete redesign of Sankalp Tyagi's personal portfolio — a frontend focused full stack developer. The brief was an out of the box, award worthy site (Awwwards "Site of the Day" energy), abandoning the previous minimalist developer template.

The identity is **playful brutalist**: near black canvas, a single shouting **acid green** accent, oversized display type, asymmetric grids, and heavy choreographed motion. The site has three routes (Home, Projects, About) with full bleed page transitions.

---

## About the Design Files
The files in `reference/` are a **design reference created in HTML/CSS/vanilla JS**. They are a working prototype that demonstrates the intended look, layout, motion, and behavior. **They are not production code to copy verbatim.**

Your task is to **recreate this design in the target stack** using its idiomatic patterns and libraries:

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** for styling (map the tokens below to `tailwind.config.ts`)
- **Framer Motion** for component level animation, enter/exit, layout, and page transitions
- **GSAP + ScrollTrigger** for scroll driven timelines (reveals, counters, parallax, pinned/scrub effects)
- **Lenis** for smooth scroll (sync with ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`)
- **WebGL hero** — recreate with **react-three-fiber + drei** (a fullscreen shader plane) or **OGL**. The reference uses raw WebGL; the GLSL fragment shader is reusable as is (see `reference/js/shader.js`).

The reference `js/main.js` rolls its own router/reveals/counters in vanilla JS only because the prototype is a single HTML file. **In Next.js, replace these with the framework equivalents** (App Router routes + `AnimatePresence` for transitions, a reusable `useGsapReveal` hook, etc.). Treat the vanilla JS as a spec for *what* should happen and *with what timing*, not *how* to structure it.

---

## Fidelity
**High fidelity (hifi).** Final colors, typography, spacing, copy, and motion are all specified. Recreate pixel faithfully. Where the reference uses a measured/JS fit (the hero title), reproduce the *intent* (fill the column width, never overflow) — exact px will differ by viewport.

---

## Tech / Library Notes
- **Smooth scroll:** Lenis, `duration: 1.15`, easing `(t) => Math.min(1, 1.001 - 2^(-10t))`, `smoothWheel: true`. Drive `requestAnimationFrame` and forward scroll to `ScrollTrigger.update`.
- **GSAP + ScrollTrigger** registered once. Use `expo.out` for reveals (`duration ~1.0`), `power2.out` for counters (`duration 2.0`), `expo.inOut` for the page wipe.
- **Page transitions:** the reference uses a 6 column acid panel wipe with a morphing label. In Next.js, implement with `AnimatePresence` + a route transition overlay (or `framer-motion` `motion.div` columns with staggered `scaleY`). Keep the label morph ("HOME" / "WORK" / "ABOUT").
- **Custom cursor:** a dot (instant) + a ring (lerped, `0.18` follow factor) + a label readout. Ring grows on hover; "drag" state (big filled circle) when a `data-cursor` label is present. Magnetic elements translate toward the pointer by a `strength` factor (`0.2`–`0.45`). Disable all of this on touch / coarse pointers and under `prefers-reduced-motion`.
- **Accessibility:** honor `prefers-reduced-motion` everywhere — kill the cursor, the marquee, parallax, the shader animation (render one static frame), and replace reveal transforms with instant visible states. Maintain focus order; project cards use `role="link"` + `tabindex="0"`.
- **Performance:** pause the WebGL render loop when the hero leaves the viewport (IntersectionObserver). Cap DPR at ~1.75.

---

## Design Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| `bg` | `#0a0a0a` | Page background (near black) |
| `bg-2` | `#0e0e0d` | Marquee strip / subtle panels |
| `ink` | `#edede4` | Primary text (warm off white) |
| `ink-dim` | `#8f8f86` | Secondary / muted text |
| `acid` | `#c6ff3a` | THE accent — used sparingly but loud |
| `acid-deep` | `#9ed40f` | Acid shadow / dashed placeholder borders |
| `line` | `rgba(237,237,228,0.12)` | Hairline dividers |
| `line-strong` | `rgba(237,237,228,0.28)` | Stronger borders / button outlines |

Selection: background `acid`, text `#0a0a0a`. On the acid Contact section this inverts (selection bg `#0a0a0a`, text acid).

### Typography
Google Fonts. Three families:
- **Display — `Syne`** (weights 600, 700, 800). All oversized headings, names, project titles. Tight tracking.
- **Body / UI — `Space Grotesk`** (400, 500, 600, 700). Paragraphs, hero subcopy, form inputs.
- **Mono — `Space Mono`** (400, 700). Labels, kickers, nav indices, coordinates, tags, button text, stat captions.

Type treatments:
- Headings use `letter-spacing` from `-0.03em` to `-0.045em`, `line-height` `0.82`–`0.92`.
- **Outline text:** `color: transparent; -webkit-text-stroke: 1.5px var(--ink)` (used on "TYAGI", "SAFETY", "WOMEN'S").
- **Acid emphasis:** `<em>` rendered non italic, `color: var(--acid)` (used on "UI.", "shipped.", "work.", "feel.", etc.).
- Mono labels: `font-size: 11–13px`, `letter-spacing: 0.08em–0.18em`, `text-transform: uppercase`.

### Spacing / Layout
- Global page padding: `--pad = clamp(20px, 4.5vw, 72px)` (left/right gutters).
- Section vertical padding: `clamp(90px, 13vw, 200px)`.
- Primary easing curve: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Border radius: buttons/pills `100px`; media/cards `4px`. The aesthetic is mostly **sharp** — radius is minimal by design.
- Grain overlay: fixed full screen SVG fractal noise, `opacity 0.045`, `mix-blend-mode: screen`.

### Shadows
Effectively none. Depth comes from motion, type scale, and the acid accent — not shadows. Do not add drop shadows.

---

## Screens / Views

### Global Chrome (present on every route)
- **Nav (fixed, top):** `mix-blend-mode: difference` so it reads on any background. Left: brand `● SANKALP TYAGI` (Syne 800, 18px; the dot is a 9px acid circle; brand is magnetic, strength 0.25). Right: nav links `01 Home` · `02 Projects` · `03 About` (Space Mono, 12px, uppercase, `0.12em` tracking; the index number is acid). Each link has an underline that wipes in from left on hover/active (`scaleX` 0→1, transform-origin flips). Active route stays underlined. Padding `22px var(--pad)`.
- **Custom cursor:** dot (7px acid), ring (38px, 1px acid border, `mix-blend-mode: difference`), label (Space Mono 10px). See cursor spec above.
- **Page wipe overlay:** 6 equal columns of acid that `scaleY` up from bottom (staggered 0.05s) to cover, swap the view, then `scaleY` down from top. A giant centered Syne label ("HOME"/"WORK"/"ABOUT") fades in over the cover.
- **Grain overlay** (see tokens).

---

### 1. Home — Hero (`100svh`, min 640px)
- **WebGL background** (`#gl`, absolutely positioned, z0): a domain warped fractal flow field tinted acid on near black. **Mouse reactive** — the field warps/pulls toward the cursor and a soft acid halo blooms at the pointer. Slow autonomous drift via a `u_time` uniform. Full GLSL is in `reference/js/shader.js` (uniforms: `u_res`, `u_time`, `u_mouse` 0..1, `u_mdist` influence 0..1). Mouse is eased (`0.06` lerp). Fallback to a static acid radial gradient if WebGL is unavailable.
- **Top meta row** (absolute, Space Mono, `ink-dim`): left `FRONTEND FOCUSED / FULL STACK DEVELOPER`; right (right aligned) `BASED IN INDIA / AVAILABLE 2026`.
- **Hero title** (Syne 800, `mix-blend-mode: difference`, color `#fff`): three lines, each in an `overflow: hidden` mask for the reveal —
  - Line 1: `SANKALP` (solid)
  - Line 2: `TYAGI` (outline / text stroke)
  - Line 3: `BUILDS UI.` where `UI.` is acid
  - **Fit rule:** title font size is computed so the widest line fills the content column width (`* 0.985` for breathing room) and never overflows. Recompute on resize and after fonts load. (Reference impl: `fitHeroTitle()` in `main.js`.)
- **Hero subcopy** (bottom left, Space Grotesk, max 520px): "I engineer interfaces where motion, detail and performance meet. React, Next.js and Framer Motion are my instruments — interaction quality is the point, not the afterthought."
- **Hero CTAs** (bottom right): primary solid acid button **"See the work"** (scrolls to selected work); outline button **"LinkedIn"** with an arrow glyph (opens LinkedIn). Both magnetic (strength 0.45).
- **Scroll cue** (bottom center): `SCROLL` + a 1px vertical bar with an acid segment animating downward on a loop.
- **Hero intro timeline:** lines slide up from `yPercent 120` → 0 (`expo.out`, stagger 0.1); then top meta, subcopy, CTAs, scroll cue fade up in sequence. On scroll, the hero content parallaxes down (`yPercent 18`) and the canvas scales up slightly (scrub).

### Buttons (global component)
- **Outline:** pill, `1px line-strong` border, Space Mono 12px uppercase. On hover an acid fill wipes up from the bottom (`translateY 101% → 0`) and the text flips to `#0a0a0a`.
- **Solid:** acid background, `#0a0a0a` text; on hover a `#0a0a0a` fill wipes up and text flips to acid.
- Optional arrow: a 7px square with two borders rotated 45° (a chevron).
- Buttons are magnetic.

### Home — Marquee strip
Full bleed, top/bottom hairline borders, `bg-2`. A horizontal track of Syne 800 items (`clamp(40px, 7vw, 110px)`): `REACT ✦ NEXT.JS ✦ FRAMER MOTION ✦ TYPESCRIPT ✦ INTERACTION DESIGN`. Items alternate between outline (text stroke `ink-dim`) and filled acid. The `✦` stars are acid. **Marquee speed reacts to scroll velocity** (Lenis velocity adds to base drift), then eases back. Duplicate the track for a seamless loop.

### Home — Experience (`#experience`)
- Header: kicker `02 — Experience` (acid, Space Mono, with a leading 28px acid rule) + big head `Where I have shipped.` ("shipped." in acid). Split word reveal.
- One experience row (grid `0.7fr 1.6fr 1fr`, top hairline border):
  - When: `2025 — Present / Internship` (Space Mono, ink-dim)
  - Role: **`Frontend Developer @ Sneads`** (Syne 700, `@ Sneads` in acid) + tag pills: `React`, `Next.js`, `Framer Motion`, `API Integration`
  - Desc: "Built production interfaces with React and Next.js, wired live data through API integration, and brought screens to life with Framer Motion. Focused on responsiveness, accessibility and the small details that make a product feel considered."
- **Stats row** (4 columns), each a Syne 800 acid number with a Space Mono caption. **Numbers count up** (GSAP, `power2.out`, 2s, triggered at scroll):
  - `40+` — Components shipped to production
  - `60fps` — Animation target, held under load
  - `3` — Core projects, end to end
  - `100%` — Responsive, mobile to desktop
- Tags (`.tag`): Space Mono 11px uppercase, `1px line-strong` pill, `ink-dim` text.

### Home — Selected Work (`#projects-teaser`)
- Header: big head `Selected work.` ("work." in acid) + an `All projects` outline button → navigates to Projects route.
- Two project cards (grid `1fr 1fr`, alternating sides via a `flip` modifier that reorders the media):
  - **Media:** `aspect-ratio 4/3`, `4px` radius. Currently a **styled placeholder** — diagonal acid hairline stripe pattern over a dark green→black gradient, with a dashed acid bordered mono label (e.g. `AETHER — screenshot`) and an index `(01)`. A bottom scrim gradient. **Mouse parallax:** inner layer scales `1.12` and translates opposite the pointer. Reveal via `clip-path` wipe (`inset(0 0 100% 0)` → `inset(0 0 0% 0)`, `expo.out`).
  - **Info:** project name (Syne 800, huge), mono meta line, blurb (Space Grotesk), stack tags. Whole card is a link to the Projects route, `data-cursor="Open"`.
  - **AETHER** — meta `Django Microblogging Platform · 2025`; blurb "A full microblogging platform — posting, feeds, and accounts — built on Django with server rendered views and a clean component driven front end."; stack `Django HTML CSS Bootstrap 5 SQLite Git`.
  - **Women's Safety Analytics** (rendered as outline `SAFETY` + `ANALYTICS`) — meta `Geospatial Crime Data System · 2025`; blurb "A geospatial system that turns crime data into actionable safety insight for women — mapping risk across space and time with a Python data pipeline."; stack `Python Pandas NumPy OpenCV`.

### Home — Contact (`#contact`) — ACID SECTION
Full bleed **acid green background, `#0a0a0a` text** (the one inverted section). Selection colors invert.
- Kicker `04 — Contact` (now black) + contact head `Let us build something.` (Syne 800, `clamp(48px, 12vw, 220px)`).
- Left column — info blocks (mono label + Syne value, values have an underline wipe on hover):
  - Phone: **`+91 90684 99273`** (`tel:+919068499273`)
  - LinkedIn: `in/sankalp-tyagi` → `https://www.linkedin.com/in/sankalp-tyagi-173844265/`
  - Availability: `Open to frontend roles, 2026`
- Right column — **message form** (`name`, `email`, `message`): underlined fields on a 2px black bottom border, mono labels, placeholder text. Client side validation (required + email regex); error state turns the field border red (`#c81e1e`) with a mono error message; on success shows "Message sent. I will reply shortly." for 4s and resets. Submit button is black with acid text (hover fill wipes white), magnetic.
- Footer: `© 2026 Sankalp Tyagi` · `Frontend Focused Full Stack Developer` · `LinkedIn ↗`.

---

### 2. Projects route (`/projects`)
- Header: kicker `02 — Projects` + big head `Things I have made.` ("made." acid).
- The two projects again, **full detail** (same media/parallax/clip treatment, alternating sides):
  - **AETHER** — blurb "AETHER is a complete microblogging platform — users post, browse a live feed, and manage accounts. Built on Django with server rendered views, a SQLite store and a responsive Bootstrap 5 front end, version controlled end to end with Git." Stack `Django HTML CSS Bootstrap 5 SQLite Git`. CTA outline button "Case study soon".
  - **Women's Safety Analytics** (`WOMEN'S` outline + `SAFETY ANALYTICS`) — blurb "A geospatial analytics system that reads crime data and maps risk for women across space and time. A Python pipeline cleans and models the data with Pandas and NumPy, while OpenCV powers the visual processing layer that turns raw numbers into readable maps." Stack `Python Pandas NumPy OpenCV`. CTA "Case study soon".
- Closing block (centered): big head `Want the full story?` ("full" acid) + buttons `Get in touch` (→ Home `#contact`) and `More about me` (→ About).
- Footer with `Back home ↑`.

### 3. About route (`/about`)
- Header: kicker `03 — About` + lead (Syne 600, `clamp(28px, 4.6vw, 74px)`, max 16ch): "I make interfaces that **feel** as good as they look." ("feel" acid).
- Grid `1fr 1fr`:
  - **Portrait** (`aspect-ratio 3/4`): styled placeholder (same stripe/gradient treatment, dashed `Portrait — photo` label), clip wipe reveal.
  - **Body** (3 paragraphs, `ink-dim` with `ink` strong spans):
    1. "**I am Sankalp Tyagi, a frontend focused full stack developer.** My work lives at the intersection of engineering and craft — I care about how a button responds under your finger as much as how the data flows behind it."
    2. "Right now I am a frontend developer at **Sneads**, building production interfaces with React and Next.js, integrating live APIs, and choreographing motion with Framer Motion. I am happiest when a screen goes from functional to delightful."
    3. "Beyond the front end, I build full systems — from a Django microblogging platform to a Python powered geospatial analytics tool. I like understanding the whole stack so the surface can be exactly right."
  - **Skills list** (rows with hairline borders; Syne name left, acid mono value right):
    - `React / Next.js` → DAILY DRIVER
    - `Framer Motion / GSAP` → MOTION
    - `TypeScript` → FLUENT
    - `Python / Django` → BACKEND
    - `Pandas / NumPy / OpenCV` → DATA
  - Buttons: `Work with me` (→ Home `#contact`) and `LinkedIn`.
- Footer with `Back home ↑`.

---

## Interactions & Behavior (summary)
- **Routing:** Home / Projects / About. Reference is a single page that toggles view divs behind a wipe; **in Next.js use real App Router routes** with `AnimatePresence` for the wipe transition. Some buttons deep link to Home + scroll to `#contact` after the transition.
- **Reveals (per section, on scroll, GSAP ScrollTrigger):**
  - `data-split` — headline split into words, each masked, slides up `yPercent 115→0`, `expo.out`, stagger `0.045`.
  - `data-reveal` — line mask reveal, stagger `0.08`.
  - `data-fade` — fade + 40px rise, `expo.out`, optional delay.
  - `data-clip` — `clip-path` inset wipe for media.
  - `data-count` — number counter (supports a suffix and one decimal).
  - `data-parallax` — `yPercent` scrub within a `data-parallax-scope`.
- **Micro interactions:** magnetic buttons/links, hover fill wipes on buttons, underline wipes on nav and contact links, image zoom+parallax on project media hover, custom cursor states.
- **Marquee:** scroll velocity reactive.
- **Form:** required + email validation, inline errors, success message, reset.
- **Reduced motion:** full graceful fallback (see Tech Notes).

## Responsive Behavior
- `≤900px`: experience row, projects, about grid, contact grid all collapse to single column; project media un-flips; hero subcopy/CTAs reflow above the scroll cue.
- `≤560px`: brand text hides (dot remains), hero meta shrinks, stats become 2 columns.
- Hit targets ≥44px. Touch devices: no custom cursor, no magnetic, native cursor restored.

---

## Assets
- **Fonts:** Google Fonts — Syne, Space Grotesk, Space Mono.
- **Project imagery / portrait:** NOT yet provided — currently styled placeholders (diagonal acid stripe pattern + dashed mono labels). Sankalp will supply screenshots of AETHER and Women's Safety Analytics and a portrait photo; drop them into the `.proj-media` / `.portrait` containers (`object-fit: cover`) and keep the hover zoom/parallax.
- **Grain:** inline SVG fractal noise (no external file).
- **Icons:** none beyond the CSS chevron and the `✦` glyph. No icon library required.

## Real data
- Name: **Sankalp Tyagi** · Role: frontend focused full stack developer
- Phone: **+91 9068499273** · LinkedIn: **https://www.linkedin.com/in/sankalp-tyagi-173844265/**
- Experience: **Sneads** internship (React, Next.js, Framer Motion, API integration)
- Projects: **AETHER** (Django, HTML, CSS, Bootstrap 5, SQLite, Git) · **Women's Safety Analytics** (Python, Pandas, NumPy, OpenCV)

## Copy rule (IMPORTANT)
**No hyphens in any user facing text.** Rewrite with commas, em dashes, or different wording (e.g. "frontend focused full stack developer", "end to end", "server rendered"). Keep this rule when adding any new copy.

---

## Files
- `reference/index.html` — full prototype markup (all three views)
- `reference/css/styles.css` — all styles + tokens (`:root`), responsive rules, reduced motion fallback
- `reference/js/shader.js` — WebGL hero shader (reusable GLSL + setup)
- `reference/js/cursor.js` — custom cursor + magnetic interaction
- `reference/js/main.js` — Lenis init, GSAP reveal/counter/parallax system, marquee, view router + wipe, hero title fit, hero intro, form validation

Open `reference/index.html` in a browser to see the live design and motion.
