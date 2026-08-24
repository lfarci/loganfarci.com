# Certification sync tool

Refresh the committed certification data from the public provider pages listed in
[`content/data/certification-sources.json`](../../../content/data/certification-sources.json).

## Run locally

From the application directory:

```bash
npm run sync:certifications
git diff -- ../content/data/certifications.json public/images/certifications
```

The tool only appends newly discovered credentials. Review and commit the generated JSON and
AVIF badge images when the output is correct. It never runs as part of `npm run build`.

## Source configuration

`certification-sources.json` contains arrays of public, individual credential-page URLs:

- `microsoftLearn` for Microsoft Learn credentials.
- `credly` for Credly badges.

Adding a source URL does not change the deployed site by itself. Run the sync command and
commit its generated output to publish a credential.

## Modules

- `index.ts` coordinates the sync and updates `certifications.json`.
- `microsoft-learn.ts` and `credly.ts` parse their providers independently.
- `image.ts` downloads and converts badge images to 128×128 AVIF.
- `sources.ts` reads the checked-in source configuration.
- `shared.ts` contains small shared HTTP, metadata, date, and slug helpers.

Network and metadata failures are reported as warnings and do not alter existing
certifications.
