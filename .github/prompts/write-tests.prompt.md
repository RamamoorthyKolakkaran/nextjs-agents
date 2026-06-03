---
mode: agent
agent: Test
description: "Write unit and E2E tests for changed files. Provide a file path, branch name, or PR URL."
---

You are writing tests for **next-js-agents**.

Provide the following:
- `source_ref`: file path, branch name, or PR URL containing the changed code
- `context` _(optional)_: specific flows or edge cases to prioritise

This workflow will:
1. Invoke **Test** agent — read changed source files, write unit tests using Vitest, add Playwright E2E tests in `tests/e2e`, then self-validate all executable tests pass with no anti-patterns

If self-validation fails, the phase stops with findings for a human correction round. Re-run the phase with `fix-checker-findings` after the issues are addressed.
