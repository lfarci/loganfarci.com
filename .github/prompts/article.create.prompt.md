---
mode: "agent"
model: GPT-4.1
tools: ['codebase', 'editFiles']
description: "Create a new article and start writing it"
---

# Context

-   Topic: ${input:description}.
-   Title: ${input:title} or generate a title based on the topic.
-   Tags: ${input:tags} or generate tags based on the topic.

# Task

- Scaffold a new article in the `content/articles` directory.
- Name the file using the title in kebab-case format (e.g., `my-new-article.md`).
- If the title is more than 20 characters, make the file name shorter using acronyms or abbreviations.
- If no title is provided, generate one that reflects the article's content.
- The article should follow the front matter schema defined in the [Articles Instructions](../instructions/articles.instructions.md).
- Leave the content section empty for now, but include a placeholder comment indicating where the article content will go.