---
title: "Beyond GitHub Copilot: Can You Reuse Your AI Setup?"
description: "A repository configuration cheat sheet comparing GitHub Copilot, OpenCode, Codex, and Claude Code: discovery paths, reusable assets, and migration gaps."
publishedAt: "2026-10-15"
featured: false
tags: ["GitHub Copilot", "AI", "OpenCode", "Codex", "Claude Code"]
author: "Logan Farci"
coauthoredWithAgent: true
---

At work and on my personal projects, I spend a lot of time on GitHub. GitHub Copilot has been my usual coding assistant, and over time I've added instructions, skills, and custom agents to make it more useful in my repositories.

I've also tried Claude Code, Codex, and OpenCode. One thing I keep running into is the configuration. I open a repository in a different tool and find myself adapting files or recreating things I've already set up for GitHub Copilot. Sometimes the instructions carry over easily. Other times, an agent or workflow needs a different setup.

So I wanted to look at a fairly specific question: **if a repository is already configured for GitHub Copilot, what can I reuse with another coding tool?** By *harness*, I mean the tool that runs the coding agent, provides tools, and manages its workflow. This is about files and settings in the repository, not model providers, API keys, or subscriptions. The comparison reflects documented behavior as of October 2026, not a hands-on compatibility benchmark.

## What counts as agent configuration?

Repository configuration includes **instructions** (project guidance), **skills** (reusable procedures), **custom agents** (specialized roles), **MCP servers** (external integrations), and **harness settings** (permissions, hooks, and execution behavior). Agent orchestration, such as delegation between roles, is particularly tool-dependent.

A GitHub Copilot-oriented repository might contain something like this:

```text
my-project/
├── AGENTS.md
├── .agents/
│   └── skills/
│       └── write-article/
│           └── SKILL.md
├── .github/
│   ├── copilot/
│   │   └── settings.json
│   ├── copilot-instructions.md
│   ├── instructions/
│   │   └── articles.instructions.md
│   └── agents/
│       └── reviewer.agent.md
├── .mcp.json
└── src/
    └── AGENTS.md
```

This layout is illustrative: sharing a file's contents does not mean every tool discovers its location.

## Where each harness looks

Here is the cheat sheet I would have liked when I started trying other tools. It focuses on repository-level files, not user-level settings.

### Scope

The Copilot baseline is **Copilot CLI**. Other integrations, including VS Code and GitHub.com, may discover different instruction files; check GitHub's [support matrix](https://docs.github.com/en/copilot/reference/custom-instructions-support). The table covers repository files, not user-level settings.

### Configuration cheat sheet

| Asset | GitHub Copilot | OpenCode | Codex | Claude Code |
| --- | --- | --- | --- | --- |
| **Instructions** | `.github/copilot-instructions.md`; `.github/instructions/**/*.instructions.md` (`applyTo`); `AGENTS.md` (CLI; support varies elsewhere); CLI also reads `CLAUDE.md` and `GEMINI.md` | `AGENTS.md`; V1: first-match and `CLAUDE.md` fallback; V2: ancestors plus nested on access; `opencode.json` instruction globs | `AGENTS.md` along root-to-working-directory path at startup; `AGENTS.override.md` takes precedence in its directory | Root and nested `CLAUDE.md`; `.claude/rules/` (`paths` scoping); `AGENTS.md` fallback only when no applicable Claude instruction file blocks it |
| **Skills** | `.agents/skills/<name>/SKILL.md`, `.github/skills/<name>/SKILL.md`, `.claude/skills/<name>/SKILL.md` | `.agents/skills/<name>/SKILL.md`, `.opencode/skills/<name>/SKILL.md`, `.claude/skills/<name>/SKILL.md` | `.agents/skills/<name>/SKILL.md` | `.claude/skills/<name>/SKILL.md` (no automatic `.agents/skills/` discovery documented) |
| **Custom agents** | `.github/agents/*.agent.md` | `.opencode/agents/*.md` or `opencode.json` / `opencode.jsonc` | `.codex/agents/<name>.toml` | `.claude/agents/*.md` (Markdown with YAML frontmatter) |
| **MCP servers** | `.github/mcp.json` (shared) or `.mcp.json` (repository root; GitHub Copilot CLI) | `opencode.json` | `.codex/config.toml` (trusted project) | `.mcp.json` (project root) |
| **Harness configuration** (permissions, hooks, tools) | `.github/copilot/settings.json` (shared repository settings); `.github/copilot/settings.local.json` (local overrides) | `opencode.json`, plugins | `.codex/config.toml` (trusted project) | `.claude/settings.json` (shared); `.claude/settings.local.json` (local override) |

