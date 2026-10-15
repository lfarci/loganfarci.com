---
title: "Beyond GitHub Copilot: Can You Reuse Your AI Setup?"
description: "A practical look at which repository-level GitHub Copilot customizations OpenCode can reuse, which need translation, and where portability ends."
publishedAt: "2026-10-15"
featured: false
tags: ["GitHub Copilot", "AI", "OpenCode"]
author: "Logan Farci"
coauthoredWithAgent: true
---

I use GitHub Copilot regularly, so naturally I have tailored my repositories around it. My personal website is no exception. It contains repository instructions, article-writing guidance, and an agent workflow with explicit roles and delivery rules.

Then I wanted to try [OpenCode](https://opencode.ai/). Not because I wanted to change models, but because I wanted to try a different coding harness on Fedora.

That raised a surprisingly practical question: **how much of the configuration already committed to my repository can I reuse when switching coding harnesses?** OpenCode is my first example, but the same question applies to Codex, Claude Code, Cursor, and Gemini CLI.

This article is about **repository configuration**, not model choice, API keys, subscriptions, or bring-your-own-key support.

## Start with the files, not the marketing

In [my website repository](https://github.com/lfarci/loganfarci.com), the existing Copilot setup includes `.github/copilot-instructions.md` and `.github/instructions/articles.instructions.md`. The latter targets `content/articles/*.md`. The repository also documents a Product Owner, Orchestrator, and Developer workflow, with a local contract validator.

These are not interchangeable kinds of configuration. Some files provide *knowledge* to an agent; others define *how a particular runtime should execute work*.

For a first-pass migration from Copilot to OpenCode, I would classify the assets this way:

| Asset | Existing Copilot location or convention | OpenCode migration assessment |
| --- | --- | --- |
| General repository guidance | `.github/copilot-instructions.md` | Adapt into a shared `AGENTS.md` or configure explicit instruction loading |
| Path-specific guidance | `.github/instructions/*.instructions.md` | Translate the path-scoping behavior; do not assume automatic discovery |
| Shared instructions | `AGENTS.md` | Reusable when both tools read the same file |
| Agent Skills | `.agents/skills/<name>/SKILL.md` | Strong portability candidate, subject to skill discovery and runtime testing |
| Custom agents | `.github/agents/*.agent.md` | Translate agent metadata, tools, and permissions into OpenCode's agent format |
| MCP servers | Copilot-specific MCP settings | Reuse server definitions conceptually; adapt client configuration |
| Delegation and sessions | Copilot-specific runtime behavior | No promise of equivalent orchestration |

This is a **migration assessment**, not a claim that every row has been tested end to end. In particular, a compatible Markdown file does not prove that the target harness discovers or applies it.

## Beyond OpenCode: the wider portability question

OpenCode is the concrete migration scenario, not the only destination. The same Copilot repository might be opened tomorrow in Codex, Claude Code, Cursor, or Gemini CLI. To compare those harnesses fairly, I would track four outcomes for every asset: **recognized as-is**, **requires configuration or relocation**, **requires semantic translation**, and **unsupported or unverified**.

| Asset | OpenCode | Codex | Claude Code | Cursor | Gemini CLI |
| --- | --- | --- | --- | --- | --- |
| `AGENTS.md` guidance | Native convention | Native convention | Check loading behavior | Check loading behavior | Check loading behavior |
| Agent Skills (`SKILL.md`) | Shared format candidate | Shared format candidate | Shared format candidate | Shared format candidate | Shared format candidate |
| Copilot `.agent.md` profiles | Translation required | Translation required | Translation required | Translation required | Translation required |
| MCP client configuration | Adapt settings | Adapt settings | Adapt settings | Adapt settings | Adapt settings |
| Permissions and delegation | Runtime-specific | Runtime-specific | Runtime-specific | Runtime-specific | Runtime-specific |

This is a **research checklist**, not a verified support matrix. In particular, “shared format candidate” does not assert identical discovery paths or execution behavior. I would only mark a cell as confirmed after checking the target version and, ideally, running a small test. The article can grow into a versioned matrix without claiming that all harnesses are interchangeable today.

## Instructions: mostly a discovery problem

The most promising common denominator is [`AGENTS.md`](https://agents.md/). If a project puts general guidance there, different coding tools can potentially consume the same human-readable instructions.

My repository already has a root `AGENTS.md` that points to Copilot instructions and canonical specs, so some guidance is shared without duplication. Important context still lives in `.github/copilot-instructions.md`: project architecture, commands, coding conventions, and links to the actual specs under `docs/specs/`.

The content itself is not tied to Copilot. The *path and loading rules* are.

A sensible cleanup would be to keep shared guidance in `AGENTS.md`, leave genuinely Copilot-specific instructions in `.github/`, and verify how each harness handles scoped instructions. A path-scoped Copilot instruction is not automatically equivalent to an always-loaded Markdown file.

## Skills: the closest thing to a portable asset

The [Agent Skills specification](https://agentskills.io/) defines a reusable skill around a `SKILL.md` file and supporting resources. This is a much better starting point than maintaining parallel versions of the same coding checklist for every assistant.

Still, I would test two things separately: does the harness *find* the skill, and does it *use* it correctly for the task? Shared structure does not guarantee identical triggering, tools, or results.

My website's existing article guidance is a useful candidate for a future skill, but I would not call it a portable skill until it has actually been packaged and exercised in both tools.

## Agents: this is where the abstraction leaks

A custom agent is more than a prompt. It may specify tools, execution mode, permissions, delegation, and how work returns to the parent session.

My website's documented Product Owner to Orchestrator to Developer workflow makes this concrete. Its rules cover approval boundaries, branch isolation, and quality gates. Copying those instructions into an OpenCode agent file would preserve some intent, but would not recreate Copilot's execution model.

The realistic migration is to preserve the workflow contract, then implement and test the orchestration separately in each harness. A passing static contract validator is useful evidence about repository rules, **not** proof of equivalent live agent behavior.

## What I would actually migrate first

I would avoid rewriting everything at once:

1. Audit the existing root and nested `AGENTS.md` files, keeping references to canonical `docs/specs/` documents rather than duplicating instructions.
2. Check which instructions OpenCode discovers without extra configuration.
3. Move genuinely reusable task guidance into Agent Skills where appropriate.
4. Translate one small custom agent, documenting differences in tools and permissions.
5. Run the same task in both harnesses and record what changed, including any manual intervention.

This order matters. If the simple instructions already work, there is no reason to build a configuration compiler just to copy Markdown files.

## The portability boundary

The emerging answer is not that configuration is either portable or locked in. **Instructions and skills are increasingly reusable; agent execution remains harness-specific.**

For developers starting with GitHub Copilot, that suggests a practical rule: write shared knowledge in common formats first, and isolate runtime-specific behavior instead of letting it spread through the repository.

I have not yet run a controlled Copilot-versus-OpenCode migration of every asset in this repository, or equivalent checks for the other harnesses. The next step is to do that and replace the assessments above with observed results, including exact harness versions.

That experiment will tell us whether a configuration translation tool would actually save maintenance effort, or merely add another configuration format to maintain.

### References

- [AGENTS.md convention](https://agents.md/)
- [Agent Skills specification](https://agentskills.io/)
- [OpenCode documentation](https://opencode.ai/docs/)
- [Codex documentation](https://developers.openai.com/codex/)
- [Claude Code documentation](https://code.claude.com/docs/en/overview)
- [Cursor documentation](https://cursor.com/docs)
- [Gemini CLI documentation](https://geminicli.com/docs/)
- [GitHub Copilot custom agents documentation](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-custom-agents)
