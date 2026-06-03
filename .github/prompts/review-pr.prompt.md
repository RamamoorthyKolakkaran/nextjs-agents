---
mode: agent
agent: PR
description: "Generate a complete PR description with risk assessment for a branch or PR URL."
---

You are preparing a pull request for **next-js-agents**.

Provide the following:
- `source_ref`: branch name or existing PR URL
- `context` _(optional)_: deployment considerations, feature flags, migration steps

This workflow will:
1. Invoke **PR** agent — read all changed files, assess risk (P0/P1/P2), generate PR title, summary, change list, testing evidence, and rollback plan, then self-validate all checklist items pass and no unresolved P0/P1 findings remain

The output is a ready-to-paste PR description.
