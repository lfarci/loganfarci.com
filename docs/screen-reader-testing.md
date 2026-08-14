# Screen-reader validation

This repeatable manual check complements the automated axe checks in the Playwright
acceptance suite. Run it after material changes to navigation, headings, content
structure, focus handling, or accessible names.

## Test setup

Use a deployed preview or the local SWA emulator so each route is served from the
prerendered output. Test with NVDA and Firefox on Windows. Record the exact operating
system, NVDA version, and Firefox version in the result template below; this makes the
same combination available for later regression checks.

Start on each route with browser zoom at 100%, then use normal reading commands and
the keyboard only. Do not rely on visual cues to complete a step.

## Script

### Home (`/`)

1. Use landmark navigation to find the banner, primary navigation, main content, and
   content information landmarks.
2. Use heading navigation to confirm the page starts with its single level-one heading
   and that the discovery-section headings are announced in reading order.
3. Tab from the start of the page: confirm “Skip to content” is first, moves focus to
   main content when activated, and each navigation, contact, and article link exposes
   its intended accessible name.
4. Open a featured article and confirm its title is announced as the destination's
   level-one heading.

### About (`/about`)

1. Confirm landmark navigation exposes the same page structure and the main landmark
   begins at the “About Me” level-one heading.
2. Navigate by headings through Experience, Education, Certifications, and Skills in
   reading order.
3. Read the portrait and verify its alternative text identifies the author.
4. Tab through the navigation and in-page links; confirm focus order follows the
   rendered content and every control announces an actionable name.

### Article reading (`/articles` and one article)

1. From the articles listing, use headings and links to choose an article, then confirm
   the article title is the single level-one heading on its page.
2. Use landmark navigation to reach main content and the named “In this article”
   navigation landmark.
3. Use heading navigation to read the article outline in order, including sections
   reached from the table of contents.
4. Tab through the table-of-contents links and any article controls; confirm their names
   and focus order match the spoken reading order.

## Result template

Copy this block into the pull request or issue that triggered the validation:

```text
Date:
Commit / preview URL:
Tester:
Operating system and version:
Screen reader and version:
Browser and version:
Flows: home / about / article
Result: pass | fail
Findings and affected route:
Follow-up issue or pull request:
```

A pass means every script step completes with the expected landmarks, heading order,
focus order, and accessible names. Record a failure with the route and exact step so it
can be reproduced without repeating the whole pass.
