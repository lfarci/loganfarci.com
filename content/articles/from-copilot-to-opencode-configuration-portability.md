---
title: "Beyond GitHub Copilot: Can You Reuse Your AI Setup?"
description: "A repository configuration cheat sheet comparing GitHub Copilot, OpenCode, Codex, and Claude Code: discovery paths, reusable assets, and migration gaps."
publishedAt: "2026-10-15"
featured: false
tags: ["GitHub Copilot", "AI", "OpenCode"]
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

The Copilot baseline is **CLI and desktop**. Other integrations, including VS Code and GitHub.com, may discover different instruction files; check GitHub's [support matrix](https://docs.github.com/en/copilot/reference/custom-instructions-support). The table covers repository files, not user-level settings.

### Configuration cheat sheet

| Asset | GitHub Copilot | OpenCode | Codex | Claude Code |
| --- | --- | --- | --- | --- |
| **Instructions** | `.github/copilot-instructions.md` (root-wide); `.github/instructions/**/*.instructions.md` (glob-scoped); root or nested `AGENTS.md` in supported surfaces | Root and nested `AGENTS.md` (V2: nested on file access); `opencode.json` `instructions` globs; V1 only: `CLAUDE.md` fallback | `AGENTS.md` along root-to-working-directory path at startup; `AGENTS.override.md` takes precedence in its directory | Root and nested `CLAUDE.md`; `.claude/rules/`; nested `AGENTS.md` on file access where supported (fallback when no applicable `CLAUDE.md`) |
| **Skills** | `.agents/skills/<name>/SKILL.md`, `.github/skills/<name>/SKILL.md` | `.agents/skills/<name>/SKILL.md`, `.opencode/skills/<name>/SKILL.md` | `.agents/skills/<name>/SKILL.md` | `.claude/skills/<name>/SKILL.md` (no automatic `.agents/skills/` discovery documented) |
| **Custom agents** | `.github/agents/*.agent.md` | `.opencode/agents/*.md` or `opencode.json` / `opencode.jsonc` | `.codex/agents/<name>.toml` | `.claude/agents/*.md` (Markdown with YAML frontmatter) |
| **MCP servers** | `.github/mcp.json` (shared) or `.mcp.json` (repository root; GitHub Copilot CLI) | `opencode.json` | `.codex/config.toml` (trusted project) | `.mcp.json` (project root) |
| **Harness configuration** (permissions, hooks, tools) | `.github/copilot/settings.json` (shared repository settings); `.github/copilot/settings.local.json` (local overrides) | `opencode.json`, plugins | `.codex/config.toml` (trusted project) | `.claude/settings.json` (shared); `.claude/settings.local.json` (local override) |

### Nested instructions

