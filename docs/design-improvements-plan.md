# Personal Website Design Improvement Plan

## Goal

Improve the personal website design in a deliberate, reviewable way. The site should feel more intentional and personal while staying clean, technical, fast, and easy to maintain.

This branch is a planning branch. It should be used as the shared brief for future coding agents before they make UI changes.

## Current Feedback

### Keep

- The "What I Do" direction from the experimental refresh was promising.
- Numbered capability cards worked well.
- Framed icon containers worked well.
- The site should keep its clean technical portfolio feel.

### Avoid

- Do not make the hero feel like a large card.
- Do not make the homepage profile/about section feel like another boxed content card.
- Do not make every section use the same visual pattern.
- Avoid redesigning everything through shared components before the page-level direction is clear.

## Design Direction

Use a restrained editorial/technical style:

- Open, breathable hero area.
- Strong typography and section rhythm.
- Capability cards with numbered structure and framed icons.
- Fewer heavy shadows and fewer large bordered containers.
- Cards only where they represent actual repeated items.
- Backgrounds and surfaces should support hierarchy, not dominate the page.

## Proposed Page Structure

### 1. Hero

Purpose: quickly explain who Logan is and what kind of work he does.

Direction:

- Use an open layout, not a surrounding hero card.
- Keep the avatar, but avoid enclosing the entire hero in a heavy panel.
- Use a concise headline focused on cloud, DevOps, GitHub, Azure, and .NET.
- Keep contact links visible but quiet.

Acceptance criteria:

- First viewport feels personal and professional.
- Hero does not look like a generic SaaS landing page.
- Hero does not use a large enclosing card.
- Mobile layout remains simple and readable.

### 2. Profile Summary

Purpose: provide a short personal/professional intro without competing with the hero.

Direction:

- Remove the heavy profile card treatment.
- Prefer an unframed or lightly separated text block.
- Keep the text concise on the homepage.
- Link to the About page for the full story.

Acceptance criteria:

- The section feels like a natural continuation of the hero.
- It does not look like a generic card.
- It does not repeat the hero message.

### 3. What I Do

Purpose: show the core capability areas in a memorable way.

Direction:

- Keep the numbered capability card idea.
- Keep framed icon containers.
- Refine spacing, hover states, and mobile layout.
- Make the cards feel intentionally designed, but not overly decorative.

Acceptance criteria:

- This is the strongest visual section on the homepage after the hero.
- Each item is easy to scan.
- Icon containers feel consistent and polished.
- Cards remain usable as links to deeper skill sections.

### 4. Certifications

Purpose: show credibility without overwhelming the homepage.

Direction:

- Use a compact showcase or strip.
- Avoid large equal-weight cards for every certification.
- Keep badges visible but secondary to capability and article content.

Acceptance criteria:

- Certifications are easy to scan.
- The section takes less visual weight than "What I Do".
- Links remain accessible and keyboard-focusable.

### 5. Featured Articles

Purpose: make writing feel like a meaningful part of the portfolio.

Direction:

- Use one featured article plus compact secondary articles.
- Avoid four identical stacked cards.
- Preserve publication date and description for the featured article.

Acceptance criteria:

- The featured article has clear priority.
- Secondary articles are compact and scannable.
- Layout works well on mobile without awkward stacking.

## Shared Component Guidance

Agents should avoid broad component-system rewrites until the homepage direction is validated.

Safe shared updates:

- Add narrowly scoped variants when needed.
- Improve focus states and touch targets.
- Improve semantic heading hierarchy.
- Reduce obvious visual repetition.

Risky shared updates:

- Changing every card style globally before checking all pages.
- Making all sections more decorative.
- Adding heavy background effects to shared layout wrappers.

## Agent Workstreams

### Workstream A: Hero and Profile

Owned files likely include:

- `src/src/pages/HomePage.tsx`
- `src/src/components/HeroSection.tsx`
- `src/src/components/shared/TextSection.tsx`

Task:

- Create an open hero direction.
- Simplify or replace the profile summary treatment.
- Do not touch the "What I Do" implementation except as needed for spacing integration.

### Workstream B: Capabilities Section

Owned files likely include:

- `src/src/components/HomeCapabilitiesSection.tsx` if created
- `src/src/pages/HomePage.tsx`

Task:

- Build/refine the "What I Do" capability cards.
- Preserve numbered cards and framed icon containers.
- Focus on responsive behavior and polish.

### Workstream C: Supporting Sections

Owned files likely include:

- `src/src/components/CertificationShowcase.tsx` if created
- `src/src/components/ArticleListSection.tsx`
- `src/src/components/cards/ArticleListCard.tsx`

Task:

- Make certifications compact.
- Make featured articles hierarchical.
- Avoid introducing another same-card-everywhere pattern.

### Workstream D: Review and QA

Task:

- Review mobile and desktop layouts.
- Check keyboard navigation and focus states.
- Check heading hierarchy.
- Run `npm run lint`, `npm test`, and `npm run build`.
- Note any existing warnings separately from new regressions.

## Branch Strategy

Use this branch as the source of truth for the design plan.

Recommended implementation branches:

- `design/hero-profile-direction`
- `design/home-capabilities-section`
- `design/supporting-sections-refresh`
- `design/homepage-polish-review`

Each implementation branch should reference this plan and keep its file ownership narrow to reduce conflicts between agents.

## Review Checklist

- The homepage no longer feels like a list of identical cards.
- The hero is open and personal, not boxed.
- The profile section is lighter than a card.
- The "What I Do" section keeps the numbered card and framed icon direction.
- Certifications are compact.
- Articles have clear visual hierarchy.
- Mobile layout has no cramped text, overlapping content, or awkward card stacks.
- Interactive elements have visible focus states.
- `npm run lint` passes.
- `npm test` passes.
- `npm run build` passes, with any pre-existing warnings called out.
