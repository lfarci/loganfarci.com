---
applyTo: "src/vite.config.ts,src/tailwind.config.ts,src/plugins/**/*,src/scripts/**/*"
---

# Build and Prerender Tooling Instructions

Follow `docs/specs/architecture.md`, `quality-bars.md`, and `testing.md`; they remain
authoritative.

- Preserve the client build, SSR bundle, and prerender pipeline as a coherent contract.
- Keep generated output out of source control and avoid adding environment-specific
  behavior to build scripts.
- Reuse existing package scripts and plugins before introducing a new build path.
- Add focused tests for plugin or script behavior when it changes observably.