Discovery differs. **Codex** builds its `AGENTS.md` chain at startup, from repository root to working directory. Launch it in the relevant subtree or explicitly ensure deeper instructions are read. **OpenCode V2** discovers nested instructions as files and directories are accessed. Claude Code can also discover nested instructions on access, subject to its fallback rules. See [Codex instruction discovery](https://developers.openai.com/codex/guides/agents-md) and [OpenCode V2 instructions](https://dev.opencode.ai/v2/docs/instructions/).

### Claude Code's fallback rules

Claude Code can use `AGENTS.md` as a fallback, but an applicable `CLAUDE.md`, `CLAUDE.local.md`, or `.claude/CLAUDE.md` can prevent that fallback. To load both formats, select **Project instructions → claude-md-and-agents-md** through `/config`; this choice is not controlled by repository or local settings files. For a repository-controlled alternative, reference `@AGENTS.md` from `CLAUDE.md`. Check the [Claude Code memory documentation](https://code.claude.com/docs/en/memory) for supported versions and precedence.

### MCP and harness-specific configuration

MCP is a shared protocol, but **how you configure an MCP server depends on the harness**. GitHub Copilot CLI and Claude Code recognize a project-level `.mcp.json`, and GitHub Copilot CLI also supports `.github/mcp.json`. OpenCode defines MCP servers in `opencode.json`, while Codex uses `.codex/config.toml`. The same MCP server may work across tools, but its configuration is not necessarily portable.

GitHub Copilot CLI does **not** read VS Code's `.vscode/mcp.json`; the [GitHub Copilot CLI MCP guide](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) explains the difference.

Other settings are mostly tool-specific, though Copilot CLI also reads a **documented subset** of `.claude/settings.json` and `.claude/settings.local.json`, including certain hooks. This is partial compatibility, not full portability: check supported keys and test behavior against the [Copilot CLI settings reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference).

## What needs to change when switching?

The first table shows **where each harness looks**. This one starts with a repository configured for **GitHub Copilot** and asks a more practical question: **what can I keep, and what needs adapting?** Reusing the text of an instruction is not the same as having another harness discover it automatically.

| GitHub Copilot | OpenCode | Codex | Claude Code |
| --- | --- | --- | --- |
| **Repository-wide instructions:** root `AGENTS.md` or `.github/copilot-instructions.md` | Reuse `AGENTS.md`; move or reference Copilot-specific instructions | Reuse `AGENTS.md`; move or reference Copilot-specific instructions | Reuse `AGENTS.md` on supported versions, subject to `CLAUDE.md` precedence; adapt Copilot-specific instructions |
| **Scoped instructions:** nested `AGENTS.md` or `.github/instructions/*.instructions.md` | Reuse nested `AGENTS.md` in V2; adapt Copilot-specific globs | Reuse nested `AGENTS.md` along startup working-directory chain; adapt Copilot-specific globs | Reuse nested `AGENTS.md` on supported versions; adapt Copilot-specific globs and check `CLAUDE.md` precedence |
| **Skills:** `.agents/skills/` | Reuse the shared skill directory | Reuse the shared skill directory | Link or copy skills into `.claude/skills/` as needed |
| **Custom agents:** `.github/agents/*.agent.md` | Adapt agent metadata and configuration | Convert to TOML agent definitions | Adapt agent frontmatter and tool settings |
| **MCP servers** | Reuse server details; configure in `opencode.json` | Reuse server details; configure in `.codex/config.toml` | Reuse server details; configure in `.mcp.json` |
| **Delegation, permissions, and orchestration** | Rework and test workflows | Rework and test workflows | Rework and test workflows |

## How I would approach a migration

Start with shared instructions and skills. Then adapt custom agents and MCP settings, and test behavior in each target tool.

## Instructions are getting easier to share

For repository-wide guidance, **prefer [`AGENTS.md`](https://agents.md/)**. All four harnesses covered here recognize it in their documented configurations, so architecture notes, development commands, and coding conventions can live in one shared file. If you only need those general instructions in GitHub Copilot CLI, `.github/copilot-instructions.md` offers little portability benefit over `AGENTS.md`. It can still matter on Copilot surfaces with different instruction-file support.

**Scoped instructions are the important exception.** Nested `AGENTS.md` files organize guidance by directory, but GitHub Copilot's `.github/instructions/*.instructions.md` supports `applyTo` glob patterns. That lets you target a single file, such as `src/App.tsx`, or files matching `**/*.tsx` across multiple directories. A nested `AGENTS.md` does not provide the same file-pattern targeting.

**My rule of thumb:** Prefer `AGENTS.md` for both root and nested directory instructions. Use GitHub Copilot-specific files when you need file-pattern targeting with `applyTo`, or intentionally want Copilot-only behavior. Avoid duplicating rules.


## Share skills through `.agents/skills/`

For skills, there is a particularly easy portability win: **put reusable skills in `.agents/skills/<name>/SKILL.md`** rather than keeping them only under GitHub Copilot's `.github/skills/`. GitHub Copilot, OpenCode, and Codex all document discovery of the shared `.agents/skills/` location, so those three harnesses can find the same skill without maintaining three copies.

Claude Code discovers project skills under `.claude/skills/` instead, and does not document a setting to replace that default path with `.agents/skills/`. Fortunately, [Claude Code supports symlinked skill directories](https://code.claude.com/docs/en/skills). Keep `.agents/skills/` as the source of truth and symlink each skill into `.claude/skills/` rather than maintaining copies. For example, from the repository root: `mkdir -p .claude/skills && ln -s ../../.agents/skills/code-review .claude/skills/code-review` (assuming the `code-review` skill exists).

The [Agent Skills specification](https://agentskills.io/) provides a common `SKILL.md` format. **Sharing the file is not the same as guaranteeing identical behavior**: each harness may decide differently when to discover, load, and run a skill. Test skill discovery in every harness, both by asking for the skill explicitly and by trying a task that should trigger it naturally. Then check whether the resulting behavior matches your expectations. A shared directory is a portability win, not a substitute for testing.


## Custom agents need an active migration

Custom agents are harder to move than instructions or skills. Their definitions combine a role and instructions with harness-specific tools, permissions, delegation, and execution behavior. There is no common custom-agent configuration format supported across GitHub Copilot, OpenCode, Codex, and Claude Code.

**Reuse the intent, but migrate the implementation.** Translate each agent definition into the target harness's format, then test representative tasks, tool access, approval boundaries, delegation, and results. Copying the prompt alone does not reproduce the workflow.

To validate a migration, I would run the same representative tasks in each tool and compare the results, tool access, permissions, and delegation—not just whether the agent produces a plausible answer.

## What's next?

I want to compare real migrations on identical tasks and explore whether an **agent-specific translation tool** could help without masking differences in permissions and delegation. For now, these are documentation-based recommendations, not controlled compatibility results.

## Conclusion: Where portability still stops

Portability is not all or nothing. **Instructions and skills are increasingly reusable; custom-agent execution remains harness-specific.** My takeaway is simple: keep shared knowledge in existing formats first, and isolate behavior that depends on a particular tool.

### Official references

For the main configuration documentation of each harness:

1. [GitHub Copilot customization](https://docs.github.com/en/copilot/reference/customization-cheat-sheet)
2. [OpenCode V2 instructions](https://dev.opencode.ai/v2/docs/instructions/) and [V1 migration](https://dev.opencode.ai/v2/docs/migrate-v1/)
3. [Codex configuration](https://developers.openai.com/codex/config-basic)
4. [Claude Code settings](https://code.claude.com/docs/en/settings)
