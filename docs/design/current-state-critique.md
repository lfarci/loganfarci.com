# Current-State Design Critique

Date: 2026-08-27
Status: critique-ready
Method: dual-agent (A: `critique_design_review` · B: `critique_detector_evidence`)

## Scope and evidence

This critique covers the rendered current site without changing UI or content source
files. The review inspected:

- `/`
- `/about`
- `/articles`
- `/articles/github-copilot-customizations`
- `/missing-route` as the client-side 404 state

Each surface was reviewed in light and dark themes at representative mobile, tablet,
and desktop widths. The browser pass also exercised keyboard focus, the mobile menu,
theme switching, reduced motion, experience disclosure, article navigation, runtime
errors, overflow, and obvious contrast issues.

Temporary evidence included 30 full-page screenshots, interaction screenshots, DOM
measurements, 20 axe scans, and Impeccable detector output. Screenshots and browser
artifacts were kept outside version control.

## Executive verdict

The site is coherent, credible, readable, and accessibility-minded. Its real content
creates trust, and its article-reading experience is a strong foundation. It does not
yet feel authored enough to be memorable.

The dominant visual recipe—portrait hero, neutral shell, low-saturation blue cards,
badges, and evenly spaced vertical sections—could be reused for many developer
portfolios. Logan's experience and writing are specific; the interface containing them
is comparatively generic. The largest opportunity is sharper editorial hierarchy:
state Logan's value and preferred next step with confidence, prioritize proof instead
of displaying all proof equally, and establish one recognizably technical visual
grammar across imagery, typography, color, and interaction.

## Design health score

This is a public portfolio and reading surface. Error prevention, expert accelerators,
and help/documentation are not meaningful measures for the reviewed experience.

| # | Nielsen heuristic | Score | Key issue |
| --- | --- | ---: | --- |
| 1 | Visibility of system status | 2/4 | No active-route treatment; the focused skip link remains off-screen. |
| 2 | Match between system and real world | 3/4 | Language is clear, but “Azure Associate Developer” may read as a certification rather than a role. |
| 3 | User control and freedom | 3/4 | Navigation is direct; Escape closes the mobile menu and the 404 provides recovery. |
| 4 | Consistency and standards | 3/4 | Layout and tokens are consistent, but the imagery, badges, emoji, and flat UI speak different visual dialects. |
| 5 | Error prevention | n/a | The reviewed experience has no consequential input flow. |
| 6 | Recognition rather than recall | 3/4 | Text navigation and article TOC are strong; touch contact actions are icon-only and card hit areas are ambiguous. |
| 7 | Flexibility and efficiency | n/a | Accelerators are not material to a portfolio/reading surface. |
| 8 | Aesthetic and minimalist design | 2/4 | Repeated cards and the unprioritized About inventory create a high visual noise floor. |
| 9 | Error recognition and recovery | 3/4 | The 404 is clear and actionable, though it offers only Home as recovery. |
| 10 | Help and documentation | n/a | Interface help is not needed for this public content surface. |
| **Total** |  | **19/28 (68%)** | **Acceptable; a sound foundation requiring significant hierarchy and responsive refinement.** |

## Design specificity verdict

### Independent design assessment

The site is coherent but category-interchangeable. The portrait, credentials, and
article subjects make the content unmistakably Logan's. The composition itself is a
conventional developer-portfolio system: centered max-width shell, two-column hero,
repeated tinted cards, quiet borders, and blue as the expected technology accent.

The implementation defines more expressive brand, teal, copper, gradient, and
elevation tokens, but the reviewed surfaces use the pale elevated-card treatment so
consistently that those authored ingredients rarely become part of the visitor's
memory. Glossy interest artwork, a platform-rendered emoji, third-party certification
marks, and restrained flat UI do not yet form one visual language.

### Deterministic and browser evidence

The CLI detector reported one warning in
`src/src/components/shared/MarkdownContent.test.tsx:197`. It is a confirmed false
positive: the `border-l-4` string appears in a negative regression assertion and is not
rendered production markup.

Live detector injection succeeded on all five routes and produced 156 entries,
including five route banners. Most repeated labels concerned the uniform card
border/shadow treatment and dense line lengths on About. Those signals corroborate the
visual review's hierarchy and density concerns, but they are design heuristics rather
than 151 functional defects. Repeated descendant-level overflow labels on About are
also not page-overflow bugs; independent viewport measurement found no horizontal page
overflow there.

There is no persistent user-visible overlay. The evidence ran in fresh headless browser
pages, was captured, and was closed.

## Overall impression

The opening is warm and trustworthy, the navigation is admirably small, and technical
articles are handled with care. The site loses energy once it begins repeating equally
weighted cards. Its single biggest opportunity is to turn a comprehensive inventory
into an edited professional story: one proposition, selected proof, and an obvious next
step.

## What is working

### Human, credible first contact

