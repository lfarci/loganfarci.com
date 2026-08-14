---
spec: data-contracts
version: 0.1.0
status: current-state
---

# Data Contracts

[Back to the specs index.](./README.md)

Every file in `content/data/` is imported and cast to a type in `src/src/types/` by
[`src/src/core/data.ts`](../../src/src/core/data.ts). The TypeScript types are the
authoritative contract; this spec summarizes them for quick reference. When a shape
changes, update **both** the JSON and the type.

Calendar dates are modeled as `ISODateString` ([`date.ts`](../../src/src/types/date.ts)),
a branded `string` with a `YYYY-MM-DD` shape that matches the runtime value Vite imports
from JSON. They are never typed as `Date`; consumers parse them with `new Date(...)` when
needed.

## Shared: `Image`

Used by many contracts. All fields required
([`image.ts`](../../src/src/types/image.ts)):

| Field | Type | Notes |
| --- | --- | --- |
| `src` | string | Path under `src/public/` (e.g. `/images/...`). Prefer `.avif`. |
| `alt` | string | Required, descriptive (accessibility). |
| `width` | number | Intrinsic width, avoids layout shift. |
| `height` | number | Intrinsic height. |

## Files → types

| File | Loader | Type | Shape |
| --- | --- | --- | --- |
| `certifications.json` | `getCertifications()` | `Certification[]` | array |
| `experiences.json` | `getExperiences()` | `Experience[]` | array |
| `skills.json` | `getSkillCategories()` | `SkillCategory[]` | array |
| `icons.json` | `getIcons()` | `Icon[]` | array |
| `interests.json` | `getInterests()` | `Interest[]` | array |
| `contacts.json` | `getContacts()` | `Contact[]` | array |
| `profile.json` | `getProfile()` | `Profile` | single object |
| `education.json` | `getDiploma()` | `Diploma` | single object |

## Field reference

### `Certification` ([certification.ts](../../src/src/types/certification.ts))
| Field | Type | Required |
| --- | --- | --- |
| `title` | string | yes |
| `image` | `Image` | yes |
| `url` | string | yes |
| `issuer` | string | yes |
| `date` | `ISODateString` (`YYYY-MM-DD`) | yes |
| `relevance` | `"High" \| "Medium" \| "Low"` | yes |
| `order` | number | yes (sort key on About) |

### `Experience` ([experience.ts](../../src/src/types/experience.ts))
| Field | Type | Required |
| --- | --- | --- |
| `name` | string | yes |
| `company` | `Company` | yes |
| `start` | `ISODateString` (`YYYY-MM-DD`) | yes |
| `end` | `ISODateString` (`YYYY-MM-DD`) | no (omit = "Present") |
| `type` | `"Full-Time" \| "Part-Time" \| "Internship" \| "Freelance"` | no |
| `description` | string (markdown) | no |

### `Company` ([company.ts](../../src/src/types/company.ts))
`name` (req), `logo` (`Image`, opt), `website` (req), `location` (req).

### `SkillCategory` ([skill-category.ts](../../src/src/types/skill-category.ts)) + `Skill` ([skill.ts](../../src/src/types/skill.ts))
Category: `name` (req), `description` (opt), `skills` (`Skill[]`, req).
Skill: `name` (req), `iconId` (opt — **must match an `icons.json` `id`**),
`yearsOfExperience` (opt).

### `Icon` ([icon.ts](../../src/src/types/icon.ts))
`id` (req, referenced by `skill.iconId`), `name` (req), `icon` (req — path to svg).

### `Interest` ([interest.ts](../../src/src/types/interest.ts))
`title` (req), `image` (`Image`, req), `description` (req), `redirectPath` (opt).

### `Contact` ([contact.ts](../../src/src/types/contact.ts))
`name` (req — the link label), `icon` (req — icon key string), `url` (req).

### `Profile` ([profile.ts](../../src/src/types/profile.ts))
`role` (req), `introduction` (req), `description` (req, markdown), `avatar` (`Image`, req).

### `Diploma` ([diploma.ts](../../src/src/types/diploma.ts))
`name` (req), `University` (req — note the capital `U`), `logo` (`Image`, req),
`details` (`string[]`, req), `description` (req).

## Rules for agents editing data

- Match the exact type; do not add fields the type doesn't declare.
- Keep dates as `YYYY-MM-DD` strings.
- Every image needs `src`, `alt`, `width`, `height`; prefer AVIF assets under `src/public/images/`.
- Any `skill.iconId` you add must correspond to an existing `icons.json` entry.
- After editing data, run `npm run build` and `npm run test` (see [quality-bars.md](./quality-bars.md)).
