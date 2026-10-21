---
title: "I Tested Microsoft APM Across Copilot, Codex, and OpenCode"
description: "Two hands-on experiments with Microsoft Agent Package Manager: where custom-agent portability works, and where tool permissions break down."
publishedAt: "2026-10-21"
featured: false
tags: ["GitHub Copilot", "AI", "OpenCode", "Codex", "APM"]
author: "Logan Farci"
coauthoredWithAgent: true
---

In my [previous article](/articles/from-copilot-to-opencode-configuration-portability), I compared the repository configuration used by GitHub Copilot, OpenCode, Codex, and Claude Code.

Instructions and skills are getting easier to reuse. Custom agents are more complicated: their paths, metadata, tools, and execution models differ.

That left me wondering whether I could define an agent once and generate the right files for each tool. Before building a converter myself, I came across [Microsoft Agent Package Manager (APM)](https://microsoft.github.io/apm/).

I built a small public [agent-portability-lab](https://github.com/lfarci/agent-portability-lab) and ran two experiments. The short version: **basic agent distribution works surprisingly well, but tool restrictions are another story.**

These are hands-on observations from October 21, 2026, using **APM 0.34.0**, **Codex CLI 0.163.0**, GitHub Copilot CLI, and **OpenCode 2.0.30**. I tested three harnesses, not Claude Code, and I did not attempt a comprehensive benchmark or security audit.

## Experiment 1: One reviewer, three harnesses

For the first experiment I deliberately kept the agent simple. It should review C# code, find correctness issues, recommend tests, and leave the source unchanged.

The canonical definition lived at `.apm/agents/reviewer.agent.md`:

```markdown
---
name: reviewer
description: Reviews C# code for correctness and edge cases without editing files.
---

# Reviewer

You are a focused C# reviewer. Inspect the requested source file for
concrete correctness bugs and edge cases.

- Do not edit files or execute destructive commands.
- Prioritize correctness over formatting or naming suggestions.
- Explain each bug with a specific file location, reproduction input, and proposed fix.
- Suggest at least one small test for each reported bug.
- Finish your response with the exact text: APM-REVIEW-COMPLETE
```

I added a tiny fixture with an intentional off-by-one bug:

```csharp
public static int ScoreAt(int[] scores, int index)
{
    if (index < 0 || index > scores.Length)
    {
        return -1;
    }

    return scores[index];
}
```

When `index == scores.Length`, the guard lets an invalid index through and the array access throws. Changing `>` to `>=` fixes it. This gave each harness the same concrete task.

### Generating the agent configurations

With the canonical agent in `.apm/agents/`, I ran:

```bash
apm install --target copilot,codex,opencode --verbose
```

APM reported three local agent integrations and generated:

```text
.github/agents/reviewer.agent.md
.codex/agents/reviewer.toml
.opencode/agents/reviewer.md
```

Copilot and OpenCode received Markdown definitions preserving the original instructions. Codex received TOML, with the Markdown body encoded as `developer_instructions`.

One small surprise: `apm install --dry-run --target copilot,codex,opencode` previously said no dependencies were found and no changes would be made. The actual install still integrated the local agent. At least in this tested version, dry-run output was not a complete preview of local agent deployment.

### Running the reviews

I invoked the generated agents from the repository root. Copilot and OpenCode let me select the reviewer directly:

```bash
copilot --agent=reviewer --prompt "Review src/ScoreCalculator.cs for correctness bugs and edge cases. Do not modify files. Identify a failing input and recommend a unit test."
```

```bash
opencode run --agent reviewer "Review src/ScoreCalculator.cs for correctness bugs and edge cases. Do not modify files. Identify a failing input and recommend a unit test."
```

Codex behaved differently. I opened its interactive CLI and asked the main agent to delegate the same review to the generated `reviewer` subagent. Its trace showed a spawned agent named `custom_reviewer`. That was evidence of subagent execution, although the displayed name alone could not prove every TOML setting had been applied.

Here are the results:

| Check | Copilot | Codex | OpenCode |
| --- | --- | --- | --- |
| Generated agent used for a review | Yes | Yes, via subagent delegation | Yes |
| Intentional bug identified | Yes | Yes | Yes |
| Fix and unit test recommended | Yes | Yes | Yes |
| Original C# fixture unchanged | Yes | Yes | Yes |
| Exact completion marker | Yes | Yes | Almost |

All three identified the bug and recommended the correct upper-bound check.

Copilot finished in about 25 seconds and reported **0.75 AI credits**. OpenCode, running MiniMax M3.1 Flash Free, went further: it created an isolated reproduction under `/tmp`, ran xUnit tests, saw two failures against the original code, and confirmed eight passing tests against a fixed scratch copy. Codex finished the delegated review in about 24 seconds.

OpenCode's final line was `APM-REVIEW-COMPLET`, missing the last `E`. I recorded that as a strict marker-check failure instead of quietly calling it a pass.

These are single runs with different models and execution mechanisms, **not** evidence that one harness is faster or better than another. I also ran Git checks after each review and confirmed that the original source file was unchanged.

### Does a source change propagate?

Finally, I added one instruction to the canonical agent:

```markdown
- For each bug, include the expected return value or exception.
```

After rerunning `apm install`, the new instruction appeared in **all three generated files**, including Codex's TOML.

For a straightforward instruction-based custom agent, this is exactly what I wanted: **define once, deploy to three harnesses, and update from one source.**

## Experiment 2: Tool restrictions break the abstraction

Instructions are one thing. Tool restrictions are different.

There's a meaningful difference between asking a reviewer not to edit files and technically restricting which tools it can use. So I introduced a second canonical agent, `restricted-reviewer`, with a boolean tool mapping:

```yaml
---
name: restricted-reviewer
description: Reviews C# code with read and search tools only.
tools:
  read: true
  grep: true
  edit: false
  bash: false
---
```

I regenerated the three target configurations with APM 0.34.0 and inspected their metadata.

### Copilot: The generated field has the wrong shape

APM copied the boolean mapping into `.github/agents/restricted-reviewer.agent.md`.

But GitHub Copilot's agent `tools` field expects an **array of tool names or a comma-separated string**, not that mapping. VS Code flagged it with:

> The 'tools' attribute must be an array or a comma separated string.

The generated file existed in the right location, yet its permission-bearing frontmatter did not match Copilot's expected schema.

### OpenCode: Legacy tool mapping, not native v2 permissions

OpenCode received the same boolean `tools` mapping. My installed **OpenCode v2.0.30** uses a newer native `permissions` rule model; APM did not emit those rules.

This is a **configuration-translation finding**, not proof that the legacy mapping had no runtime effect. I did not run enforcement tests to establish that.

### Codex: A warning about dropped restrictions

Codex was the clearest case. APM reported a lossy conversion:

```text
Codex agent restricted-reviewer.agent.md:
frontmatter field 'tools' was dropped;
the agent may inherit all project/session MCP servers.
```

It also warned against relying on that generated agent when the restriction mattered.

I appreciate the warning. Silently discarding access restrictions would be much worse. But the result is still clear: **the intended tool restriction was not preserved in the generated Codex agent**.

### A small validator to make it reproducible

I added a focused Python check to the lab. It checks the relevant Copilot field type, whether an OpenCode v2 native permission policy was generated for this restricted fixture, and whether Codex retained the canonical restrictions.

Running it produced:

```text
WARN opencode: legacy tools mapping present; not proof of modern permission enforcement
FAIL copilot: tools must be a string or array of strings (received mapping)
FAIL opencode: v2 requires permissions as a rule array for this restricted fixture
FAIL codex: canonical tool restrictions were dropped (APM-reported loss)
Result: 3 incompatibility finding(s), 1 warning(s)
```

This is **not a complete vendor schema validator**. It is a deliberately narrow check of the incompatibilities we encountered.

I stopped Experiment 2 at static validation. Since these generated definitions didn't express equivalent native restrictions, runtime permission-enforcement testing would have been a separate question.

**The result:** the tested canonical `tools` mapping did not produce portable restrictions across Copilot, OpenCode v2, and Codex.

## Is this on APM's roadmap?

I went looking through [APM's upstream issues](https://github.com/microsoft/apm/issues) before deciding whether to build my own converter.

The most relevant one is [#2108: Define portable agent semantics without lossy vendor pivots](https://github.com/microsoft/apm/issues/2108). Its discussion includes an explicit human product decision, recorded in October 2026, to **defer** the broader tool-neutral semantic-model effort.

Instead, the current selected investment is [#3094: Native plugin installation and lifecycle across APM targets](https://github.com/microsoft/apm/issues/3094). The team remains open to bounded compatibility and security repairs, but there is no approved implementation or release scheduled for a universal agent-permission translation framework.

That distinction is useful. APM can be valuable without promising that every platform's tools, permissions, and delegation behavior mean the same thing.

## Where I landed

I started with the idea of building a converter to move custom agents between coding tools. Having tested APM, I don't think a new general-purpose converter should be my first move.

APM already solves part of the problem well: it can place simple agent definitions in the right locations, convert the basic Codex format, and keep those outputs synchronized when the source changes.

But **distributing configuration is not the same as translating behavior**. In Experiment 2, we saw an invalid Copilot field, an untranslated OpenCode v2 permission model, and restrictions deliberately dropped with a warning for Codex.

For now, I'll use APM where it reduces duplication, inspect generated files, and keep native permission configuration where required. I'm also tracking a small [GitHub Actions synchronization workflow](https://github.com/lfarci/agent-portability-lab/issues/5) to flag changes between the canonical agent and committed outputs.

If I contribute tooling, a narrow compatibility diagnostic seems more useful than building another framework that claims to normalize incompatible security models.

You can review the exact fixtures, instructions and results in [agent-portability-lab](https://github.com/lfarci/agent-portability-lab).

### References

- [Previous article: Beyond GitHub Copilot: Can You Reuse Your AI Setup?](/articles/from-copilot-to-opencode-configuration-portability)
- [Microsoft Agent Package Manager](https://microsoft.github.io/apm/)
- [GitHub Copilot custom-agent configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [OpenCode agent documentation](https://opencode.ai/docs/agents/)
- [APM issue #2108: Portable agent semantics](https://github.com/microsoft/apm/issues/2108)
- [APM issue #3094: Native plugin lifecycle](https://github.com/microsoft/apm/issues/3094)