- **Surface:** Home hero in both themes and all widths.
- **Evidence:** A real portrait, first-person greeting, concise role line, and direct
  contact destinations appear immediately; mobile stacking and desktop balance hold.
- **Impact:** Visitors meet a person before a credential database, supporting the
  intended close and friendly professional identity.
- **Priority:** Preserve.
- **Disposition:** `preserve`.

### Strong article-reading scaffolding

- **Surface:** `/articles/github-copilot-customizations`.
- **Evidence:** Clear title, metadata, AI disclosure, descriptive deck, logical heading
  outline, in-page TOC, sticky desktop navigation, mobile Back to Top control, callouts,
  tables, diagrams, and named Copy controls.
- **Impact:** Long technical material remains navigable and demonstrates care for both
  expert readers and accessibility.
- **Priority:** Preserve after repairing inline-code wrapping.
- **Disposition:** `preserve`.

### Dependable theme and navigation foundations

- **Surface:** Global shell and 404.
- **Evidence:** Both themes render coherently across the full matrix; no console,
  runtime, request, or hydration errors occurred; mobile Escape behavior works;
  reduced motion is honored; the 404 is understandable and recoverable.
- **Impact:** A revamp can build on sound behavior rather than replace the shell's
  fundamentals.
- **Priority:** Preserve.
- **Disposition:** `preserve`.

## Priority findings

### 1. The first viewport identifies Logan but does not sell a differentiated proposition

- **Surface:** Home hero and first viewport.
- **Evidence:** **Design judgment.** “Azure Associate Developer delivering cloud-native
  solutions that scale” is the only value line. The four next actions are icon-only
  contact destinations; no primary action prioritizes work, résumé, or conversation.
- **Impact:** A hiring manager can identify Logan but must infer seniority,
  differentiating value, and the preferred next step. The highest-value conversion
  moment is under-directed.
- **Priority:** P1.
- **Disposition:** `reconsider`.
- **Direction:** Rebuild the hierarchy—not unapproved factual claims—around one sharp
  professional thesis, one proof signal, and one primary action. Keep contact channels
  secondary.

### 2. Two verified accessibility/responsive defects weaken otherwise strong foundations

- **Surface:** Global skip link and the representative article at mobile widths.
- **Evidence:** **Verified defects.** After the first Tab, `Skip to content` receives
  focus and a focus ring but remains at `y = -64`, outside the viewport. Activation
  still focuses `main`. At 375–390px, the article document measures 433px wide and long
  inline-code paths reach roughly 409px inside a 335px parent; global
  `overflow-x: clip` hides the excess.
- **Impact:** Keyboard users cannot see the first focused control, and mobile readers
  lose parts of code paths that are essential to the article.
- **Priority:** P1.
- **Disposition:** `replace`.
- **Direction:** Repair the skip-link reveal contract and give inline code safe
  wrap/overflow behavior independently of scrollable block code. Recheck at 320–390px,
  keyboard-only, and browser zoom.

### 3. About turns impressive breadth into an undifferentiated inventory

- **Surface:** `/about`, most severe at mobile width.
- **Evidence:** **Design judgment corroborated by measurement.** The 390px page is about
  10,492px tall and presents five experiences, education, fifteen certification links,
  six skill categories, and dozens of badges. Most evidence uses the same card surface
  and visual weight. Detector density and line-length labels concentrate on this route.
- **Impact:** Hiring readers must perform the prioritization themselves; peers cannot
  quickly distinguish depth from breadth; impressive proof becomes exhausting.
- **Priority:** P1.
- **Disposition:** `reconsider`.
- **Direction:** Establish editorial tiers: lead with a concise narrative and selected
  proof, group or progressively disclose long-tail credentials, and connect skills to
  evidence rather than presenting a tag census.

### 4. Interaction affordances are visually and physically inconsistent

- **Surface:** Global navigation, article cards, About disclosure, and mobile hero
  contacts.
- **Evidence:** **Verified behavior.** No route exposes `aria-current` or a visible
  active state. Article cards lift as whole surfaces while only the title is linked.
  Mobile menu control measures 36×36px, hero contact links about 32–41×32px, and six
  About “Show more” controls 20×20px. Disclosure labels change, but the controls expose
  no `aria-expanded` or controlled-region relationship.
- **Impact:** Users receive conflicting signals about what is clickable, where they
  are, and how to reveal more. Keyboard behavior is generally sound, but touch and
  visual discoverability lag behind it.
- **Priority:** P2.
- **Disposition:** `replace`.
- **Direction:** Make interactive surfaces and hit areas honest, add an active-route
  treatment, give disclosure controls full-size labeled targets with state semantics,
  and expose contact meaning without hover dependence.

### 5. The visual system is consistent but not singular

