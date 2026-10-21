---
title: "I Tested Microsoft APM Across Copilot, Codex, and OpenCode"
description: "What custom coding agents are, and what two small APM experiments reveal about portability across Copilot, Codex, and OpenCode."
publishedAt: "2026-10-21"
featured: false
tags: ["GitHub Copilot", "AI", "OpenCode", "Codex", "APM"]
author: "Logan Farci"
coauthoredWithAgent: true
---

In my [previous article](/articles/from-copilot-to-opencode-configuration-portability), I explored how much of a repository's AI configuration could be shared between GitHub Copilot, Codex, OpenCode, and Claude Code. Instructions and skills are increasingly reusable, but custom agents still vary quite a bit.

That made me wonder: **could I maintain one agent definition and deploy it across different coding tools?**

Before attempting to build a converter, I found [Microsoft Agent Package Manager (APM)](https://microsoft.github.io/apm/) and decided to try it. I documented two small experiments in [agent-portability-lab](https://github.com/lfarci/agent-portability-lab).

## Do you really need a custom agent?

**Copilot, Codex, and OpenCode are already coding agents.** You don't need to create a custom-agent file to make them read code, use tools, or work through a task. Each product comes with an *agent harness*: the runtime that manages model and tool calls, context, execution, and permissions. You can use one interactively or automate it from a script or server. Strictly speaking, the harness is the machinery behind an agent, not the agent itself, even if we often use the product name for both.

In this article, **custom agent** means something narrower: a **named profile within an existing harness**. For example, a *reviewer* profile might focus on finding bugs, expose only read/search tools, choose a model, or be available for delegation. Depending on the harness, you can select that profile for your main session or launch it as a subagent with its own context. You're configuring an existing agent runtime, not building a new one.

My practical rule of thumb is to keep these concerns separate:

- **`AGENTS.md` and project instructions:** conventions that should apply broadly.
- **Skills:** reusable *how-to* procedures for specific tasks.
- **Custom agent profiles:** a specialized role, its tools and permissions, and optionally model or delegation settings.

Those are useful boundaries, not hard technical limits: agent profiles can contain instructions too, and the harness ultimately determines what permissions it enforces. If the default assistant plus instructions and skills already does the job, **you probably don't need a custom agent**.

For this experiment, the question is whether APM can move such a profile between harnesses **without losing the intended configuration**. See [GitHub's comparison of customization options](https://docs.github.com/en/copilot/concepts/customizations/comparing-customizations) and [Microsoft's description of an agent harness](https://learn.microsoft.com/en-us/agent-framework/concepts/harness) for the broader distinction.

## Experiment 1: Can one agent run in three harnesses?

I started with a straightforward C# reviewer. Its canonical definition was stored at `.apm/agents/reviewer.agent.md`:

```markdown
---
name: reviewer
description: Reviews C# code for correctness and edge cases without editing files.
---

# Reviewer

Review the requested C# code for correctness bugs and edge cases.
Do not edit files. Explain each bug and suggest a unit test.
Finish with: APM-REVIEW-COMPLETE
```

The actual [test agent](https://github.com/lfarci/agent-portability-lab/blob/main/.apm/agents/reviewer.agent.md) contains a few more review instructions. I gave it a small C# file with a deliberate off-by-one bug: the bounds check used `index > scores.Length` rather than `index >= scores.Length`.

I installed the agent for three targets:

```bash
apm install --target copilot,codex,opencode --verbose
```

APM generated:

```text
.github/agents/reviewer.agent.md
.codex/agents/reviewer.toml
.opencode/agents/reviewer.md
```

Copilot and OpenCode received Markdown; Codex received a TOML definition containing the reviewer's instructions.

I then ran the same review task in all three harnesses. Copilot and OpenCode let me select the reviewer directly; in Codex I asked the main agent to delegate to its generated reviewer subagent.

| Check | Copilot | Codex | OpenCode |
| --- | --- | --- | --- |
| Agent generated | Pass | Pass | Pass |
| Review completed and bug found | Pass | Pass | Pass |
| Original source unchanged | Pass | Pass | Pass |
| Exact completion marker | Pass | Pass | Partial |

All three found the expected boundary bug and suggested the fix. OpenCode also ran tests in a scratch directory, although its final marker was missing the last character. These were individual functional tests, not a performance comparison.

Finally, I added one instruction to the canonical definition and reran APM. **The change propagated to all three generated files**, including Codex's TOML. For a simple, instruction-based reviewer, this was the workflow I wanted.

There was one minor quirk: APM 0.34.0's dry run reported no changes even though the actual install deployed the local agent.

## Experiment 2: What happens to tool restrictions?

The second experiment tested something more important than a shared prompt: **can APM preserve which tools an agent is allowed to use?**

I defined a `restricted-reviewer` with this frontmatter:

```yaml
---
name: restricted-reviewer
description: Reviews C# code without editing files or running commands.
tools:
  read: true
  grep: true
  edit: false
  bash: false
---
```

APM generated the target files, but their configurations were not equivalent:

| Harness | What happened |
| --- | --- |
| **GitHub Copilot** | APM copied the boolean mapping, but Copilot expects `tools` to be an array or comma-separated string. VS Code flagged a schema error. |
| **OpenCode v2** | APM copied the legacy `tools` mapping instead of generating native `permissions` rules. |
| **Codex** | APM dropped `tools` and warned that the generated agent might inherit available MCP tools. |

The Codex warning was particularly clear:

```text
Codex agent restricted-reviewer.agent.md:
frontmatter field 'tools' was dropped;
the agent may inherit all project/session MCP servers.
```

I also added a [small validator](https://github.com/lfarci/agent-portability-lab/blob/experiment/02-tool-restrictions/scripts/validate-experiment-02.py) to check the relevant generated fields. It reported **three incompatibility findings and one warning**.

This was a *static configuration test*. I didn't attempt to prove whether a harness would block editing at runtime. In particular, seeing a legacy OpenCode field doesn't establish how that field behaves. But the test was enough to show that **one canonical tool configuration did not become equivalent native restrictions across all three harnesses**.

## Is APM planning to address this?

I checked APM's upstream discussions. [Issue #2108](https://github.com/microsoft/apm/issues/2108) proposes a broader model for portable agent semantics, but the maintainers explicitly **deferred** that work in a decision recorded in October 2026.

Their selected priority is [native plugin delivery (#3094)](https://github.com/microsoft/apm/issues/3094), while leaving room for smaller compatibility and security fixes. There's no committed release for a universal cross-harness permission translator.

That helps set expectations: APM is useful for distribution, but it isn't currently a guarantee that agent capabilities mean the same thing everywhere.

## My takeaway

These two experiments changed my initial idea of building a custom converter.

**APM already works well for the basics:** I could define a reviewer once, deploy it to Copilot, Codex, and OpenCode, run it successfully, and propagate an update.

**Permissions are where portability breaks down.** An agent's instructions, its available tools, and the harness's actual enforcement are different layers. Copying configuration from one tool to another doesn't make those layers equivalent.

For now, I'd use APM to reduce duplication, inspect generated files, and keep harness-specific permission settings where necessary. I'm also tracking a [GitHub Actions workflow](https://github.com/lfarci/agent-portability-lab/issues/5) to detect drift between canonical and generated agents.

The [lab repository](https://github.com/lfarci/agent-portability-lab) has the full fixtures, commands, and results if you'd like to reproduce the experiments.

### References

- [Microsoft APM](https://microsoft.github.io/apm/)
- [GitHub Copilot custom agents](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [OpenCode agents and permissions](https://opencode.ai/docs/agents/)
- [APM portable agent semantics discussion](https://github.com/microsoft/apm/issues/2108)
