---
title: "Efficient Git Worktree Usage in VS Code"
description: "A focused guide on using Git worktrees within Visual Studio Code to streamline multi-branch workflows and boost productivity."
publishedAt: "2025-08-12"
featured: false
tags: ["Git", "VS Code", "Worktree", "Productivity"]
author: "Logan Farci"
coauthoredWithAgent: true
---

The latest Visual Studio Code release ([1.103](https://code.visualstudio.com/updates/v1_103#_git-worktree-support)) includes support for [Git worktrees](https://git-scm.com/docs/git-worktree), allowing developers to manage multiple branches more efficiently. Honestly, I didn't know about this Git feature and it was the occasion to learn about it. This guide will walk you through setting up and using Git worktrees within VS Code to enhance your workflow.

## What are Git Worktrees?

Git worktrees allow you to have multiple working directories associated with a single Git repository. This is particularly useful for working on multiple branches simultaneously without the need to constantly switch between them. Personally I often encounter myself having to stash changes before switching to another branch to apply a simple fix on another branch.

## Setting Up Git Worktrees in VS Code

To get started, organize your project directory to keep worktrees clear and manageable. A common pattern is:

```text
my-awesome-app/
    main/        # main repository clone
    feature-x/   # worktree for 'feature-x' branch
    bugfix-y/    # worktree for 'bugfix-y' branch
```

**Create a Worktree for an Existing Branch**  
Open a terminal in VS Code, navigate to your main repository directory, and run:

```bash
git worktree add ../feature-xxx feature/xxx
```

Replace `feature-xxx` with your branch name. This command creates a new directory for the branch and checks it out, so you can work on it independently.

**Create a Worktree and New Branch Simultaneously**  
To quickly start a hotfix or feature without losing your current changes, create a new branch and worktree in one step:

```bash
git worktree add -b feature-xxx ../feature-xxx
```

This creates both the branch (`feature-xxx`) and its worktree.

**Open and Manage Worktrees in VS Code**  
Open each worktree in a separate VS Code window. You can do this from the integrated terminal or via the source control pane menu:

![Source control pane menu](https://code.visualstudio.com/assets/updates/1_103/worktree_specific_submenu.png)

Each worktree has its own Git state, so you can commit, push, and pull independently. Switch between worktrees by opening the relevant folder in a new window.

> **Tip:** Use clear, descriptive names for your worktree directories. VS Code’s window title reflects the folder name, making it easy to track multiple branches.

**Remove a Worktree When Finished**  
To clean up, remove a worktree with:

```bash
git worktree remove ../feature-xxx
```

## Benefits of Using Git Worktrees

-   **Parallel Development**: Work on multiple features or bug fixes simultaneously without the overhead of switching branches.
-   **Reduced Context Switching**: Keep your work organized by separating different tasks into their own worktrees.
-   **Easier Testing**: Test changes in isolation by using worktrees for different branches or versions of your code.

## Conclusion

Git worktrees are a powerful feature that can significantly improve your workflow in Visual Studio Code. By allowing you to work on multiple branches simultaneously, they help you stay organized and focused on your tasks. Give them a try in your next project!