- **Surface:** Home interest/certification grids and repeated cards site-wide.
- **Evidence:** **Design judgment corroborated by detector repetition.** A platform
  emoji, glossy 3D interest images, third-party badge logos, and restrained flat UI
  coexist. Most sections use the same pale-blue/night-blue rounded card regardless of
  meaning; expressive teal, copper, gradient, and elevation tokens do little structural
  work. The detector repeatedly flagged the same hairline-border/wide-shadow recipe.
- **Impact:** The interface reads as polished template work around highly specific
  content. Memorability and the intended enterprise-credible technical identity remain
  weaker than the underlying work.
- **Priority:** P2.
- **Disposition:** `replace`.
- **Direction:** Choose one authored technical motif and a stricter surface hierarchy.
  Use accent colors to encode structure or emphasis, not to decorate every element,
  and either integrate the 3D imagery into that system or retire it.

## Cognitive load

Overall cognitive load is **moderate**, with three checklist failures:

- **Pass — single focus:** each route has a legible main purpose.
- **Fail — chunking:** certifications and skill inventories lack priority, summary, or
  staged disclosure.
- **Pass — grouping:** sections, borders, headings, and proximity group related content.
- **Fail — visual hierarchy:** repeated cards give credentials, interests, skills, and
  articles too-similar weight.
- **Pass — one thing at a time:** routes remain linear and avoid simultaneous tasks.
- **Pass with pressure — minimal choices:** global navigation stays at four choices,
  while About and Articles expose many equal peers.
- **Pass — working memory:** navigation, labels, and article TOC keep context visible.
- **Fail — progressive disclosure:** experience prose collapses, but the denser
  certification and skill inventories do not.

## Emotional journey

The opening peak is strong: a direct greeting and genuine portrait create warmth
quickly. Home then loses energy as similarly weighted card grids repeat. About is the
deepest valley: achievement becomes inventory, and impressive breadth feels
bureaucratic because nothing is allowed to lead. The article route recovers confidence
through clear reading structure and concrete technical detail.

The end state is weak across Home, About, and the article: content stops and collapses
into a tiny copyright footer without a final invitation to read next, view the résumé,
or contact Logan. The 404 is the exception; it closes its error moment with reassurance
and a clear exit.

## Persona red flags

### Jordan — first-time hiring reader

“Azure Associate Developer” may read like a certification rather than a professional
role. The preferred action is not named, contact meaning depends on icon recognition,
and article cards suggest full-card clickability that is not present. Jordan can
navigate, but must guess which evidence matters and what Logan wants them to do next.

### Sam — keyboard and low-vision reader

The skip link works functionally but remains visually off-screen when focused. Compact
standalone controls reduce motor accessibility, while disclosure state is not expressed
with `aria-expanded`. Strong headings, labels, theme support, reduced motion, and zero
axe violations provide a solid base, but they do not cancel these verified gaps.

### Casey — distracted mobile reader

Navigation opens and dismisses reliably, but the portrait delays proof, About extends
beyond 10,000px, experience disclosure uses 20px chevrons, and contact destinations
have no touch-visible labels. Casey is likely to skim past the strongest qualifications
or abandon before reaching them.

## Secondary observations

- The 404 is clear, but Home is its only recovery route; Articles or contact may be
  equally plausible destinations.
- The Résumé item downloads a PDF without a visible file/download cue.
- Article tags are static badges whose chip styling may imply filtering.
- Repeated section-chevron links create a directory feel where editorial links and one
  dominant action would feel more deliberate.
- The footer is so quiet that every successful route ends abruptly.
- Dark mode currently expresses more depth and personality than light mode; a future
  direction should not make light mode merely the pale inverse.

## Evidence boundaries

- Axe reported zero violations across 20 mobile/desktop theme-route cases. Its manual
  contrast and ARIA review items were not promoted to failures without reproduction.
- No obvious illegible text/background pair appeared in the rendered inspection, but
  that is not a full manual WCAG contrast audit.
- No page-wide overflow occurred outside the representative article's verified mobile
  inline-code case.
- Detector card, line-length, and layout-animation labels are design/performance prompts,
  not automatically functional or accessibility defects.

## Questions for the direction workshop

1. If a hiring manager gives the first viewport five seconds, what single sentence and
   single action should remain?
2. Which three credentials or pieces of work prove Logan's advantage, and what improves
   if everything else becomes supporting evidence?
3. What visual motif could belong specifically to a Belgian cloud/software engineer
   working across enterprise systems rather than to “a developer portfolio” as a
   category?
4. Should the site end with a copyright line or an invitation into the next professional
   relationship?

## Approved direction inputs

Logan answered the critique follow-up on 2026-08-27. Use these decisions as the brief
for the visual-direction workshop:

- **Priority:** Address professional proposition and hierarchy together with the
  verified accessibility and responsive defects.
- **Tone:** Warm, human, and technical.
- **Scope:** Address all five priority findings in the eventual revamp plan.

These decisions authorize the direction workshop only. They do not select a visual
direction or authorize UI implementation. The next gate is to present three distinct
directions for Logan to choose or revise.
