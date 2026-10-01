---
name: nayots — GitHub profile
description: One night sky, cut into plates; a name rendered as luminous stardust.
colors:
  navy-bg: "#04060D"
  ice-white: "#F1F5FF"
  ice-accent: "#99D1FF"
  star-tone: "#AAD7FF"
  gold-accent: "#FFBD57"
  gold-highlight: "#FFCD78"
  nebula-core: "#141C3A"
  scene-stop-1: "#0A0F21"
  scene-stop-3: "#030509"
typography:
  headline:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "30-36 units (narrow layout: 42-54)"
    fontWeight: 700
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17-19 units (narrow layout: 30-32)"
    fontWeight: 500
    letterSpacing: "normal"
  label:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14-15 units (narrow layout: 28)"
    fontWeight: 500
    letterSpacing: "normal"
  action:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17 units (narrow layout: 32)"
    fontWeight: 700
    letterSpacing: "-0.01em"
rounded:
  run: "20px"
spacing:
  plate-inset: "40px"
  star-inset: "6px"
  keep-clear: "8px"
components:
  plate:
    backgroundColor: "{colors.navy-bg}"
    rounded: "{rounded.run}"
    width: "840px"
  action-link:
    textColor: "{colors.gold-highlight}"
    typography: "{typography.action}"
  plate-heading:
    textColor: "{colors.ice-white}"
    typography: "{typography.headline}"
  plate-meta:
    textColor: "{colors.star-tone}"
    typography: "{typography.label}"
---

# Design System: nayots — GitHub profile

## Overview

**Creative North Star: "One Night Sky"**

The profile is a single observation of a navy night sky, cut into plates. Every image in the README is a self-contained SVG drawn from the same vocabulary (`scripts/lib/sky.mjs`): the same ground, the same three classes of star, the same type, the same motion. Stacked in one Markdown paragraph, the plates meet at seams where half-nebulae line up, so the column reads as one continuous sky, not a stack of cards. The sky stays navy in both GitHub themes; the page around it changes, the sky does not.

Density is low and luminous. Type is lowercase Space Grotesk set on the sky. Stars keep clear of every word and of the brand marks, and gold is rare: it marks glints and the one action on each work plate. Motion is ambient and slow (stars ignite once, twinkle, glints breathe, lines draw in) and everything stays readable with motion off.

