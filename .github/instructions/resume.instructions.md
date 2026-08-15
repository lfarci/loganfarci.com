---
applyTo: "content/resume/**/*,scripts/build-resume.mjs,scripts/validate-resume.mjs,.github/workflows/build-resume.yml"
---

# Resume instructions

- Treat `content/data/` as the factual/master source of truth for employment dates, education, certifications, and skills.
- `content/resume/` is a curated CV: it may select, prioritize, and concisely rewrite facts, but must not introduce contradictory dates or credentials.
- Build with the documented non-interactive Node.js/Tectonic command; never commit generated PDFs or build output.
- Keep the LaTeX output ATS-readable: real text, standard section headings, conventional dates, and no text embedded in images.
