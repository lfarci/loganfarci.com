---
applyTo: "**/*.test.tsx"
---

# Test File Instructions

When creating or updating `*.test.tsx` files:

- Cover the full observable behavior of the unit under test, including key state transitions, user interactions, and relevant edge cases.
- Keep one observable behavior per `it` block using Arrange–Act–Assert.
- Query UI by role and accessible name (`getByRole`, `findByRole`) instead of test IDs or fragile DOM structure.
- Prefer router/provider-backed test fixtures when components depend on context or routing.
- Include open/close and reversal paths for interactive controls when applicable (for example: open + close menu, keyboard dismiss, route-change dismiss).
