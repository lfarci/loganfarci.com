---
title: "Beyond GitHub Copilot: Can You Reuse Your AI Setup?"
description: "A repository configuration cheat sheet comparing GitHub Copilot, OpenCode, Codex, and Claude Code: discovery paths, reusable assets, and migration gaps."
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

## Configuration cheat sheet: where each harness looks

In [my website repository](https://github.com/lfarci/loganfarci.com), the existing Copilot setup includes `.github/copilot-instructions.md` and `.github/instructions/articles.instructions.md`. The latter targets `content/articles/*.md`. The repository also documents a Product Owner, Orchestrator, and Developer workflow, with a local contract validator.

These are not interchangeable kinds of configuration. Some files provide *knowledge* to an agent; others define *how a particular runtime should execute work*.

The table below is the practical reference I wanted when opening an existing Copilot-oriented repository in another harness. Paths are project-local unless otherwise stated. A path listed here is a documented configuration location, not proof that another harness reads it automatically.

| Asset | GitHub Copilot | OpenCode | Codex | Claude Code |
| --- | --- | --- | --- | --- |
| Repository instructions | `.github/copilot-instructions.md`; `AGENTS.md` in supported contexts | `AGENTS.md` | `AGENTS.md` | `CLAUDE.md` |
| Scoped instructions | `.github/instructions/*.instructions.md` (with `applyTo`) | `AGENTS.md` plus configured instruction files; semantics differ | Nested `AGENTS.md` | Nested `CLAUDE.md` and rules under `.claude/rules/` |
| Agent Skills | `.github/skills/<skill>/SKILL.md` or `.agents/skills/<skill>/SKILL.md` | `.opencode/skills/<skill>/SKILL.md` or `.agents/skills/<skill>/SKILL.md` | `.agents/skills/<skill>/SKILL.md` | `.claude/skills/<skill>/SKILL.md` |
| Custom agents | `.github/agents/*.agent.md` | `.opencode/agents/*.md` or agent entries in `opencode.json` | Agent roles configured through Codex config; not Copilot `.agent.md` | `.claude/agents/*.md` |
| MCP client configuration | `.vscode/mcp.json` in VS Code; other Copilot surfaces vary | `opencode.json` (`mcp`) | `.codex/config.toml` or user config | `.mcp.json` or Claude settings |
| Permissions / hooks | Surface-specific settings and policies | `opencode.json` permissions; plugin hooks | `config.toml` approval/sandbox settings | `.claude/settings.json` permissions and hooks |

**How to read this:** these are representative documented locations, not a complete enumeration of user-level directories, legacy aliases, or every product surface. In particular, Copilot VS Code, CLI, desktop app, and cloud agent can behave differently. File discovery, feature support, and runtime behavior need separate verification.

For a Copilot-to-anything migration, I would use four labels: **read as-is**, **needs relocation or configuration**, **needs translation**, and **no equivalent / unverified**. This makes the cheat sheet useful without promising identical behavior.

## What can actually be reused?

| Copilot asset | OpenCode | Codex | Claude Code |
| --- | --- | --- | --- |
| Root `AGENTS.md` | Read as-is | Read as-is | Do not assume native discovery; bridge via `CLAUDE.md` |
| `.github/copilot-instructions.md` | Explicitly reference or adapt | Explicitly reference or adapt | Explicitly reference or adapt |
| `.github/instructions/*.instructions.md` | Translate scoping | Translate scoping | Translate scoping |
| Shared `.agents/skills/` | Shared skill location | Shared skill location | Check skill location / link or copy as needed |
| Copilot `.agent.md` profiles | Translate | Translate | Translate |
| MCP server definitions | Reuse server details, rewrite client config | Reuse server details, rewrite client config | Reuse server details, rewrite client config |
| Delegation, permissions, session orchestration | Redesign and test | Redesign and test | Redesign and test |

The biggest distinction is between **content reuse** and **automatic loading**. A Markdown instruction can be perfectly reusable even if the target tool never discovers its original file path. A custom agent can reuse the same prompt while requiring a different execution contract.

## A real repository example

My website already contains a root `AGENTS.md`, plus nested guidance and Copilot-specific instruction files. Its root file points back to `.github/copilot-instructions.md` and `docs/specs/`. This is a reasonable way to avoid repeating project knowledge, but it also means that a harness must follow those references for the full guidance to take effect.

The repository's Product Owner, Orchestrator, and Developer workflow is a tougher case. Its approval, branch, and quality-gate rules are meaningful regardless of harness, but the delegation mechanics are not portable merely because the Markdown is.

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

### Official references

- [AGENTS.md convention](https://agents.md/)
- [Agent Skills specification](https://agentskills.io/)
- [OpenCode rules](https://opencode.ai/docs/rules/) and [agents](https://opencode.ai/docs/agents/)
- [Codex documentation](https://developers.openai.com/codex/)
- [Claude Code memory](https://code.claude.com/docs/en/memory) and [subagents](https://code.claude.com/docs/en/sub-agents)
- [Cursor documentation](https://cursor.com/docs)
- [Gemini CLI documentation](https://geminicli.com/docs/)
- [GitHub Copilot custom agents documentation](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-custom-agents)
