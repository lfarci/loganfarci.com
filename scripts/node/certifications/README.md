# Certification sync tool

Refresh the committed certification data from the public provider pages listed in
[`content/data/certification-sources.json`](../../../content/data/certification-sources.json).

## Run locally

From the application directory:

```bash
npm run sync:certifications
git diff -- ../content/data/certifications.json public/images/certifications
```

The tool rebuilds the complete JSON from the two public profiles. It keeps the existing
`relevance` and `order` for matching credentials; newly discovered credentials default to
`Medium` relevance and are appended after the existing order. Review and commit the generated
JSON and AVIF badge images when the output is correct. It never runs as part of `npm run build`.

## Source configuration

`certification-sources.json` contains two public profile URLs:

- `microsoftLearn` for the Microsoft Learn transcript.
- `credly` for the Credly profile.

The sync tool discovers the individual credentials itself. Updating a profile does not change the
deployed site by itself; run the sync command and commit its generated output to publish changes.

## Modules

- `index.ts` coordinates the rebuild and replaces `certifications.json` only after both profile
  reads succeed.
- `microsoft-learn.ts` and `credly.ts` discover and parse their providers independently.
- `image.ts` downloads and converts badge images to 128×128 AVIF.
- `sources.ts` reads the checked-in source configuration.
- `shared.ts` contains small shared HTTP, metadata, date, and slug helpers.

Profile, metadata, or badge-image failures stop the sync without replacing the existing JSON.
