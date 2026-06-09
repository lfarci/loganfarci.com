---
title: "Flouz: Safely Adding AI Categorization to a Local SQLite CLI"
description: "How flouz uses a separate suggestions table and an explicit review/apply pipeline so AI never overwrites your bank transaction data."
publishedAt: "2026-04-16"
featured: false
tags: ["Personal Finance", "SQLite", "AI", "CLI", "TypeScript"]
author: "Logan Farci"
coauthoredWithAgent: true
---

[Flouz](https://github.com/lfarci/flouz) is a small CLI I've been building to track my bank transactions locally with SQLite and let an AI model categorize them. The interesting part isn't the AI call itself, it's where the AI is allowed to write. This post walks through the one design choice that keeps the tool trustworthy: AI suggestions never touch the `transactions` table.

If you're building any tool that mixes deterministic user data with probabilistic model output, the pattern is worth stealing.

## The problem with "AI fills in the blanks"

The naive design for AI categorization is straightforward: read each uncategorized transaction, ask the model for a category, write it back to `transactions.category_id`. One column, one update, done.

It also means a wrong model output silently corrupts your historical data. Re-running categorization can flip categories you already corrected by hand. Budgets computed from those categories quietly drift. There's no audit trail of what the model proposed versus what you accepted.

For a tool I actually want to trust with my own finances, that's a non-starter.

## Two tables, one invariant

Flouz splits the concern into two tables:

```sql
CREATE TABLE transactions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  date        TEXT NOT NULL,
  amount      REAL NOT NULL,
  counterparty TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id),  -- user-confirmed only
  -- ...
);

CREATE TABLE transaction_category_suggestions (
  transaction_id INTEGER PRIMARY KEY
                 REFERENCES transactions(id) ON DELETE CASCADE,
  category_id    TEXT NOT NULL REFERENCES categories(id),
  confidence     REAL NOT NULL CHECK(confidence >= 0 AND confidence <= 1),
  model          TEXT NOT NULL,
  suggested_at   TEXT NOT NULL
);
```

The invariant is simple and enforced everywhere in the codebase: **the AI writes to `transaction_category_suggestions`, and only an explicit user action promotes a suggestion into `transactions.category_id`**.

A few details that fall out of this:

-   `ON DELETE CASCADE` keeps suggestions tidy when a transaction is removed.
-   `confidence` is a `REAL` in `[0, 1]`, enforced by a `CHECK` constraint so a buggy provider can't store nonsense.
-   `model` records which model produced the suggestion, so you can re-run only the rows categorized by an older model.
-   Re-running the AI on a transaction is an upsert: the new suggestion replaces the old one, but the transaction's own category is untouched.

The category tree itself is a 3-level hierarchy (`Necessities`, `Discretionary`, `Savings`, `Transfers`, `Income` at the root). Suggestions and assignments both point at leaf categories only, which keeps the data unambiguous when budgets aggregate back up the tree.

## The pipeline in the CLI

The split shows up directly in the command surface:

```bash
# 1. Ask the AI for suggestions on uncategorized rows
flouz transactions categorize --limit 20

# 2. Walk through pending suggestions one by one
flouz transactions suggestions review

# 3. Commit approved suggestions into transactions.category_id
flouz transactions suggestions apply
```

`categorize` only writes to the suggestions table. `review` is the interactive step where the human decides. `apply` is the only command that mutates `transactions.category_id`, and it only acts on suggestions you've already approved. `reject` and `fix` exist for the cases where the model is wrong or you want to override the category outright.

The pipeline maps cleanly onto a state machine (`pending → approved → applied`, with `rejected` as a terminal state) that you can filter on with `suggestions list --status`.

## Structured output, not raw text

The other half of trusting the model is making sure its output is shaped before it ever reaches SQLite. Flouz uses the [Vercel AI SDK](https://sdk.vercel.ai)'s `generateObject` with a Zod schema, so the categorizer can't accidentally insert a string where a UUID belongs:

```ts
import { generateObject } from 'ai'
import { z } from 'zod'

const result = await generateObject({
  model,
  schema: z.object({
    categoryId: z.string().uuid(),
    confidence: z.number().min(0).max(1),
    reasoning: z.string(),
  }),
  prompt: `Categorize this transaction: ${counterparty} ${amount} EUR`,
})

const { categoryId, confidence } = result.object
```

If the model returns malformed JSON, an unknown UUID, or a confidence outside `[0, 1]`, the call throws before anything is written. Combined with the `CHECK` constraint on `confidence` in SQLite, there are two independent guards before bad data lands on disk.

The provider itself is one line to swap (GitHub Models by default, Anthropic or a local Ollama model as alternatives), because the rest of the code only depends on the SDK's abstraction, not on a specific vendor.

## The takeaway

If you're adding AI to a tool that owns user data, treat the model as an untrusted producer. Give it its own table, its own lifecycle, and a human-driven promotion step before its output mutates anything important. In flouz that meant one extra table and three CLI commands, and it's the difference between a categorization helper I'll use on my real bank exports and one I wouldn't trust past a demo.

The code is MIT-licensed at [github.com/lfarci/flouz](https://github.com/lfarci/flouz), with full docs at [lfarci.github.io/flouz](https://lfarci.github.io/flouz/).
