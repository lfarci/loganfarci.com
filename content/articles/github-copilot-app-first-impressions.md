---
title: "First Impressions of the GitHub Copilot App"
description: "My early take on the GitHub Copilot app, from smoother session switching to first-class issue and pull request workflows."
publishedAt: "2026-06-10"
featured: false
tags: ["GitHub Copilot", "GitHub", "AI"]
author: "Logan Farci"
coauthoredWithAgent: true
---

I have been using the GitHub Copilot app for a few days, and my first impression is simple: this feels like a real workflow shift. Not because the agent suddenly writes perfect code, but because the app removes a lot of the manual workspace management around agentic development.

This is not a full review. It is my early view after trying it in the flow of real work.

## The Missing Center

The way I see it, the GitHub Copilot app is a dedicated place to manage coding sessions, repositories, GitHub issues, and pull requests with an agent in the loop. It brings together things that were already possible with Git, GitHub, VS Code, and Copilot Chat, but makes them feel like one product instead of a chain of manual steps.

That central place was missing in my workflow. From the app, I can follow the issue or pull request, quickly trigger VS Code when I need the full editor, and still use an embedded terminal when the task needs a command-line check.

Everything I need is integrated and accessible from one place. That makes the app feel less like another tool and more like the coordination layer around my agentic workflow.

## More Than Background Automation

GitHub describes the broader capability as [Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent), an agent that can work on tasks in the background, create branches, make changes, and open pull requests.

That control matters. Agentic work is not just "ask once and wait". It is usually a loop: start a task, inspect the direction, adjust the prompt, review the diff, comment on a pull request, resolve some conflict, and continue. The app makes that loop much more visible.

## The Workflow It Replaces

Before trying this, my workflow already relied heavily on worktrees and Copilot. I would manage multiple sessions from the terminal using Woktrunk, or `wt`, my worktree helper. I would jump from one worktree to another, open VS Code into the right folder, then rely on Copilot Chat to get things done in that specific context.

That worked, but it had a lot of ceremony:

-   Create or select the right worktree
-   Move into the correct directory
-   Open the right VS Code window
-   Rebuild context in Copilot Chat
-   Keep track of which branch, issue, or pull request belonged to which session

None of those steps are hard individually. The problem is that they add up. When you work across features, reviews, experiments, and fixes, the real cost is not the Git command. The cost is the constant context switching.

## Session Switching Finally Feels Seamless

The biggest improvement is not one specific button. It is the overall feeling that session switching has become smooth.

In my previous setup, I was always aware of the plumbing. Which worktree am I in? Which branch is this? Did I open the right VS Code window? Is this Copilot Chat still aligned with the task I care about? The app does not remove Git or branches from the workflow, but it reduces how often I need to think about them directly.

That changes the mental model. Instead of "I need to open this repo, switch to that worktree, then continue the conversation", it becomes "I need to go back to that session".

That sounds small, but it is exactly the kind of abstraction I want from developer tooling. The best tools hide the repetitive parts and keep the parts that need judgment visible.

## Pull Requests Feel Like a Primitive Now

I really like how issues and pull requests are not treated as external artifacts. They are part of the workflow. A pull request is not just the thing the agent creates at the end. It becomes a primitive you can inspect, review, and use to steer the work.

That is a big deal. I can review the PR content while working on a feature, check what changed, and keep the agent connected to the actual review surface.

Some examples that stood out to me:

-   The pull request content is directly available while the session is active
-   Review comments on the PR can trigger the agent to pick up follow-up work
-   Conflict resolution can be surfaced as an explicit action, like a conflict solve button, instead of a separate manual detour
-   The UI gives me control points without forcing me to leave the agent workflow

This is where the app starts to feel more than a wrapper around chat. The PR becomes the collaboration object between me, GitHub, and the agent.

## The Enterprise Caveat

The only frustrating part so far was trying to use it with GitHub Enterprise in my current client context.

I wanted to try the same experience there, but the setup did not seem to support it correctly. I could not select the model. It was stuck on Auto, then failed because it could not find the model. I am not sure if this was a bug, a configuration issue, or a limitation of the current Enterprise setup.

For now, I am treating this as an early rough edge, not as a reason to dismiss the product.

## My Early Take

Honestly, I am pretty positive about this app.

The main win is not that Copilot can work on a branch. I already had ways to combine Git worktrees, VS Code, and Copilot Chat. The win is that the app streamlines the whole session switching process and makes the workflow coherent.

It reduces the manual work around repository and worktree management. It makes GitHub issues and pull requests feel native to the agent experience. It gives me useful UI control without taking away the ability to inspect what is happening.

After only a few days, it already feels like the direction I want my workflow to go. If the rough edges around Enterprise support improve, I can easily imagine this becoming my daily companion for agentic development.

## References

-   [About Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent)
-   [GitHub Copilot coding agent public preview](https://github.blog/changelog/2025-05-19/github-copilot-coding-agent-in-public-preview/)
-   [Use Copilot cloud agent on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github)
-   [Manage and track agent sessions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents)
-   [Change the AI model for Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/changing-the-ai-model)
