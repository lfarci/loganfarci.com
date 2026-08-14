# Screen-reader validation

Use this procedure after a material change to page structure, navigation, focus management, labels, or article rendering. It complements the automated axe scan; it does not replace it.

## Automated axe check

Build the site, start the Azure Static Web Apps emulator, then run the existing Chromium Playwright suite:

```sh
cd src
npm run build
npm run preview:swa
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4280 npm run test:e2e
```

The suite audits `/`, `/about`, `/articles`, and the first published article after each page is visible. It fails only for axe violations with a `serious` or `critical` impact. The same suite runs against active pull-request previews; see [testing.md](./specs/testing.md#browser-acceptance-suite).

## Manual screen-reader script

Test with the current stable **NVDA and Firefox on Windows**. Use a clean browser profile at 100% zoom, then record the exact NVDA, Firefox, and Windows versions in the result template. This environment is intentionally not automated: a result is valid only when a person has performed the script.

| Flow            | Steps                                                                                                                                                                      | Expected result                                                                                                                                                                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home            | Open `/`, use landmark and heading navigation, then tab from the browser chrome through the primary navigation and contact links.                                          | Header, navigation, main, and footer landmarks are announced; the `Hi, I'm Logan` h1 and section headings are discoverable; the first page focus is `Skip to content`; navigation, theme, and contact controls have clear names.                       |
| About           | Open `/about`, use landmark and heading navigation, then tab through the profile sections and portrait.                                                                    | The `About Me` h1 and Experience, Education, Certifications, and Skills sections are announced in reading order; the portrait announces its descriptive alt text; focus does not skip or trap controls.                                                |
| Article reading | From `/articles`, open the first article. Use heading navigation, the `In this article` navigation landmark, and tab through the table of contents and `Back to top` link. | The article h1, main/article content, and heading hierarchy are discoverable; table-of-contents links announce their section names and move to the matching heading; `Back to top` returns focus to main content; links and controls have clear names. |

Stop and record a failure if landmarks or headings are missing or misordered, focus order differs from reading order, focus is trapped, or an interactive control lacks a useful accessible name.

## Result template

Copy this template into the pull request or issue that prompted the validation:

```text
Date:
Commit or PR:
Tester:
Operating system and version:
Screen reader and version:
Browser and version:
Zoom and browser-profile state:

Home: pass | fail — notes
About: pass | fail — notes
Article reading: pass | fail — notes

Follow-up issues:
```