### Nested instructions

**OpenCode V1** uses first-match discovery and a `CLAUDE.md` fallback; **V2** combines ancestor instructions and loads nested files on access. Check your version with `opencode --version` and consult the [V2 migration guide](https://dev.opencode.ai/v2/docs/migrate-v1/). **Codex** builds its `AGENTS.md` chain at startup, from repository root to working directory; launch it in the relevant subtree or explicitly read deeper instructions. Claude Code can load nested instructions on access, subject to its fallback rules. See [Codex instruction discovery](https://developers.openai.com/codex/guides/agents-md) and [OpenCode V2 instructions](https://dev.opencode.ai/v2/docs/instructions/).

### Claude Code's fallback rules

Claude Code **2.1.277+** can use `AGENTS.md` as a fallback, but an applicable `CLAUDE.md`, `CLAUDE.local.md`, or `.claude/CLAUDE.md` can prevent that fallback. To load both formats, select **Project instructions → claude-md-and-agents-md** through `/config`; this choice is not controlled by repository or local settings files. It can also be configured in user-level `~/.claude/settings.json`, a `--settings` file, or managed settings, via `pluginConfigs`. For a repository-controlled alternative, reference `@AGENTS.md` from `CLAUDE.md`. Bedrock and telemetry-disabled environments required 2.1.281+; check the [Claude Code memory documentation](https://code.claude.com/docs/en/memory) for availability and precedence.

### MCP and harness-specific configuration

MCP is a shared protocol, but **how you configure an MCP server depends on the harness**. GitHub Copilot CLI and Claude Code recognize a project-level `.mcp.json`, and GitHub Copilot CLI also supports `.github/mcp.json`. OpenCode defines MCP servers in `opencode.json`, while Codex uses `.codex/config.toml`. The same MCP server may work across tools, but its configuration is not necessarily portable.

GitHub Copilot CLI does **not** read VS Code's `.vscode/mcp.json`; the [GitHub Copilot CLI MCP guide](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) explains the difference.

Other settings are mostly tool-specific, though Copilot CLI also reads a **documented subset** of `.claude/settings.json` and `.claude/settings.local.json`, including certain hooks. This is partial compatibility, not full portability: check supported keys and test behavior against the [Copilot CLI settings reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference).

## What needs to change when switching?

Starting from Copilot configuration, here is what I would keep or adapt:

| GitHub Copilot | OpenCode | Codex | Claude Code |
| --- | --- | --- | --- |
| **Repository-wide instructions:** root `AGENTS.md` or `.github/copilot-instructions.md` | Reuse `AGENTS.md`; include Copilot files via `instructions` globs if useful | Reuse `AGENTS.md`; relocate Copilot-only files | Reuse `AGENTS.md` on supported versions, subject to `CLAUDE.md` precedence; adapt Copilot-specific instructions |
| **Scoped instructions:** nested `AGENTS.md` or `.github/instructions/*.instructions.md` | V2: nested `AGENTS.md`; translate file conditions | Load nested `AGENTS.md` from working-directory chain; translate file conditions | Translate file conditions into `.claude/rules/` with `paths`; check fallback |
| **Skills:** `.agents/skills/` | Reuse the shared skill directory | Reuse the shared skill directory | Link or copy skills into `.claude/skills/` as needed |
| **Custom agents:** `.github/agents/*.agent.md` | Adapt agent metadata and configuration | Convert to TOML agent definitions | Adapt agent frontmatter and tool settings |
| **MCP servers** | Reuse server details; configure in `opencode.json` | Reuse server details; configure in `.codex/config.toml` | Reuse server details; configure in `.mcp.json` |
| **Delegation, permissions, and orchestration** | Rework and test workflows | Rework and test workflows | Rework and test workflows |

## Instructions are getting easier to share

For repository-wide guidance, **prefer [`AGENTS.md`](https://agents.md/)**. All four harnesses covered here recognize it in their documented configurations, so architecture notes, development commands, and coding conventions can live in one shared file. If you only need those general instructions in GitHub Copilot CLI, `.github/copilot-instructions.md` offers little portability benefit over `AGENTS.md`. It can still matter on Copilot surfaces with different instruction-file support.

**Scoped instructions are the important exception.** Nested `AGENTS.md` files organize guidance by directory, but GitHub Copilot's `.github/instructions/*.instructions.md` supports `applyTo` glob patterns. That lets you target a single file, such as `src/App.tsx`, or files matching `**/*.tsx` across multiple directories. A nested `AGENTS.md` does not provide the same file-pattern targeting. **OpenCode's `instructions` globs select instruction documents to load, not the files those rules apply to.** Claude Code offers `.claude/rules/*.md` with `paths` frontmatter; for OpenCode and Codex, use directory guidance where possible and preserve remaining file-specific conditions explicitly. Discovery also does not guarantee identical precedence, so keep root and nested rules consistent.

**My rule of thumb:** Prefer `AGENTS.md` for shared guidance; retain Copilot's `applyTo` when its conditional scope matters.


## Share skills through `.agents/skills/`

For skills, there is a particularly easy portability win: **put reusable skills in `.agents/skills/<name>/SKILL.md`** rather than keeping them only under GitHub Copilot's `.github/skills/`. GitHub Copilot, OpenCode, and Codex all document discovery of the shared `.agents/skills/` location, so those three harnesses can find the same skill without maintaining three copies.

Copilot, OpenCode, and Codex discover `.agents/skills/` directly. **Only Claude Code needs a bridge** to `.claude/skills/`: [symlink the skill directory](https://code.claude.com/docs/en/skills), or copy it if symlinks are unavailable. For example: `mkdir -p .claude/skills && ln -s ../../.agents/skills/code-review .claude/skills/code-review`. Copilot and OpenCode may discover both paths; verify that this does not create duplicate skill entries in your setup.

The [Agent Skills specification](https://agentskills.io/) standardizes the file format, not invocation behavior. Test explicit and automatic skill discovery in each tool.


## Custom agents need an active migration

Custom agents are harder to move than instructions or skills. Their definitions combine a role and instructions with harness-specific tools, permissions, delegation, and execution behavior. There is no common custom-agent configuration format supported across GitHub Copilot, OpenCode, Codex, and Claude Code.

**Reuse the intent, but migrate the implementation.** Translate agent definitions and test the same representative tasks in each tool, including results, tool access, permissions, and delegation. Copying a prompt alone does not reproduce a workflow.

## Conclusion: Where portability still stops

Portability is not all or nothing. **Instructions and skills are increasingly reusable; custom-agent execution remains harness-specific.** My takeaway is simple: share instructions and skills, then translate and test tool-specific configuration. I plan to test real migrations next; for now, this is a documentation-based comparison, not a compatibility benchmark.

### Official references

For the main configuration documentation of each harness:

1. [GitHub Copilot customization](https://docs.github.com/en/copilot/reference/customization-cheat-sheet) and [CLI MCP configuration](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)
2. [OpenCode V2 instructions](https://dev.opencode.ai/v2/docs/instructions/) and [V1 migration](https://dev.opencode.ai/v2/docs/migrate-v1/)
3. [Codex instruction discovery](https://developers.openai.com/codex/guides/agents-md) and [configuration](https://developers.openai.com/codex/config-basic)
4. [Claude Code memory and instruction loading](https://code.claude.com/docs/en/memory) and [skills](https://code.claude.com/docs/en/skills)
