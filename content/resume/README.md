# ATS resume

The resume is an ATS-friendly, one-page LaTeX document built from the canonical JSON records in `content/data/` and curated wording in `sections/`.

## Local build

Prerequisites: Node.js 20+, [Tectonic](https://tectonic-typesetting.github.io/), and `pdftotext` (Poppler). From the repository root, run:

```bash
node scripts/build-resume.mjs --output build/resume
```

The command creates `build/resume/resume.pdf`, validates that it has selectable text, and checks required headings, dates, and keywords. It is non-interactive and reproducible from a clean checkout. No PDF is stored under `content/resume/`.

## CI artifact

`.github/workflows/build-resume.yml` runs the same command on pushes and pull requests affecting resume inputs, caches Tectonic's bundle, and uploads `resume-pdf` containing `resume.pdf`. Validation runs before upload, so a failed build or invalid PDF cannot produce a success artifact.

A consumer workflow can download the named artifact with `actions/download-artifact`:

```yaml
- uses: actions/download-artifact@v6
  with:
      name: resume-pdf
      path: public
```

The website does not publish this artifact yet; that integration is tracked separately in #421.
