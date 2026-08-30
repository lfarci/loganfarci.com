---
name: Field Notes, continuous
description: The implemented editorial-technical system across the public loganfarci.com experience.
status: implemented
colors:
    porcelain: "oklch(99% 0.006 255)"
    midnight: "oklch(13.5% 0.028 264)"
    midnight-ink: "oklch(18% 0.035 264)"
    moonlit-text: "oklch(96.5% 0.01 255)"
    signal-blue: "oklch(56% 0.19 258)"
    luminous-signal-blue: "oklch(72% 0.15 252)"
    signal-mist: "oklch(96% 0.026 255)"
    aurora-teal: "oklch(68% 0.14 188)"
    luminous-aurora-teal: "oklch(77% 0.13 188)"
    copper-spark: "oklch(74% 0.16 72)"
    cool-line: "oklch(86% 0.018 258)"
    night-line: "oklch(34% 0.038 262)"
    white: "oklch(100% 0 0)"
typography:
    display:
        fontFamily: "Manrope Variable, sans-serif"
        fontSize: "clamp(2.75rem, 13vw, 4.25rem)"
        fontWeight: 550
        lineHeight: 0.98
        letterSpacing: "-0.035em"
    body:
        fontFamily: "Noto Sans, sans-serif"
        fontSize: "clamp(1rem, 4.2vw, 1.2rem)"
        lineHeight: 1.6
    label:
        fontFamily: "Reddit Mono, monospace"
        fontSize: "0.75rem"
        letterSpacing: "0.03em"
    wordmark:
        fontFamily: "Manrope Variable, sans-serif"
        fontSize: "1rem"
        fontWeight: 700
        letterSpacing: "0.08em"
rounded:
    control: "0.625rem"
    card: "0.875rem"
    surface: "1.25rem"
spacing:
    xs: "0.5rem"
    sm: "0.75rem"
    md: "1rem"
    lg: "1.25rem"
    xl: "2rem"
    section: "2.5rem"
components:
    homepage-cta-primary:
        backgroundColor: "{colors.signal-blue}"
        textColor: "{colors.white}"
        rounded: "{rounded.control}"
        padding: "0.75rem 1.4rem"
        height: "3.5rem"
    homepage-cta-secondary:
        backgroundColor: "{colors.porcelain}"
        textColor: "{colors.midnight-ink}"
        rounded: "{rounded.control}"
        padding: "0.75rem 1.4rem"
        height: "3.5rem"
    homepage-contact-icon:
        backgroundColor: "{colors.porcelain}"
        textColor: "{colors.midnight-ink}"
        rounded: "{rounded.control}"
        height: "2.75rem"
        width: "2.75rem"
    homepage-proof-link:
        backgroundColor: "{colors.porcelain}"
        textColor: "{colors.midnight-ink}"
        padding: "1.4rem 1.25rem"
---

# Design System: loganfarci.com

## Overview

**Creative North Star: "Field Notes, continuous"**

Field Notes, continuous combines the site's polished technical personality with a
quiet editorial structure. It feels precise, human, and assured: Manrope carries the
proposition, Noto Sans carries the explanation, and Reddit Mono supplies compact
evidence. Hairline rules and generous reading fields create rhythm without simulating
paper, terminal chrome, or a developer dashboard.

Field Notes, continuous is implemented across Home, About, the Articles index, article
detail, the shared navigation and footer, and the 404 surface. The homepage's split
portrait stage is its most expressive composition; the other routes extend the same
type, colour, ruled structure, metadata, and interaction grammar into editorial reading
and evidence surfaces. The finish review disposition was ship with no blockers.

**Key Characteristics:**

- A continuous editorial field structured by rules instead of repeated cards.
- One decisive signal-blue proposition and primary action.
- A real portrait used as the human anchor, with teal technical notation.
- Compact mono metadata that supports rather than competes with the reading voice.
- Responsive composition that changes hierarchy while preserving reading and tab order.

**The Continuous World Rule.** The homepage may have its own full-viewport composition,
but it must remain visibly related to the inner pages through shared type, semantic
colour, control shapes, focus treatment, and editorial restraint.

## Colors

Porcelain and midnight provide calm reading fields; signal blue carries primary intent,
aurora teal marks technical detail, and copper remains a rare supporting spark. The
frontmatter records the core extracted colours; semantic CSS variables in
`src/src/globals.css` remain the runtime source for their light and dark assignments.

### Primary

- **Signal Blue:** The page proposition, primary résumé action, active navigation, and
  strongest navigational signal.
- **Luminous Signal Blue:** The dark-theme counterpart, lifted in lightness so the same
  hierarchy survives on midnight.
- **Signal Mist:** The restrained hover field for large navigational proof links.

### Secondary

