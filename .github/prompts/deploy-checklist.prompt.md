---
mode: agent
description: "Run the deployment checklist for a feature branch or release. Provides structured pre-deploy verification, release notes, and rollback plan."
---

You are running the deployment checklist for **nextjs-agents**.

Provide the following:
- `source_ref`: branch name, PR URL, or release tag
- `context` _(optional)_: deployment environment, timing constraints, known risks

This workflow will:

1. **Verify SDLC phase completion** — confirm that planning ✅, development ✅, and testing ✅ phases are complete for this change. If any phase is incomplete, stop and identify which phase needs to be completed first.

2. **Generate a pre-deploy checklist** covering:
   - Build passing (`tsc --noEmit` + `eslint` exit code 0)
   - Unit tests passing (Vitest — 100% pass rate)
   - E2E tests passing (Playwright — 100% pass rate, 0% flakiness)
   - No critical checker findings unresolved
   - No `console.log`, `debugger`, or TODO/FIXME in changed files
   - All acceptance criteria implemented and verified

3. **Generate release notes** summarising:
   - What changed (features, bug fixes, refactors)
   - What was tested (unit test coverage, E2E scenarios covered)
   - Known limitations or follow-up tickets

4. **Generate a rollback plan** with step-by-step instructions:
   - How to revert the deployment if it fails
   - Which database migrations (if any) need to be rolled back
   - How to verify the rollback was successful

> Use this prompt before merging to production or deploying a release. If any pre-deploy check fails, stop and resolve the issue before proceeding.
