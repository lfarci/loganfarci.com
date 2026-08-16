# ATS resume

The resume is an ATS-friendly, one-page LaTeX document built from the canonical JSON records in `content/data/` and curated wording in `sections/`.

## CI build

`.github/workflows/build-resume.yml` is the canonical build path. It runs on pushes and pull requests affecting resume inputs, validates the PDF, and uploads the `resume-pdf` artifact containing `resume.pdf` and `resume-preview.png`. The preview is a 150 DPI first-page PNG for layout review. Validation runs before upload, so a failed build or invalid PDF cannot produce an artifact.

## Optional local build

For local iteration, install Node.js 20+, [Tectonic](https://tectonic-typesetting.github.io/), and Poppler's `pdftotext`, `pdfinfo`, and `pdftoppm` commands on your `PATH`. From the repository root, run:

```bash
node scripts/build-resume.mjs --output build/resume
```

The command creates `build/resume/resume.pdf` and a 150 DPI first-page preview at `build/resume/resume-preview.png`. It validates that the PDF has selectable text, is one page, and contains required headings, dates, and keywords. Review the PNG after layout changes before sharing the PDF. The command is non-interactive and reproducible from a clean checkout. No PDF is stored under `content/resume/`.

A consumer workflow can download the named artifact with `actions/download-artifact`:

```yaml
- uses: actions/download-artifact@v6
  with:
      name: resume-pdf
      path: public
```

The website does not publish this artifact yet; that integration is tracked separately in #421.