- **Aurora Teal:** Portrait notation, trace details, and compact secondary emphasis.
- **Luminous Aurora Teal:** The dark-theme counterpart for the same technical accents.

### Tertiary

- **Copper Spark:** Rare, meaningful highlights only. It remains a supporting semantic
  role rather than a repeated treatment across the implemented surfaces.

### Neutral

- **Porcelain / Midnight:** The light and dark document fields.
- **Midnight Ink / Moonlit Text:** Strong heading and long-form foregrounds.
- **Cool Line / Night Line:** The theme-paired structural rules that define the layout.
- **White:** Primary-action foreground in the light theme.

**The Signal Rarity Rule.** Signal blue identifies the strongest proposition, action,
or location; do not turn it into a broad decorative wash.

## Typography

**Display Font:** Manrope Variable (sans-serif fallback)

**Body Font:** Noto Sans (sans-serif fallback)
**Label/Mono Font:** Reddit Mono (monospace fallback)

**Character:** The three voices separate proposition, explanation, and evidence. The
pairing is modern and technical without becoming sterile or code-themed.

### Hierarchy

- **Display** (550, responsive 2.75–4.25rem before the desktop layout, 0.98): the
  homepage greeting and professional proposition. At the 72rem desktop composition it
  shifts to a separate 4–5.25rem range while keeping the same weight and line-height.
- **Body** (regular, responsive 1–1.2rem, 1.6): the professional role and supporting
  explanation; the desktop implementation raises it to 1.1–1.35rem.
- **Title** (650, 1rem): proof-rail destinations and compact evidence headings.
- **Label** (regular, 0.65–0.82rem, tracked): stack metadata, portrait notation,
  captions, and proof details.
- **Wordmark** (700, 1rem, 0.08em, uppercase): the compact Logan Farci masthead mark.

**The Three Voices Rule.** Manrope proposes, Noto Sans explains, and Reddit Mono
indexes; mono must never become the body voice.

**The Evidence-Only Mono Rule.** Use mono labels and markers when they add factual
orientation—dates, counts, stack details, authorship, or location. Omit them when they
only preface or repeat an already clear heading.

## Layout

The homepage is a full-viewport responsive composition rather than the standard
inner-page container. Below 48rem it flows as introduction, portrait stage, and a
vertical proof rail beneath the shared navigation. The action cluster overlays the
lower-left of the portrait stage, while the portrait crops from the right and a
background-to-transparent veil protects action contrast. From 48rem through 71.999rem,
the same landscape stage gains a taller, deliberately centred portrait and wider
editorial insets instead of prematurely switching to the desktop split.

At 72rem and above, the homepage becomes a 61.5% / 38.5% split. Introduction, actions,
and the three-column proof rail occupy the left field; the portrait fills the right
field below the shared navigation. A single vertical rule offset 4–5.5rem from the left
and a full-width proof boundary make the composition feel like one continuous page. The
left content uses a 7–9rem editorial inset; the portrait caption and high-contrast
vertical `L. FARCI` marker sit inside the image field.

The résumé action remains first in reading and tab order at every width. The mobile
layout changes visual placement through the grid without reordering the document.
Every route uses the implemented full-width Field Notes shell: a sticky opaque
navigation bar, responsive editorial insets, a quiet left rule from 48rem, and generous
section spacing. The compact menu remains active below 72rem so tablet navigation is
consistent with mobile; the horizontal navigation begins at 72rem. About stays
single-column through medium widths before shifting to portrait-plus-narrative and
sticky section labels. The inner-page rule shares Home's exact horizontal position;
About section boundaries and Articles index rows extend from that rule to the right
viewport edge without moving their inset content. Articles keeps each date below its
tags at every width. Article detail uses a broad masthead and
bounded reading surface; the 404 uses the same grid, type, and signal hierarchy. At
every width, inner-page decks remain directly beneath and left-aligned with their titles
as one editorial group. At 72rem, section labels become sticky only where the available
width supports that scan pattern.

## Elevation & Depth

The system is flat by default. Hairline rules, tonal fields, and the portrait gradient
do most of the spatial work. The homepage gives the primary action one compact ambient
shadow and the cutout portrait a larger drop shadow; other links stay flat and express
state through colour, border, or small directional movement. The sticky shared shell
uses the document background and a hairline boundary rather than blur or a raised card
treatment.

### Shadow Vocabulary

- **Primary action:** A compact 0 14px 30px -22px shadow in the current foreground,
  used only to lift the résumé action from the portrait stage.
- **Portrait cutout:** A 0 30px 45px drop shadow mixed from the current foreground at
  28%, preserving depth in both themes.
- **Card / hover / popover / focus:** Existing semantic shadow tokens remain available
  where their component meaning warrants elevation; they are not the homepage's default
  section treatment.

