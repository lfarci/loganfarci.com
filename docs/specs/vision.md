---
spec: vision
version: 0.1.0
status: vision
---

# Vision

[Back to the specs index.](./README.md)

The north star for **loganfarci.com**. Where [architecture.md](./architecture.md)
describes what exists today, this spec describes what the site is meant to become and
the principles that guide every change. The site is a **work in progress** — treat
the "Planned" items as direction, not as existing features.

Agents should use this spec to judge whether a proposed change moves the site toward
the vision, and to avoid proposals that contradict the core principles.

## Purpose

loganfarci.com is Logan's **professional point of exposure** — a place for people to
find him, understand what he does, and get in touch. It exists to:

- Present his **experience, interests, projects, and related resources** clearly.
- **Impress potential employers and businesses** who look him up, and help them quickly
  grasp his skills and the value he brings.
- Publish **technical articles** that are well referenced and discoverable, so other
  developers who share his interests can find them and reach out.

This is a **career-focused** site, not a personal-life blog. It stays **professional,
clear, and technical, with a light touch of personality** — competence first, character
second. Content that does not serve Logan's professional presence is out of scope (see
[non-goals.md](./non-goals.md)).

## Audience

The site serves a range of technical and business readers, and should work for all of
them at once:

- **Peers and fellow developers** — evaluating his work, reading articles, and possibly
  reaching out to collaborate or connect.
- **Senior engineers and technical leads** — assessing depth, judgment, and the quality
  of his thinking.
- **Hiring managers and businesses** — deciding quickly whether Logan is a strong fit,
  often from a first look.

Design and content choices SHOULD keep all three in mind: skimmable and credible for a
hiring manager in a hurry, and substantive and precise for a technical reader going
deep. Every page SHOULD make it easy to understand what Logan does and how to contact
him.

## Core principles

1. **Simplicity first.** The simplest solution that meets the need wins. Favor less
   code, fewer moving parts, and less configuration. If a feature adds significant
   complexity for marginal value, it does not belong here.
2. **Do not reinvent the wheel.** Prefer well-established libraries, platform
   features, and standards over bespoke implementations. Reuse the existing Radix
   primitives, Tailwind tokens, and utilities before adding anything new.
3. **Static-first.** The site stays a statically prerendered SPA on Azure Static Web
   Apps (see [non-goals.md](./non-goals.md)). New capabilities should fit that model.
4. **Content is the product.** The site exists to present Logan's writing, profile,
   and work clearly. Design and tech serve the content, not the other way around.
5. **AI-assisted, human-guaranteed.** The site and its content are built with AI
   assistance, and that is stated openly. AI is a tool, not an excuse: Logan directs
   the work, understands every part of it, and personally stands behind its quality.
   The bar is the same as fully hand-made work — irreproachable.

## AI transparency and quality

Logan uses AI to build this site and write content, and the site is **transparent**
about it. This is a deliberate professional statement, not a disclaimer to hide.

- **Be open about AI use.** Where AI materially contributed, say so — for example the
  `coauthoredWithAgent` article flag (see
  [content-style-guide.md](./content-style-guide.md)). Do not overstate or hide it.
- **Quality is non-negotiable.** Everything published MUST be accurate, correct, and
  reviewed by Logan. AI assistance never lowers the bar; anything shipped is work Logan
  vouches for.
- **Demonstrate judgment, not just output.** The takeaway for a hiring manager should be
  that Logan uses modern AI tooling effectively *and* knows exactly what he is doing —
  competence and control, with AI as a force multiplier.
- **No AI slop.** Generic, padded, unverified, or hallucinated content MUST NOT ship.
  Technical claims and code MUST be verified (ties to the article hard rules in
  [content-style-guide.md](./content-style-guide.md) and the bars in
  [quality-bars.md](./quality-bars.md)).

## What the site should become

A modern, fast, accessible personal site that is the central entrypoint to Logan's
online presence: profile, resume, articles, and projects, discoverable by both humans
and machines.

### Planned sections and features

- **Resume / CV.** A resume hosted on the site, viewable in the browser and available
  as a downloadable file (e.g. PDF). It should reuse the existing experience,
  education, certification, and skills data (see [data-contracts.md](./data-contracts.md))
  rather than duplicating it.
- **Projects.** A dedicated projects section showcasing selected work, each with a
  short summary, tech used, and links (repo, live demo, article). Modeled as typed
  data in `content/data/` mirroring the existing content pipeline.
