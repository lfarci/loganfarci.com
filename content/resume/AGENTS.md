# Resume authoring

This directory contains the curated LaTeX resume. The factual source of truth remains in `content/data/`; resume content may select and concisely rewrite those facts but must not contradict dates, credentials, or skills.

Use `node scripts/build-resume.mjs --output build/resume` to generate and validate the PDF. The generated output is intentionally outside this directory and must not be committed.
