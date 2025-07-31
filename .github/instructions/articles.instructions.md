---
applyTo: "content/articles/*.md"
---

# Custom Instructions for Personal Website Articles

## Content Guidelines

### Writing Style

-   Write in a clear, direct tone for a technical audience of developers
-   Assume familiarity with common development concepts and tools
-   Use active voice and concise sentences
-   Stay laser-focused on the specific topic - avoid tangents or broad overviews
-   Include practical, working code examples that developers can immediately use
-   Structure content with clear headings that follow a logical progression
-   Aim for concise articles (500-1200 words) that deliver specific value quickly
-   Avoid using the — character generally, prefer using a comma or period for clarity.

### Technical Content

-   Lead with working code examples and practical implementation
-   Include minimal setup instructions - assume developers can handle basic setup
-   Focus on the "how" and "why" specific to your chosen topic
-   Avoid explaining fundamental concepts unless directly relevant
-   Link to official documentation rather than re-explaining basics
-   Use real-world examples from actual projects when possible
-   Stay within the scope of your title - resist the urge to cover related topics

### Focus and Scope

-   Each article should solve one specific problem or explain one specific concept
-   If you find yourself explaining multiple loosely related topics, consider splitting into separate articles
-   Use the "one main takeaway" rule - readers should leave with one clear, actionable insight
-   Avoid "comprehensive guides" - instead write focused pieces that go deep on narrow topics

### SEO and Discoverability

-   Include relevant keywords naturally throughout the content
-   Use descriptive headings that could serve as search queries
-   Add alt text for images and diagrams
-   Consider including a brief introduction that summarizes the article's value

## Front Matter Requirements

All articles must include the following YAML front matter at the beginning:

```yaml
---
title: "[Descriptive Title]"
description: "[1-2 sentence summary of the article's content and value]"
publishedAt: "[YYYY-MM-DD format]"
featured: [true/false]
tags: ["tag1", "tag2", "tag3"]
author: "Logan Farci"
coauthoredWithAgent: [true/false]
---
```

### Front Matter Field Guidelines

**title**:

-   Be specific about what the article covers (e.g., "Setting up GitHub MCP Server" vs "GitHub Integration")
-   Keep under 60 characters for SEO
-   Use title case
-   Focus on the specific problem solved or concept explained

**description**:

-   120-160 characters for optimal SEO
-   Should clearly state what specific problem this solves or what the reader will learn to do
-   Avoid vague descriptions - be precise about the value delivered

**publishedAt**:

-   Always use YYYY-MM-DD format
-   Use the actual publication date

**featured**:

-   Set to `true` for articles you want to highlight on your homepage
-   Use sparingly to maintain exclusivity

**tags**:

-   Include 2-5 relevant tags
-   Use consistent tag naming (check existing articles for established tags)
-   Focus on topics, technologies, and themes
-   Common tags based on examples: "MCP", "AI", "GitHub", "Copilot"

**author**:

-   Always use "Logan Farci" by default

**coauthoredWithAgent**:

-   Set to `true` if AI tools significantly contributed to writing or research
-   Set to `false` if you wrote the article independently

## Content Structure Template

````markdown
---
[front matter here]
---

[One paragraph that clearly states the specific problem/topic and what the reader will accomplish]

## [Implementation/Solution Section]

[Jump directly into the main content with code examples]

```language
// Working code example
```
````

[Brief explanation of what the code does and why]

## [Key Details/Configuration Section]

[Cover important details, gotchas, or configuration options]

## [Usage/Next Steps]

[Show how to use what was built, or immediate next actions]

---

_[Optional: Link to related focused articles or relevant documentation]_

```

## Quality Checklist

Before publishing, ensure:
- [ ] Front matter is complete and properly formatted
- [ ] Title clearly indicates the specific topic covered
- [ ] Article stays focused on one main concept/problem throughout
- [ ] Code examples are tested, functional, and immediately usable
- [ ] Content assumes appropriate developer knowledge level
- [ ] No unnecessary tangents or broadly related topics
- [ ] Article delivers on the promise made in the title and description
- [ ] Links point to official docs rather than explaining basics
- [ ] Reader can implement/understand the concept after reading
- [ ] Tags accurately reflect the specific technologies/concepts covered
```
