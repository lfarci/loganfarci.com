---
title: "Model Context Protocol"
description: "Exploring the Model Context Protocol (MCP): A New Standard for AI Tool Integration"
publishedAt: "2025-07-02"
featured: true
tags: ["MCP", "AI"]
---

# Model Context Protocol

The Model Context Protocol (MCP) has been gaining significant attention across the AI development community. Major companies like GitHub, Microsoft, and Notion are rapidly releasing MCP servers, and the [official server list](https://github.com/modelcontextprotocol/servers) continues to expand.

This article explores what MCP is, how it works, and whether it represents a lasting solution to AI tool integration challenges. We'll examine the current ecosystem, discover available servers and clients, and understand how this protocol might shape the future of AI development.

## What is MCP?
Anthropic introduced the Model Context Protocol (MCP) in November 2024 through their [original announcement](https://www.anthropic.com/news/model-context-protocol). As of July 2025, MCP is still relatively new but gaining traction. Other influential companies are adopting it, including Microsoft, GitHub, OpenAI.

To understand MCP, the [official introduction](https://modelcontextprotocol.io/introduction) is an excellent starting point. It provides a detailed overview of the protocol, its architecture, and core concepts.

In essence, MCP is described as:

> _MCP is an open protocol that standardizes how applications provide context to LLMs. Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect your devices to various peripherals and accessories, MCP provides a standardized way to connect AI models to different data sources and tools._

Before MCP, integrating tools often relied on custom APIs or proprietary connectors, which were difficult to maintain and lacked standardization. This fragmented approach made seamless interactions between applications and AI models challenging.

## How agents invoke MCP tools

LLMs invoking external tools might seem magical, but it's all about clever orchestration. These models, at their core, are text generators. So, how do they interact with external tools?

To grasp how this works, it helps to understand the three core components described in the [Anthropic documentation](https://modelcontextprotocol.io/docs/concepts/architecture):

- **Host**: The application containing the LLM (like GitHub Copilot Agent Mode)
- **Client**: The component that implements the MCP protocol within the host
- **Server**: The process that provides tools, resources, or prompts to the client

The [protocol documentation](https://modelcontextprotocol.io/docs/concepts/architecture) explains this interaction flow in detail, and the [message flow diagram](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#message-flow) provides a helpful visual understanding.

Let's trace through what happens when I ask GitHub Copilot "What are the recent issues in my repository?" using the [GitHub MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/github):

1. **The host** (Visual Studio Code) receives my natural language request
2. **The client** within Visual Studio Code translates this into an MCP tool call
3. **The server** processes the MCP tool call and calls the GitHub API with the appropriate parameters
4. **The server** returns structured data back to the client
5. **The host** formats this into a readable response

What's compelling about this architecture is that the same GitHub server can work with any MCP-compatible host. Whether I'm using Claude Desktop, Visual Studio Code, or building a custom application, the server implementation remains unchanged.

[Kiran Prakash](https://www.linkedin.com/in/kiran-prakash)'s article on [function calling using LLMs](https://martinfowler.com/articles/function-call-LLM.html) provides deeper insight into this process. It covers how agents invoke functions and [connects this concept to MCP](https://martinfowler.com/articles/function-call-LLM.html#HowFunctionCallingRelatesToMcpModelContextProtocol)'s tool invocation model, explaining how function calling integrates with the MCP architecture.

I also recommend reading [What Is MCP, and Why Is Everyone Talking About It?](https://huggingface.co/blog/Kseniase/mcp) from [Ksenia Se](https://www.linkedin.com/in/ksenia-se/). This article is honestly very complete.

## Discovering MCP servers

The MCP ecosystem is rapidly expanding, with servers appearing across different domains and use cases. Rather than attempting to maintain a comprehensive catalog (which would quickly become outdated), I'll focus on the primary discovery sources.

### Anthropic

The [Model Context Protocol GitHub organization](https://github.com/modelcontextprotocol) serves as the central hub for development and discovery. The [`servers` repository](https://github.com/modelcontextprotocol/servers) provides the most curated collection of implementations, from reference examples to production-ready solutions.

### Microsoft
Microsoft is already providing MCP servers for some of their products. They are maintaining a list of MCP servers in the [`microsoft/mcp`](https://github.com/microsoft/mcp) repository.

I work daily with Visual Studio Code, so I was particularly interested in how MCP integrates with GitHub Copilot. The VS Code documentation provides an updated list of [MCP servers for agent mode](https://code.visualstudio.com/mcp), which serves as a good entry point.

### Community
Besides the official sources, many community-driven MCP servers are emerging. I'm currently using [`punkpeye/awesome-mcp-servers`](https://github.com/punkpeye/awesome-mcp-servers), which includes a curated server list available in English, Japanese, Thai, and Portuguese. They've also set up a [web portal](https://glama.ai/mcp/servers) for easier browsing.

### Future of server discovery

The [MCP development roadmap](https://modelcontextprotocol.io/development/roadmap#registry) identifies server distribution and discoverability as key priorities. An [active community discussion](https://github.com/orgs/modelcontextprotocol/discussions/159) explores various approaches to improving server discovery, with several community-driven indexing initiatives already emerging.

## MCP clients

While exploring MCP servers, I discovered the client ecosystem is more diverse than I initially expected. Understanding this landscape helps identify where MCP fits into different development workflows. 

The [official client directory](https://modelcontextprotocol.io/clients) reveals surprising breadth beyond Anthropic's applications. While Claude Desktop, Claude.ai, and Claude Code represent mature implementations, the community has developed clients for platforms I didn't anticipate. [`mcp.el`](https://github.com/lizqwerscott/mcp.el) is a good example as it offers MCP support for Emacs. Some new AI powered IDEs are also gaining a lot of traction, such as [Cursor](https://docs.cursor.com/context/model-context-protocol) and [Windsurf](https://windsurf.com/editor).

### Feature support
The [feature support matrix](https://modelcontextprotocol.io/clients#feature-support-matrix) shows that complete MCP specification support remains limited. Currently, only [`fast-agent`](https://llmindset.co.uk/resources/fast-agent/) and GitHub Copilot Agent Mode support the full specification. This fragmentation suggests opportunities for developers. You can contribute more complete implementations or identify which features matter most for specific use cases.

### Building custom clients

The protocol's openness enables custom development using multi-language SDKs. For .NET developers, Microsoft provides excellent resources:

- [Create a minimal MCP client using .NET](https://learn.microsoft.com/en-us/dotnet/ai/quickstarts/build-mcp-client) 
- [Integrating MCP Tools with Semantic Kernel](https://devblogs.microsoft.com/semantic-kernel/integrating-model-context-protocol-tools-with-semantic-kernel-a-step-by-step-guide/)

These resources open possibilities for custom AI applications that leverage the growing server ecosystem.

## Final thoughts

MCP represents a significant step toward standardizing AI tool integration. While still young, the protocol shows promise thanks to its breadth of support and the active community building around it.

The rapid adoption by major players like Microsoft, combined with strong community engagement, suggests MCP is likely here to stay. For developers, this presents an opportunity to build tools that work across multiple AI platforms rather than being locked into proprietary ecosystems.

As the protocol matures and more clients support the full specification, we can expect MCP to become as fundamental to AI development as REST APIs are to web development today.

## Next steps

If you're interested in exploring MCP, here's my personal approach:

1. **Start as a user**: Try existing MCP servers with your client of choice to understand the user experience. I will be experimenting with GitHub Copilot Agent Mode in Visual Studio Code.
2. **Explore the ecosystem**: Browse the [official servers repository](https://github.com/modelcontextprotocol/servers) to see what's available.
3. **Build something**: Create a simple MCP server for a tool you use daily, or contribute to existing community projects