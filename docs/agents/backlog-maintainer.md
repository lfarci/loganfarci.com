---
spec: backlog-maintainer compatibility router
version: 0.4.0
status: deprecated-router
---

# Backlog Maintainer Compatibility Router

`backlog-maintainer` is retained only as a compatibility entry point. The active design
of record for backlog intake, evidence gathering, issue shaping/prioritization, accepted
Delivery Briefs, and delivery sequencing is
[`feature-delivery-manager.md`](./feature-delivery-manager.md), whose runtime name is
**Product & Delivery Manager**.

## Compatibility behavior

- Route new backlog requests to Product & Delivery Manager with the original context.
- Do not perform the old cycle directly unless a human is recovering an older transcript.
- Do not hold GitHub write tools, edit files, run commands, publish, deploy, or bypass the
  Product & Delivery Manager gates.
- If no dispatch/session mechanism is available, tell the human to invoke Product &
  Delivery Manager and stop.

## Human approval gate

The backlog write gate is unchanged. Before any issue write, Product & Delivery Manager
must present the exact Issue Proposal payload and wait for explicit per-item human
approval. Approval covers one exact payload; edits require fresh approval. Silence,
summary approval, or approval for a different payload is not enough.

## `issue-writer`

`issue-writer` remains the only backlog write role. It executes exactly one already
approved Issue Proposal, must receive proof of approval for that exact payload, and must
refuse to act without it. Its permissions are intentionally unchanged by the Product &
Delivery Manager migration.

## Retained read-only helpers

`backlog-explorer`, `backlog-shaper`, `backlog-prioritizer`, and `issue-reviewer` remain
read-only helper roles that Product & Delivery Manager may dispatch by lane need. They do
not publish backlog changes and do not weaken the single-writer rule.