**The Flat-by-Default Rule.** A boundary or interaction must justify elevation; ordinary
sections are separated with space and a one-pixel semantic rule.

## Shapes

Controls use gently rounded corners (`--radius-control`, 0.625rem). Bounded groups keep
the existing card and surface radii (0.875rem and 1.25rem), but the homepage's major
regions are square-edged continuous fields. The portrait clips to its grid area, while
rules—not additional rounding—define the masthead and proof rail. A fully round shape is
reserved for the small blue wordmark dot.

## Components

### Shared site shell — implemented

Home, About, Articles, article detail, and 404 use one sticky opaque header with the
same wordmark, active-link treatment, résumé link, theme control, and accessible compact
menu. The compact menu applies below 72rem; horizontal navigation applies at 72rem and
above. Inner routes add the ruled footer, while Home keeps the opening composition
full-height. Focus-visible states use a two-pixel semantic ring with a four-pixel
offset.

### Calls to action — implemented

- **Primary:** Labelled Download résumé, signal-blue fill, high-contrast foreground,
  control radius, icon plus text, and first position in reading and tab order.
- **Secondary:** Labelled Contact me, document-field fill, etched semantic border, and
  the same height and radius as the primary action.
- **Supplemental contacts:** Four labelled 44px square icon links below the actions.
  They use lighter semantic borders and muted foregrounds so they remain visibly
  secondary to the named actions.
- **Sizing:** Actions are 52px high on the narrow composition and 56px on desktop.
  Reduced-motion preferences remove their transitions.

### Portrait stage — implemented

The real portrait is the sole dominant image. A blue-to-ink gradient creates the field,
a high-contrast semantic backing protects the vertical name marker in both themes, and
a quiet mono caption identifies the current role and company on desktop. The crop moves
from a right-weighted mobile figure through a deliberately centred medium stage to a
full-height desktop portrait without adding a second image or decorative texture.

### Proof rail — implemented

Experience, Articles, and Certifications are three fully linked destinations with a
Manrope title, configurable muted mono detail, and directional arrow. They stack as
92px-minimum rows below 72rem and become a ruled three-column rail with 120px-minimum
cells at the desktop handoff. The desktop cells divide the full left field equally and
begin at the vertical editorial rule rather than crossing it. Within each cell, the
label and detail align left while the arrow holds the right edge. Hover uses signal mist
and nudges only the arrow; focus uses the shared visible ring. Homepage technologies and
proof copy come from `content/data/home.json` rather than component literals.

### About evidence system — implemented

About uses a square, width-capped portrait and a single reading column through medium
widths, then pairs the portrait with the profile narrative at 72rem. Native
details/summary disclosures place organization logos and essential metadata in the
preview, keep the current role, Education, and primary skill group open, tier additional
credentials, expose clear expanded state, and retain full-size keyboard targets. Ruled
section boundaries begin with the shared editorial rule at 48rem; the two-column
sections and sticky labels still begin only at the desktop handoff. Experience and
Education disclosures keep one muted metadata line in their summary and move directly
into body prose when expanded.

### Articles index and reading surface — implemented

The Articles index uses compact ruled rows with title, description, tags, date, and a
directional arrow; the linked title controls the hover affordance. Below 72rem the title
uses the full row width. At every width, the date remains on the lower metadata line
below the tags while the arrow holds the row edge. Article detail
uses a back link, balanced masthead, mono metadata rail, and the established Markdown
renderer for headings, navigation, callouts, tables, inline code, and block code
controls.

### Not-found surface — implemented

The 404 page turns the error code into quiet signal-mist typography, pairs it directly
with plain-language recovery copy, and provides a labelled primary route back home.

## Do's and Don'ts

### Do:

- **Do** use Home, About, Articles, article detail, the shared shell, and 404 together as
  the implemented reference for Field Notes typography, semantic colour, ruled
  structure, control treatment, evidence hierarchy, and reading rhythm.
- **Do** keep the résumé action first and Contact me second in label, reading order, and
  tab order.
- **Do** use the real portrait and real evidence; make priority visible through spacing,
  rules, and writing hierarchy.
- **Do** reserve mono labels and index markers for information that improves orientation;
  remove ornamental prefaces that duplicate the heading beside them.
- **Do** test light and dark themes, keyboard focus, reduced motion, and narrow viewports.

### Don't:

- **Don't** copy the homepage's full-viewport split as a generic template for every
  route; it is one expression of the shared world.
- **Don't** introduce paper texture, scrapbook collage, glowing terminal chrome,
  dashboard framing, a serif masthead, stock imagery, or unverified career claims.
- **Don't** turn every collection into a rounded card or give a non-interactive surface
  hover affordance.
- **Don't** hardcode component colours, hide reading content with overflow, or rely on
  hover for essential meaning.