- **Themes.** A light/dark theme toggle **already ships** (`ThemeContext` +
  `ThemeToggle`, Tailwind `darkMode: "class"`), built on the semantic tokens (no second
  styling system). Planned refinement: also honor `prefers-color-scheme` on first visit
  and keep contrast compliant in both themes — see
  [accessibility.md](./accessibility.md#themes-and-contrast).
- **Internationalization.** Available in **English** (international, `en_US`), **French**,
  and **Dutch** (both for a Belgian audience, `fr_BE` / `nl_BE`) for now, with room to add
  more. Keep it simple: content and UI strings should be translatable
  without a heavy i18n framework, and prerendering must still produce static pages per
  locale. Full plan in [i18n.md](./i18n.md).

## Accessibility ambitions

Accessibility is a first-class goal, not an afterthought. The enforced bar is
[quality-bars.md](./quality-bars.md) and the full contract plus ideal state is
[accessibility.md](./accessibility.md). In short, the site should keep improving toward:

- **Screen-reader / blind users.** Correct semantics, landmarks, focus order, ARIA
  where needed, and meaningful alt text everywhere. Test key flows with a screen
  reader.
- **Languages.** Content available in more than one language ([i18n.md](./i18n.md)),
  with correct `lang` attributes per page.
- **Themes.** Respect `prefers-color-scheme` and offer a manual toggle; ensure
  contrast holds in every theme.
- **LLMs / machine readers.** Keep the site machine-friendly. The prerender step
  already emits `llms.txt`, `llms-full.txt`, `sitemap.xml`, and `robots.txt`, plus
  JSON-LD structured data. New sections (resume, projects) should extend these so AI
  assistants and crawlers get clean, structured context.

## SEO and discoverability

Referencing is key: the site should be well indexed and rank well where possible.

- Every page ships a title, meta description, canonical URL, Open Graph tags, and
  appropriate JSON-LD (Person, WebSite, Article, BreadcrumbList today — extend to
  resume and projects).
- Keep `sitemap.xml`, `robots.txt`, `llms.txt`, and `llms-full.txt` complete and
  current as sections are added.
- Prefer semantic HTML and fast static delivery, which both help ranking.

## Design and usability

- **Modern and clean.** A contemporary look that keeps the focus on content.
- **Responsive by default.** Best-in-class experience on phones, tablets, and
  desktops. Layout and interactions must be usable at every breakpoint.
- **Usability over decoration.** Prioritize clarity, readable typography, and obvious
  navigation over visual flourish.

## Success criteria

Concrete, checkable signals that the vision is being met. Agents can treat these as
measurable targets (aspirational where a planned section does not exist yet):

- Core routes score **100 on Lighthouse Accessibility** and pass automated axe checks.
- **Every page** ships a title, meta description, canonical URL, Open Graph tags, and
  valid JSON-LD (validates in Google's Rich Results test).
- `sitemap.xml`, `robots.txt`, `llms.txt`, and `llms-full.txt` list **every** shipped
  route with no stale or missing entries.
- The site is **fully usable with the keyboard alone** and with a screen reader on the
  home, about, and article-reading flows.
- Layout holds with **no horizontal scroll or overlap** from 320px up to wide desktop.
- The resume is **viewable in the browser and downloadable as a PDF**, generated from
  the existing profile/experience/education data (no duplicated source of truth).
- Each project in the projects section has a summary, tech list, and at least one link
  (repo, demo, or article).
- A reader who lands on an article can tell **who wrote it** and reach a clear **way to
  get in touch** without leaving the site's flow.
- A first-time visitor can answer "**what does Logan do, and how do I contact him?**"
  within seconds of landing on the home page.
- The site is **openly transparent about AI use**, while every published page and
  article meets the quality bar and is work Logan personally stands behind.

## Target sitemap

Current routes are in [architecture.md](./architecture.md). The target structure,
including planned sections:

```
/                     Home: intro, featured articles, highlights, contact
/about                Profile: experience, education, certifications, skills
/resume               Resume/CV: browsable, with downloadable file (planned)
/projects             Projects index (planned)
/projects/:slug       Individual project detail (planned)
/articles             Articles index
/articles/:slug       Individual article
/404                  Not found

Machine-readable (generated at build):
/sitemap.xml  /robots.txt  /llms.txt  /llms-full.txt
```

Notes:
- Keep the URL structure flat and predictable; slugs are kebab-case.
- If internationalization lands, prefer a simple, conventional locale scheme and keep
  every locale statically prerendered.
- Add new sections to the sitemap, `llms.txt`, and JSON-LD when they ship so content
  stays clear and discoverable.
