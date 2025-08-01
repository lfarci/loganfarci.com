---
title: "I made GitHub Copilot my writing assistant"
description: "In this article, I share how I customized GitHub Copilot to enhance my writing workflow for technical articles on my personal website."
publishedAt: "2025-07-25"
featured: true
tags: ["GitHub Copilot", "Visual Studio Code"]
author: "Logan Farci"
coauthoredWithAgent: true
---

This website is my technical workspace—a place to document findings, experiments, and lessons learned for myself and other developers. I use it to publish focused articles about current projects or topics I’m exploring, knowing the content will evolve over time. My goal is to keep these notes clear and actionable, whether for my own reference or for anyone else who finds them.

While writing my first two articles ([MCP fundamentals](https://www.loganfarci.com/articles/mcp) and [GitHub MCP Server](https://www.loganfarci.com/articles/github-mcp-server)), I found GitHub Copilot surprisingly effective as a collaborator. It helped me:

-   Scaffold new articles and enforce the required front matter format
-   Catch spelling and grammar issues
-   Refine tone and style for technical clarity
-   Review drafts and provide actionable feedback

However, I quickly noticed a recurring problem: I was repeating the same instructions to Copilot in every session. My most common prompts were things like `Enhance this specific section and make it smoother`, `Update the article description and title`, or `Remove duplication across the article`. These requests were short and lacked context, making it impractical to provide full background each time. Copilot works best when it has the complete picture.

# Customizing GitHub Copilot

You can tailor GitHub Copilot's responses by adding version-controlled instructions and reusable prompts directly to your repository. Create markdown files that specify exactly how you want Copilot to behave for your workflows. This approach lets you define global instructions, task-specific rules, reusable prompts, and even custom chat modes. For details, see the official [Customize AI responses](https://code.visualstudio.com/docs/copilot/copilot-customization) documentation.

## Features

In this article, I focus on the GitHub Copilot customization features supported in Visual Studio Code because this is currently my primary development environment.

### Custom Instructions

[Custom instructions](https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions) let you define persistent, version-controlled guidelines for Copilot. These instructions are included in every chat session, enforcing standards for structure, tone, and formatting.

For teams, storing instructions in your repository creates a single source of truth that evolves with your workflow. New members can quickly adopt conventions, and Copilot consistently follows client requirements or style guides without manual repetition.

You can also enforce technology-specific best practices for your stack. The open-source community maintains lists of reusable instructions, such as [Awesome Copilot Instructions](https://github.com/Code-and-Sorts/awesome-copilot-instructions), which you can adapt for your projects.

### Reusable Prompts

[Reusable prompts](https://code.visualstudio.com/docs/copilot/copilot-customization#_prompt-files-experimental) Create parameterized prompts that can be reused across different sessions. They can reference the custom instructions and improve efficiency by avoiding repetitive explanations. For example, you can create a prompt for reviewing articles that references all the necessary context and guidelines.

### Chat Modes

[Custom chat modes](https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-chat-modes)

## Instructions library

GitHub maintains a repository with community-driven configuration for Copilot: [Awesome GitHub Copilot Customizations](https://github.com/github/awesome-copilot). It's a great source of instructions for various technologies. I didn't find any specific instructions for technical writing, but browsing existing examples really helped drafting a practical outline. See also the Microsoft blog post: [Introducing the Awesome GitHub Copilot Customizations repo](https://devblogs.microsoft.com/blog/introducing-awesome-github-copilot-customizations-repo) regarding this repository.

# My Customizations

I've adopted these features to streamline and improve my workflow on this personal website. The idea is to leverage Copilot's customization features to improve the quality and consistency of my articles without having to repeat myself like described in the introduction.

```mermaid
graph TD
    A[Custom Instructions<br/>.github/instructions/articles.instructions.md] --> B[Scoped to content/articles/*.md]
    C[Reusable Prompts<br/>.github/copilot/prompts/]

    B --> E[Copilot Chat Sessions]
    C --> E

    E --> F[Consistent Article Writing]
    E --> G[Standardized Reviews]
    E --> H[Automated Scaffolding]

    A -.->|Provides Context| C

    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style E fill:#fff3e0
```

# Instructions

One of the first challenges I faced was having to repeat the same instructions to Copilot across different sessions and prompts. For example, if I wanted Copilot to improve a section, I’d type something like: `Improve the readability and clarity of the section about X.` Copilot would make the edit, and I’d review it. But for more targeted changes, I had to explain my intent in detail every time. This quickly became tedious and didn’t scale.

The solution is to define persistent, version-controlled instructions using markdown files. [Custom instructions](https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions) make this possible.

I created a file called `.github/instructions/articles.instructions.md` in my repository. It contains all the guidelines and templates I want Copilot to follow when working on articles. This file is scoped to all Markdown files in the `content/articles` directory. Here’s a simplified example:

> [!NOTE]  
> This is a simplified version of the instructions file used in this repository. The full version is available here: [articles.instructions.md](https://github.com/lfarci/loganfarci.com/blob/main/.github/instructions/articles.instructions.md).

```markdown
---
applyTo: "content/articles/*.md"
---

# Article Instructions

## Article Guidelines

-   Write for developers: clear, direct, and concise
-   Focus on one specific problem or concept per article
-   Use active voice and practical code examples
-   Structure with logical headings and minimal setup
-   Avoid tangents and broad overviews
-   Lead with code and practical implementation
-   Link to official docs for basics

## Front Matter

title: "[Specific Title]"
description: "[1-2 sentence summary]"
publishedAt: "[YYYY-MM-DD]"

## \`\`\`yaml

title: "[Specific Title]"
description: "[1-2 sentence summary]"
publishedAt: "[YYYY-MM-DD]"

---

\`\`\`

-   **title**: Use title case and be descriptive about the article content
-   **description**: Summarize the article's value in 1-2 sentences
-   **publishedAt**: Use YYYY-MM-DD format for consistency

## Structure Template

## \`\`\`markdown

## [front matter]

[Intro: what problem is solved]

## [Solution]

\`\`\`language
// Code example
\`\`\`

[Brief explanation]

## [Key Details]

[Important notes/config]

## [Usage]

[How to use or next steps]

---

_[Optional: links to docs or related articles]_
\`\`\`

## Checklist

-   [ ] Front matter complete
-   [ ] Title is specific
-   [ ] Focused on one topic
-   [ ] Code is tested and usable
-   [ ] No unnecessary tangents
-   [ ] Links to official docs
-   [ ] Tags are accurate
```

This custom instructions file provides the detail needed to enforce style and rules. It serves as a single source of truth for how Copilot should handle article writing in this repository. Because it’s scoped to the articles directory, you can have different instructions for different parts of your project if needed.

This approach standardizes Copilot’s behavior for your articles, ensuring consistent edits and reviews without restating your requirements each time.

The goal is to provide clear, actionable guidance to Copilot on the article writing process.

# Reusable Prompts

Reusable prompts are especially useful when you find yourself repeating the same instructions. This was particularly helpful when experimenting with the GitHub MCP Server. This feature allows you to create a parameterized prompt that can be reused across different tasks. For example, I created a reusable prompt for reviewing articles in my repository:

```markdown
mode: "agent"
model: GPT-4.1
tools: ["codebase", "Microsoft Docs"]
description: "Review a technical article in the loganfarci.com repository"

# Context

# Role

Act as a sceptical technical article reviewer and question the content of the article submitted for review. Provide feedback on the article's content, structure, and clarity. If the article is well-written and informative, approve it. If it requires significant changes or does not meet the standards, reject it with specific reasons for rejection.

Refer to the [Article Review Instructions file](../instructions/articles.instructions.md) for all formatting, templates, and conventions.
```

I can then use this prompt in my tasks by providing the article name as a parameter. This saves time and ensures consistency in my reviews.

```
/article.review article=my-awesome-article.md
```

Reusable prompts let you define a template once and reuse it for similar tasks. For example, to review articles, you can create a simple prompt like:

```markdown
---
description: "Review a technical article"
---

Review the article at articles/${input:article} for clarity and accuracy.
```

You can then use this prompt by passing the article name as a parameter:

```
/article.review article=my-article.md
```

This approach saves time and keeps your reviews consistent.

For more examples, see [Awesome GitHub Copilot Customizations](https://github.com/github/awesome-copilot) or [Awesome Copilot Instructions](https://github.com/Code-and-Sorts/awesome-copilot-instructions).
