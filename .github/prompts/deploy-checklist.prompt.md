---
mode: agent
agent: Deploy
description: "Generate release notes and a rollback plan for a branch or PR ready for deployment."
---

You are preparing a deployment for **next-js-agents**.

Provide the following:
- `source_ref`: branch name or merged PR URL
- `context` _(optional)_: target environment, deployment window, known risks

This workflow will:
1. Invoke **Deploy** agent — read changed files, summarise user-facing changes, list all new/changed env vars, write rollback procedure, then self-validate env vars are documented and rollback steps are actionable

The output is a deployment checklist and release notes ready for your release process.
