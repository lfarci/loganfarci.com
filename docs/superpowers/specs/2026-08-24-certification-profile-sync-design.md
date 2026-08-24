# Certification profile sync design

## Goal

Synchronize the site's certification data from one public Microsoft Learn profile
and one public Credly profile. The local tool is explicit: it never runs during a
production build.

## Source configuration

`content/data/certification-sources.json` contains two required strings:

```json
{
  "microsoftLearn": "https://learn.microsoft.com/en-us/users/avanade-logan-farci/transcript/v2zpzc0kelwykj1?tab=credentials-tab",
  "credly": "https://www.credly.com/users/logan-farci"
}
```

Individual credential URLs are discovered by the provider modules and are never
configured manually.

## Synchronization flow

1. The Microsoft Learn and Credly modules independently obtain every public
   credential from their configured profile.
2. They produce normalized credentials with the provider-issued title, issuer,
   issue date, public credential URL, and badge image URL.
3. The sync command reads the existing `content/data/certifications.json` only
   to retain editorial values for matching credentials.
4. It downloads badge images and writes a complete replacement JSON array.
   Credentials no longer present in either profile are removed.

The matching key is the public credential URL, with the title used as a fallback
when a provider changes a credential URL. Matches retain their existing
`relevance` and `order`. New credentials receive `relevance: "Medium"` and
sequential orders after the highest retained order.

## Reliability

Both provider profile reads must succeed before the tool replaces the JSON. A
profile retrieval, metadata, or badge-image failure is reported clearly and
leaves the existing JSON untouched, preventing a partial provider outage from
removing certifications. Existing badge files are retained; new or refreshed
badges are written as 128x128 AVIF files.

## Testing and documentation

Provider fixtures cover profile discovery and normalized credential parsing.
Tests cover complete regeneration, retained editorial values, default values for
new credentials, sequential new ordering, and refusal to write after a provider
failure. The tool README and data contract document the two-string schema and
the explicit local command.
