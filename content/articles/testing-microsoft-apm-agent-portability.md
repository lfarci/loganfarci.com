---
title: "I Tested Microsoft APM Across Copilot, Codex, and OpenCode"
description: "I tested Microsoft APM with GitHub Copilot, Codex, and OpenCode to see whether custom agent instructions, tools, and permissions actually remain portable."
publishedAt: "2026-10-21"
featured: false
tags: ["GitHub Copilot", "AI", "OpenCode", "Codex", "APM"]
author: "Logan Farci"
coauthoredWithAgent: true
---

In my [previous article](/articles/from-copilot-to-opencode-configuration-portability), I explored how much of a repository's AI configuration could be shared between GitHub Copilot, Codex, OpenCode, and Claude Code. Instructions and skills are increasingly reusable, but custom agents still vary quite a bit.

That made me wonder: **could I maintain one agent definition and deploy it across different coding tools?**

Before attempting to build a converter, I found [Microsoft Agent Package Manager (APM)](https://microsoft.github.io/apm/) and decided to try it. I documented two small experiments in [agent-portability-lab](https://github.com/lfarci/agent-portability-lab).

I ran them on October 21, 2026 using **APM 0.34.0**. The recorded versions were **Codex CLI 0.163.0** for Experiment 1 and **OpenCode 2.0.30** for Experiment 2; I didn't record the Copilot CLI version. These are snapshots of a particular setup, not a cross-version compatibility claim.

## Do you really need a custom agent?

**Copilot, Codex, and OpenCode are already coding agents.** You don't need to create a custom-agent file to make them read code, use tools, or work through a task. Each product comes with an *agent harness*: the runtime that manages model and tool calls, context, execution, and permissions. You can use one interactively or automate it from a script or server. Strictly speaking, the harness is the machinery behind an agent, not the agent itself, even if we often use the product name for both.

In this article, **custom agent** means something narrower: a **named profile within an existing harness**. For example, a *reviewer* profile might focus on finding bugs, expose only read/search tools, choose a model, or be available for delegation. Depending on the harness, you can select that profile for your main session or launch it as a subagent with its own context. You're configuring an existing agent runtime, not building a new one.

My practical rule of thumb is to keep these concerns separate:

- **`AGENTS.md` and project instructions:** conventions that should apply broadly.
- **Skills:** reusable *how-to* procedures for specific tasks.
- **Custom agent profiles:** a specialized role, its tools and permissions, and optionally model or delegation settings.

Those are useful boundaries, not hard technical limits: agent profiles can contain instructions too, and the harness ultimately determines what permissions it enforces. If the default assistant plus instructions and skills already does the job, **you probably don't need a custom agent**.

For this experiment, the question is whether APM can move such a profile between harnesses **without losing the intended configuration**. See [GitHub's comparison of customization options](https://docs.github.com/en/copilot/concepts/customizations/comparing-customizations) and [Microsoft's description of an agent harness](https://learn.microsoft.com/en-us/agent-framework/concepts/harness) for the broader distinction.

## Experiment 1: Can one reviewer profile run in three harnesses?

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

I then ran the same review task in all three harnesses. Copilot and OpenCode let me select the reviewer directly; in Codex I asked the main agent to delegate to its generated reviewer subagent. The Codex trace showed a `custom_reviewer` subagent running, but that trace alone doesn't prove that every property of the generated TOML was applied.

| Check | Copilot | Codex | OpenCode |
| --- | --- | --- | --- |
| Agent profile generated | Pass | Pass | Pass |
| Review completed and bug found | Pass | Pass | Pass |
| Original source unchanged | Pass | Pass | Pass |
| Exact completion marker | Pass | Pass | Partial |

All three found the expected boundary bug and suggested the fix. OpenCode also ran tests in a scratch directory, although its final marker was missing the last character. These were individual functional tests, not a performance comparison. The full [Experiment 1 results](https://github.com/lfarci/agent-portability-lab/blob/main/docs/results/01-basic-portability.md) document the commands, findings, and Codex trace caveat.

Finally, I added one instruction to the canonical definition and reran APM. **The change propagated to all three generated files**, including Codex's TOML. For a simple, instruction-based reviewer, this was the workflow I wanted.

There was one minor quirk: APM 0.34.0's dry run reported no changes even though the actual install deployed the local agent.

## Experiment 2: What happens to tool restrictions?

The second experiment tested something more important than a shared prompt: **can APM preserve which tools an agent is allowed to use?**

I deliberately started with an **OpenCode-style boolean tool mapping**. [APM's agent-authoring documentation](https://microsoft.github.io/apm/producer/author-primitives/instructions-and-agents/) uses this shape in its example and explicitly documents that Copilot and OpenCode targets receive agent frontmatter **verbatim**, whereas Codex converts a limited set of fields.

That makes this a test of **APM's cross-harness transformation scope**, not an assumption that the input is already valid Copilot configuration or evidence of an unexpected APM regression.

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

APM generated the target files, but they didn't express equivalent restrictions. There is also a difference in what the targets mean by restricting tools: **Copilot's `tools` list controls tool availability**, while **OpenCode v2 has permission rules** that can allow, deny, or request approval for actions. These aren't interchangeable security contracts, and a valid configuration alone wouldn't prove runtime enforcement.

Here's a side-by-side view of the [canonical input](https://github.com/lfarci/agent-portability-lab/blob/main/.apm/agents/restricted-reviewer.agent.md) and the committed generated definitions:

| Canonical source | Copilot output | OpenCode v2 output | Codex output |
| --- | --- | --- | --- |
| `tools: {read: true, grep: true, edit: false, bash: false}` | [Same boolean mapping](https://github.com/lfarci/agent-portability-lab/blob/main/.github/agents/restricted-reviewer.agent.md); Copilot expects an array or string | [Same legacy mapping](https://github.com/lfarci/agent-portability-lab/blob/main/.opencode/agents/restricted-reviewer.md); no native `permissions` rules | [No `tools` field](https://github.com/lfarci/agent-portability-lab/blob/main/.codex/agents/restricted-reviewer.toml); APM warned it was dropped |

VS Code flagged the Copilot field's schema, OpenCode v2 didn't receive native permission rules, and Codex retained the review instructions but not the requested tool restrictions.

The Codex warning was particularly clear:

```text
Codex agent restricted-reviewer.agent.md:
frontmatter field 'tools' was dropped;
the agent may inherit all project/session MCP servers.
```

I also added a [small validator](https://github.com/lfarci/agent-portability-lab/blob/main/scripts/validate-experiment-02.py) to check the relevant generated fields. It reported **three incompatibility findings and one warning**. The full [Experiment 2 results](https://github.com/lfarci/agent-portability-lab/blob/main/docs/results/02-tool-restrictions.md) include the CLI warning and validation output.

This was a *static configuration test*. I didn't attempt to prove whether a harness would block editing at runtime. In particular, seeing a legacy OpenCode field doesn't establish how that field behaves. But the test was enough to show that **one canonical tool configuration did not become equivalent native restrictions across all three harnesses**.

### What about other agent-profile settings?

APM also documents [selective mappings for other fields](https://microsoft.github.io/apm/producer/author-primitives/instructions-and-agents/). It passes `model` through to Copilot and OpenCode and writes it into Codex TOML, **without translating model names**. A string `model_reasoning_effort` can be mapped into Codex TOML, while handoffs and other metadata may be copied or dropped depending on the target.

**I didn't test these fields.** The documentation reinforces the same distinction: converting a configuration field doesn't guarantee equivalent behavior across harnesses.

## Is APM planning to address this?

I checked APM's upstream discussions. [Issue #2108](https://github.com/microsoft/apm/issues/2108) proposes a broader model for portable agent semantics, but the maintainers explicitly **deferred** that work in a decision recorded in October 2026.

Their selected priority is [native plugin delivery (#3094)](https://github.com/microsoft/apm/issues/3094), while leaving room for smaller compatibility and security fixes. There's no committed release for a universal cross-harness permission translator.

That helps set expectations: APM is useful for distribution, but it isn't currently a guarantee that agent capabilities mean the same thing everywhere.

## My takeaway

I had been thinking about agent-profile portability for a few weeks before discovering APM. Finding a tool that already implemented part of that idea was exciting, and I genuinely enjoyed experimenting with it.

**But these results haven't convinced me to add APM to my projects just to share agent profiles.** For a basic reviewer persona, the benefit is mostly generating a few files that contain the same instructions. That's convenient, but probably not enough to justify another dependency when the equivalent setup is so simple.

The features that would make a translation layer really valuable to me are the harder ones: tools and permissions, model-specific settings, and possibly delegation. That's also where our experiment exposed the limitations. APM supports some field conversions, but it doesn't currently offer the level of cross-harness translation I was hoping to explore.

That doesn't mean APM is doing the wrong thing. **It's a package manager**, and distributing packages and plugins containing agent customizations is a useful problem to solve. The maintainers' focus on native plugin delivery makes sense. Translating advanced agent-profile semantics between vendors is a different, potentially much larger undertaking. I don't yet know what it would take to make that reliable enough to depend on.

So I'm not planning to build a competing tool or adopt APM for this particular use case right now. I'll keep an eye on other projects tackling profile portability. If nothing addresses the gap, I might eventually try a small lab project: take one canonical profile and experiment with transforming it into the native definitions of several harnesses, including their more advanced settings.

For now, the [agent-portability-lab](https://github.com/lfarci/agent-portability-lab) captures what I learned. **Sharing an agent's role is relatively easy. Sharing what that agent is actually allowed to do is much harder.**

### References

- [Microsoft APM](https://microsoft.github.io/apm/)
- [GitHub Copilot custom agents](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [OpenCode agents and permissions](https://opencode.ai/docs/agents/)
- [APM portable agent semantics discussion](https://github.com/microsoft/apm/issues/2108)
