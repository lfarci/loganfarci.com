---
title: "GitHub MCP Server"
description: "Short note about the GitHub MCP server and how it can be used to enhance your development workflow."
publishedAt: "2025-07-18"
featured: true
tags: ["GitHub Copilot", "MCP"]
author: "Logan Farci"
coauthoredWithAgent: true
---

The GitHub MCP server is a powerful tool that transforms your AI agent into a GitHub powerhouse. This server provides comprehensive integration with GitHub, allowing you to manage repositories, issues, pull requests, and GitHub Actions through natural language conversations.

If you want a refresher on how MCP tool calls work, start with my [How MCP Tool Calls Work](/articles/mcp) article or the [official introduction](https://modelcontextprotocol.io/introduction). This article stays focused on what the GitHub MCP Server exposes and how to use it effectively.

## The GitHub MCP Server

The GitHub MCP server is the official implementation of an MCP server for GitHub. It can be used remotely (hosted by GitHub) or run locally. It offers a wide range of tools to interact with the GitHub API, covering everything from issue management to code security.

### Available Tools

The GitHub MCP Server provides a comprehensive set of tools, grouped into the following toolsets:

- **Issues:** Create, update, list, and comment on issues.
- **Pull Requests:** Create, get details, list files, merge, and manage reviews for pull requests.
- **Repositories:** Create branches, create or update files, get file contents, and list commits or branches.
- **Actions:** Manage GitHub Actions workflows, such as triggering runs or retrieving logs.
- **Code Security:** List and get details for code scanning and Dependabot alerts.
- **Users and Orgs:** Search for users and organizations.

### Real-World Examples

Here's how you can use the GitHub MCP server in your daily workflow:

- **Explore GitHub:** "Find repositories with the 'mcp-server' topic."
- **Manage Issues:** "Create an issue to 'refactor the authentication module' and assign it to me."
- **Handle Pull Requests:** "Summarize the changes in PR #42."
- **Analyze Workflows:** "Show me the steps in the 'CI' workflow."
- **Trigger Actions:** "Run the 'deploy to staging' workflow."

## Setting It Up

### Remote Setup (Recommended)

Getting started with the remote server is straightforward. Simply add a `.vscode/mcp.json` configuration file to your repository:

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

When you save this file, Visual Studio Code will automatically launch the OAuth flow. Once authenticated, you can start using the GitHub capabilities.

### Local Setup

For more control, you can run the GitHub MCP server locally with Docker. In VS Code, the working local setup is process-based, so VS Code launches the container and communicates with it over stdio.

1.  **Create a GitHub personal access token.**
2.  **Add this to `.vscode/mcp.json`:**
    ```json
    {
      "inputs": [
        {
          "type": "promptString",
          "id": "github_token",
          "description": "GitHub Personal Access Token",
          "password": true
        }
      ],
      "servers": {
        "github": {
          "command": "docker",
          "args": [
            "run",
            "-i",
            "--rm",
            "-e",
            "GITHUB_PERSONAL_ACCESS_TOKEN",
            "ghcr.io/github/github-mcp-server"
          ],
          "env": {
            "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}"
          }
        }
      }
    }
    ```

This local configuration does not use `http://localhost:8080`. If you want an HTTP transport instead, make sure you follow the official GitHub MCP Server transport documentation and configure the server for that transport explicitly.

### Security

The GitHub MCP server can be configured to control the agent's permissions.

- **Read-Only Mode:** Run the server in read-only mode to prevent the agent from making any changes.
- **Toolsets:** Enable or disable specific toolsets to control which actions the agent can perform.

## Key Benefits

- **Natural Interface:** Manage GitHub through conversation instead of clicking through UIs.
- **Comprehensive Coverage:** Access most GitHub features through the agent.
- **Intelligent Automation:** The agent understands context and can make smart decisions.
- **Safety First:** Confirmation prompts for potentially destructive operations.
- **Discovery:** Excellent for exploring repositories and understanding project structures.

## Cool Setup Video

Want to see the GitHub MCP Server in action? Check out this excellent video from Debbie O'Brien:

- [How to Set Up the GitHub MCP Server (YouTube)](https://www.youtube.com/watch?v=FvR1b0nNoJA)

## Resources

- [GitHub MCP Server Repository](https://github.com/github/github-mcp-server)
- [Available Tools Documentation](https://github.com/github/github-mcp-server?tab=readme-ov-file#tools)
- [VS Code MCP Documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