This repository does not own the identity. Palette, marks and brand type come from the sibling repository `nayots_branding`: `BRAND.md` and `brand/tokens/tokens.json` (read-only, upstream). The colour tokens below repeat the subset of that palette the plates use, with the upstream names. If upstream changes, upstream wins, and this file and `C` in `scripts/lib/sky.mjs` follow it. The GitHub rendering constraints the system is built around (images only through `<img>`, no script, no external loads, the sanitizer's allow-list, never `<picture>` inside `<a>`, assets under ~500 KB) are recorded in `AGENTS.md` and are not repeated here.

**Key Characteristics:**
- Flat navy plates, all on an 840-unit viewBox, joined into one run with seams that line up.
- Three star classes: dust, star and the gold four-point glint.
- Four type roles: heading, body, meta and action.
- Two text layouts per plate, wide and narrow, switched inside the SVG at 540px.
- Official particle marks nested unaltered, sitting directly in the sky through `lighten` blending.
- Entrance motion begins from a visible state; reduced motion is honoured.

## Colors

The palette is the nayots Ice·Gold palette on deep navy. Every value comes from `nayots_branding/brand/tokens/tokens.json` and nothing else. Opacity variants of these are the only variation allowed.

### Primary
- **Gold Highlight** (`gold-highlight`): the glint body, the action link and its arrow, and the contribution-streak line on the sky plate. Gold always means "look here" or "go here".
- **Gold Accent** (`gold-accent`): used only inside the gold glint halo gradient (`ny-halo-gold`, 0.55 → 0.16 → 0), never as a fill for text or shapes.

### Secondary
- **Ice Accent** (`ice-accent`): constellation lines (opacity 0.55, dashed bridges 0.32), the ice glint variant with its halo (`ny-halo-ice`), and the "today" ping ring on the sky plate.
- **Star Tone** (`star-tone`): the middle star class, quiet days on the sky plate, and the meta/label type role.

### Neutral
- **Navy Ground** (`navy-bg`): the ground of every plate, and the outer stop of every nebula.
- **Ice White** (`ice-white`): headings (opaque), body (fill-opacity 0.74), dust stars, constellation node stars, and the hot core of every glint.
- **Nebula Core** (`nebula-core`): centre of the elliptical nebula gradients, fading through Scene Stop 1 to transparent navy.
- **Scene Stop 1** (`scene-stop-1`): the 55% stop of every nebula.
- **Scene Stop 3** (`scene-stop-3`): the soft lift shadow under the sourced widget raster on the usage-monitor plate.

`scene-stop-2` and `deep-ice-on-light` are brand tokens the plates do not use. The light-ground solid appears only inside the official flat monogram in the README footer, which swaps by theme through `<picture>`.

### Named Rules
**The Upstream Palette Rule.** No colour outside `nayots_branding` tokens, ever. A new tint is an opacity on an existing token, not a new hex.

**The Rare Gold Rule.** Gold goes on glints, the single action on a work plate, and the streak line. Never on headings, body or decoration.

## Typography

**Display Font:** none of its own: the display voice is the official wordmark, nested as an asset (never re-typeset).
**Body Font:** Space Grotesk 500 and 700 (fallback `ui-sans-serif, system-ui, sans-serif`), embedded as WOFF2 data-URI subsets in every plate.

**Character:** A geometric grotesk with quirky terminals, set in lowercase. It reads like a star chart's labels: technical, calm and warm.

All sizes are SVG user units on the 840-unit plate. On a phone the whole plate renders at about 0.43 scale, which is why the narrow layout uses larger sizes.

### Hierarchy
- **Heading** (`.h`; 700, ice-white, −0.035em, lowercase): plate titles at 30 (constellations, sky) or 36 (hero name, work titles); 42–54 in the narrow layout. Constellation labels use the same role at 16 / 30 with fill-opacity 0.86 / 0.92.
- **Body** (`.b`; 500, ice-white at fill-opacity 0.74): the hero subline at 19, plate ledes and work blurbs at 17–18 on a 27-unit line step, wrapped to a 450-unit measure and limited to 3 lines; narrow: 30–32 and at most 2 lines.
- **Meta** (`.m`; 500, star-tone at fill-opacity 0.86): stack/licence lines at 15, the sky plate's date and month ticks at 14 (fill-opacity 0.62); narrow ticks at 28, only every third month.
- **Action** (`.a`; 700, gold-highlight, −0.01em): the one link line on a work plate, 17 / 32, followed by a stroked path arrow, pinned 40 units above the plate foot.

### Named Rules
**The Lowercase Sky Rule.** Headings, labels and actions are lowercase. Sentence case is kept only for running body copy where proper nouns matter (Claude Code, Codex, GPU).

**The Measured Text Rule.** Text placement is computed from the embedded font's advance widths (`scripts/fonts/metrics.json`), so star keep-clear boxes and wraps match the rendered glyphs. A new character means rebuilding the subset and the metrics together.

## Layout

- **One width.** Every plate is `viewBox="0 0 840 h"` and is shown at `width="100%"` in a centred paragraph, so all plates scale together (~830px desktop column, ~358px phone). Heights in the build: hero 340, constellations 320, work plates 300, sky 360.
- **One run.** The constellations, both work plates and the sky sit in a single `<p>` with `align="top"`, with no gap between them. The hero and the footer stand apart, divided by Markdown prose.
- **Inset.** Text starts at x=40 and right-aligned text ends at x=800. Starfields keep 6 units from the edge and 8 units clear of every text box and mark ink box.
- **Work plates** put text on the left and the visual on the right (x≈548, ~240–270 wide). The meta line follows the blurb at a fixed step, and the action is pinned to `h − 40`, so both work plates end on the same line.
- **Narrow switch.** Each plate carries a `.w` (wide) and an `.n` (narrow) text layout. `@media (max-width:540px)` inside the SVG, evaluated against the rendered `<img>` width, hides `.w` and shows `.n`: fewer words, larger sizes (blurbs become a short line, the stat line becomes the total, month ticks thin out to every third). The hero mark scales 1.32× about its ink centre in the narrow layout to stay above the brand's 64px particle minimum.

## Elevation & Depth

The sky is flat. There are no plate shadows, borders or tonal panels. Depth comes from light: nebula gradients behind, a layered starfield, and halos on bright stars and glints. A nebula is an elliptical radial gradient from Nebula Core through Scene Stop 1 (at 55%) to transparent navy. Nebulae sit away from the marks and from the text.

### Shadow Vocabulary
- **Raster lift** (`feDropShadow dx 0 dy 14 stdDeviation 16`, Scene Stop 3 at 0.9): used once, under the sourced AI Usage Monitor screenshot, together with a 70-unit bottom fade so the raster melts into the sky. This applies to sourced rasters only, never to brand marks or type.

### Named Rules
**The Light-Not-Shadow Rule.** Depth is made with nebulae and halos, not with drop shadows or panels.

**The Shared Seam Rule.** Where two plates meet, each carries half of the same nebula (250 × 78, opacity 0.95) centred on the shared edge at the same x. The current run is constellations ↔ usage monitor at x=640, usage monitor ↔ nayots.com at x=200, and nayots.com ↔ sky at x=560. Reordering or inserting a plate means re-pairing these x values.

## Shapes

The frame is a clip path on a 20-unit radius, and only the outer corners of a run are rounded. A standalone plate (the hero) rounds all four corners. The first plate of a run rounds only the top, the last only the bottom, and inner plates are square, so the run reads as one rounded sky (`corners: "all" | "top" | "none" | "bottom"`). Nothing has a stroke border.

Two drawn forms recur:
- **The glint**: a four-point star of four quadratic curves whose control points sit at **0.306 of the radius**, the ratio of the star carved into the keystone monogram.
- **The arrow**: a stroked path (stroke width 0.1 × size, round caps and joins), never a text glyph.

## Components

### Plate
The unit of the system: navy ground, a frame clip, an accessible `<title>` and `<desc>` via `role="img"`, embedded fonts, and the shared type, motion, narrow and reduced-motion CSS. Everything a plate needs is inside the file: no script, no external fetch, rasters as data URIs.

### Starfield (three star classes)
- **Dust**: about 72% of the field; ice-white dots, radius 0.45–1.05, opacity 0.22–0.62.
- **Star**: the rest of the field; star-tone, radius 0.9–1.7, opacity 0.55–0.95. On constellation nodes and active sky days, an ice-halo star.
- **Glint**: gold four-point star with a halo at 2.6× its radius and an ice-white core (minimum radius 0.8). An ice-accent variant uses the ice halo. Glints mark constellation alpha stars, the five busiest days and the hero's corners, and they pulse.
- Fields are seeded deterministically, so a rebuild changes a file only when its data changes. Stars are bucketed into vertical slices for a left-to-right ignition; about 28% of them twinkle on one of three cadences.

### Constellation
Ice-accent hairlines (width 1.15, opacity 0.55, round caps) that draw themselves in, figure by figure. Dashed bridges (`2 5`, opacity 0.32) link figures; neighbouring figures share border stars. The sky plate reuses the same line in gold-highlight for the longest streak.

### Action link
Gold-highlight `.a` text plus a path arrow, one per work plate, pinned to the foot. The whole plate is the link: a plain `<img>` inside `<a>` in the README.

### Brand mark (nested)
The official SVGs in `assets/brand/` are copied verbatim from `nayots_branding` and nested inside a plate, with only the root box re-placed. A `viewBox` window may frame the mark's own clear space (at least ½n), but its content is never edited. The opaque-navy particle masters sit in a group with `mix-blend-mode:lighten`, so their navy disappears into the sky with no mask, feather, backing panel or container. The footer uses the flat monogram through a `<picture>` theme swap (not wrapped in a link).

### Motion
- **Ignite**: star slices go from opacity 0.3 to 1, left to right, over 1.6s, `cubic-bezier(.16,1,.3,1)`.
- **Twinkle**: three cadences of 4.6s, 6.9s and 9.3s, down to 0.18 opacity.
- **Pulse**: glints breathe to scale 0.82 and opacity 0.78 over 5.8s.
- **Rise**: text settles 5 units over 1.1s, never from transparent.
- **Draw**: constellation lines (1.1s) and the streak (2.4s) trace in, `cubic-bezier(.65,0,.35,1)`.
- **Ping**: today's ring expands and fades every 3.2s.

Text and stars start from a visible state, so a paused or unstarted animation never hides content. Only lines draw in from nothing; with motion off they render whole. Every plate ends its CSS with `@media (prefers-reduced-motion:reduce){*{animation:none!important}}`.

## Do's and Don'ts

### Do:
- **Do** build every plate through `plate()` in `scripts/lib/sky.mjs` on the 840-unit viewBox, and edit the generators, never the generated SVGs.
- **Do** round only the outer corners of a run (radius 20) and pair seam half-nebulae at the same x across each shared edge.
- **Do** use the three star classes and the 0.306-ratio glint for every point of light.
- **Do** give every plate both a `.w` and a `.n` layout and check it at 360px and 830px, in both GitHub themes, with and without reduced motion.
- **Do** start entrance animations from a visible state and keep the reduced-motion rule last in the plate CSS.
- **Do** nest official marks verbatim and composite particle masters with `mix-blend-mode:lighten`.
- **Do** take palette, marks and brand type from `nayots_branding` (`BRAND.md`, `brand/tokens/tokens.json`).

### Don't:
- **Don't** introduce a colour outside the nayots tokens; vary opacity instead.
- **Don't** mask, feather, recolour, glow, outline, crop into, or put a container behind a brand mark.
- **Don't** set gold on headings, body or decoration; it marks glints, the action and the streak only.
- **Don't** draw icons or arrows as text glyphs; draw them as paths.
- **Don't** let stars land on text or mark ink; route every new text run through its keep-clear box.
- **Don't** break the run with spacing or wrappers between seamed plates, or wrap a `<picture>` in a link.
