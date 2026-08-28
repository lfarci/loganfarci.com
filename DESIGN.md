---
name: Field Notes, continuous
description: Approved pre-implementation visual direction for loganfarci.com; preserves the established type, theme, and semantic-token foundation while giving the site an editorial technical rhythm.
status: approved-direction-pending-implementation
---

# Design System: loganfarci.com

> **Direction contract, not current implementation fact.** This records the approved
> visual direction before the revamp. Existing token values and component behavior
> remain canonical in code until implementation changes them; reconcile this document
> with the built system at the end of the work.

## Overview

**Field Notes, continuous** combines the current site’s polished, technical personality
with a quieter editorial structure. It must feel like the same Logan Farci site—more
intentional and easier to scan, rather than a replacement brand.

The experience leads with an unambiguous professional proposition, selected proof, and
two ordered next steps: **Download résumé** first and **Contact me** second. Long-form
evidence follows a field-notes rhythm: compact index markers, thin structural rules,
generous reading space, and small metadata labels. It never becomes a paper-texture,
scrapbook, terminal, or “developer dashboard” aesthetic.

The real portrait is the human anchor. Certification marks and company logos are proof,
not decoration. The interface earns emphasis through hierarchy and restraint rather than
by turning every collection into the same rounded card.

## Colors

Keep the existing semantic palette and both theme modes. Current code defines the
following roles in `src/src/globals.css`; implementations must use semantic tokens, not
raw colour literals in components.

| Role               | Light                               | Dark                                | Directional use                                                         |
| ------------------ | ----------------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| Background         | porcelain (`--color-background`)    | midnight (`--color-background`)     | Calm reading field; never simulated paper.                              |
| Ink                | midnight ink / semantic text tokens | moonlit text / semantic text tokens | Default long-form reading and strong headings.                          |
| Signal blue        | `--color-brand`                     | `--color-brand`                     | Primary action, active location, and the strongest navigational signal. |
| Aurora teal        | `--color-accent`                    | `--color-accent`                    | Trace lines, proof markers, and compact secondary emphasis.             |
| Copper spark       | `--color-highlight`                 | `--color-highlight`                 | Rare, meaningful highlights only; not a repeated decorative gradient.   |
| Rules and surfaces | border and surface tokens           | border and surface tokens           | Separate sections and group evidence without raising every item.        |

Gradients are an existing asset, not the default visual treatment. They may appear in a
single purposeful focal surface, but plain fields and hairline rules should do most of
the structural work.

## Typography

- **Headings:** `Manrope Variable` (`--font-manrope`): concise, decisive, and used for
  hierarchy rather than oversized decorative display type.
- **Reading text:** `Noto Sans` (`--font-noto-sans`): comfortable article and profile
  prose with a deliberate readable measure.
- **Metadata:** `Reddit Mono` (`--font-reddit-mono`): small labels, dates, index markers,
  and short technical proof only. It must not become the body font.

Maintain a clear hierarchy: one page-level proposition, editorial section labels before
supporting headings where helpful, and visibly quieter metadata. Do not introduce a
serif display face or a new font family for this direction.

## Layout

- Preserve the current responsive page container and readable article measure as the
  accessibility baseline; refine rhythm within them rather than widening prose.
- Use an editorial sequence: label or index → heading → selected evidence → optional
  deeper inventory. This sequence is especially important on Home and About.
- Prefer ruled stacks, compact proof rails, and grouped lists for related evidence.
  Use a card only where its boundary communicates grouping or where the whole surface is
  genuinely interactive.
- Desktop may use a restrained side rail or margin metadata where it improves scanning;
  mobile collapses this into the normal document flow without relying on hover.
- The hero places the portrait beside the proposition where space permits and stacks
  predictably on small screens. The résumé action remains first in reading and tab order.

## Elevation & Depth

Existing `--shadow-card`, `--shadow-card-hover`, and `--shadow-popover` tokens remain
available. Use depth sparingly:

- Flat background plus thin rule is the default for editorial sections.
- Raised surfaces indicate a grouped decision, interactive destination, or exceptional
  proof—not every list item.
- Hover elevation must match a real clickable target. A title-only link must not make a
  surrounding non-link card pretend to be clickable.
- Focus is always more prominent than hover and uses the existing semantic ring tokens.

## Shapes

Keep the existing shape vocabulary: `--radius-control` for controls,
`--radius-card` for bounded groups, and `--radius-surface` for rare feature surfaces.
Rules, not additional rounding, provide most of the Field Notes structure. Avoid pills
as a default container; reserve compact rounded tags for real categorical metadata.

## Components

### Navigation and global shell

- Give the current route a visible, semantic active treatment (`aria-current="page"`)
  without obscuring the compact navigation model.
- Keep the mobile menu’s Escape and responsive-close behavior. Every control keeps at
  least the established usable touch target; increase undersized controls where needed.
- The skip link must move fully into the viewport on focus and retain a clearly visible
  focus state in both themes.

### Calls to action

- Primary: a labelled **Download résumé** link to the existing `/resume.pdf` download.
- Secondary: a labelled **Contact me** action that reveals or takes the visitor to
  meaningful contact options; icon-only contacts can remain supplemental, never the
  only way to understand the action.
- Primary and secondary actions use the existing `Button` primitive and semantic colour
  variants. Their order, label, and focus order must agree.

### Proof and collections

- A compact proof rail may summarize Experience, Writing, and Cloud systems on Home.
- About leads with selected experience and a concise narrative; certifications and
  skills are grouped into progressive disclosure or clearly tiered sections.
- Disclosure controls must be labelled, full-size, keyboard operable, and expose their
  expanded state and controlled region.
- Article lists, certifications, and skills distinguish links from static evidence.
  Do not apply a card-hover affordance to a surface whose only interactive child is a
  smaller link.

### Reading surfaces

- Preserve article navigation, headings, callouts, tables, and code controls.
- Inline code must wrap or otherwise remain fully readable at 320–390px without page
  overflow; block code may retain its separately designed scroll behavior.
- Section labels, dates, tags, and table-of-contents metadata use the quieter Field
  Notes treatment without reducing contrast or discoverability.

## Do's and Don'ts

**Do** preserve Manrope, Noto Sans, Reddit Mono, porcelain/midnight themes, and the
signal-blue / teal / copper semantic roles. Use real portrait and evidence imagery.
Make priority visible through spacing, rules, and writing hierarchy. Test every visual
decision in light and dark themes, keyboard navigation, reduced motion, and narrow
viewports.

**Don't** introduce a second visual world (paper texture, scrapbook collage, glowing
terminal, dashboard chrome, or serif editorial masthead). Don't add unverified career
claims, stock imagery, or new external dependencies. Don't substitute decorative motion
or generic card grids for information architecture. Don't hardcode colours in component
classes or hide overflow that conceals reading content.
