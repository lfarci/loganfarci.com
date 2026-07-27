# Repository guidance

Use the existing GitHub Copilot custom instructions and repository specs as the
shared agent guidance:

- `.github/copilot-instructions.md` defines the project, layout, workflows, and
  coding conventions.
- `.github/instructions/` contains path-specific instructions.
- `docs/specs/README.md` routes tasks to the canonical requirements and defines
  their precedence.

Read the applicable files before making changes. Do not restate their rules here;
update the relevant custom instruction or spec when guidance changes so Copilot
and Codex stay aligned.

More-specific `AGENTS.md` files may route a subtree to its applicable custom
instructions and specs.
