---
title: "How MCP Tool Calls Work"
description: "Understand how an MCP request becomes a tool call by tracing host, client, server, discovery, and JSON-RPC steps from prompt to result."
publishedAt: "2025-07-02"
featured: true
tags: ["MCP", "AI"]
author: "Logan Farci"
coauthoredWithAgent: true
---

The Model Context Protocol (MCP) is easiest to understand when you follow one request from chat prompt to tool result.

This article focuses on that path: how an AI application discovers MCP tools, asks a server to run one, and turns the result into an answer. It does not try to catalog the whole MCP ecosystem.

## The three parts of MCP

Anthropic introduced MCP in November 2024 through its [launch announcement](https://www.anthropic.com/news/model-context-protocol). The current [official introduction](https://modelcontextprotocol.io/introduction) describes MCP as a standard way for AI applications to connect to tools and data sources.

The most useful mental model is the [official architecture](https://modelcontextprotocol.io/docs/concepts/architecture):

- **Host:** The AI application the user interacts with, such as Visual Studio Code, Claude Desktop, Cursor, or Claude Code.
- **Client:** The connector inside the host that manages one MCP server connection.
- **Server:** The program that exposes tools, resources, or prompts to the client.

The distinction between host and client matters. Visual Studio Code is the host. If it connects to a GitHub MCP server and a filesystem MCP server, it creates separate MCP client connections for each server.

## What the server actually exposes

MCP servers can expose several primitives, but tools are the important one for this article. The [server concepts documentation](https://modelcontextprotocol.io/docs/learn/server-concepts) describes tools as **model-controlled** actions. That means the language model decides whether a tool is relevant based on the tool name, description, and input schema made available by the host.

For example, a server might expose a weather tool like this:

```json
{
  "name": "get_weather",
  "description": "Get current weather information for a location",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string"
      }
    },
    "required": ["location"]
  }
}
```

The schema is not just documentation. It is the contract the model uses to decide what arguments to provide when the host asks the server to call the tool.

## From prompt to tool call

Imagine asking an MCP-enabled editor: "What are the recent issues in my repository?"

The flow looks like this:

1. **The host receives the prompt.** The user asks the question in the AI application.
2. **The client has already discovered tools.** During setup, the MCP client asks connected servers what tools they provide.
3. **The model chooses a tool.** The host gives the model the prompt and available tool schemas. The model decides whether one of those tools fits the request.
4. **The client sends a tool call.** If a tool is selected, the client sends a JSON-RPC `tools/call` request to the server.
5. **The server runs the action.** The server calls the underlying API or local capability and returns structured content.
6. **The host answers the user.** The result goes back into the model context so the host can produce a readable answer.

The [tools documentation](https://modelcontextprotocol.io/docs/concepts/tools) shows the JSON-RPC shape. A call can be as simple as:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "Brussels"
    }
  }
}
```

That is the core of MCP tool invocation. The model does not directly call the external service. It proposes a structured tool call, the MCP client sends it to the server, and the server performs the work.

## Where transport fits

MCP separates the protocol messages from the way they are transported. The [transport documentation](https://modelcontextprotocol.io/docs/concepts/transports) currently highlights two common options:

- **stdio:** The host launches a local server process and communicates over standard input and output.
- **Streamable HTTP:** The host connects to a remote server over HTTP, with optional streaming.

This separation is why the same server concept can work in local developer tooling and remote hosted integrations. The host/client/server roles stay the same even when the transport changes.

## Why this architecture is useful

Before MCP, each AI application needed custom integrations for each external tool. MCP reduces that integration work by standardizing the contract between AI hosts and tool servers.

The practical takeaway is simple: when you add an MCP server, you are not teaching the model a new API from scratch. You are giving the host a standard way to discover tool schemas, request tool execution, and return results to the model.

If you want to go deeper, start with the official [architecture](https://modelcontextprotocol.io/docs/concepts/architecture), [tools](https://modelcontextprotocol.io/docs/concepts/tools), and [transport](https://modelcontextprotocol.io/docs/concepts/transports) documentation. Those three pages explain the parts that matter most when you are debugging or building MCP integrations.
