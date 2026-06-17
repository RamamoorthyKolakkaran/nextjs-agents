---
name: project-config
description: "Project-specific configuration for nextjs-agents. Single source of truth for app name, E2E setup, language, key paths, and team conventions. Load this skill in every agent alongside maker-checker-protocol. Extend via the train command as the project evolves."
---

# Project Configuration — nextjs-agents

This skill is the single source of truth for project-specific settings. All agents load it at runtime — never hardcode these values inside individual agents.

## Application

| Field | Value |
|-------|-------|
| **Name** | nextjs-agents |
| **Framework** | NextJS App Router |
| **CSS framework** | Tailwind CSS v4 |
| **Response language** | English |

## Testing

| Field | Value |
|-------|-------|
| **Unit test runner** | Vitest |
| **E2E test runner** | Playwright |
| **E2E test path** | tests/e2e |
| **E2E setup exists** | yes |

## Key Paths

> Extend these via the `train` command once the project is initialised.

| Path | Location |
|------|---------|
| Source root | _(add via train)_ |
| Components | _(add via train)_ |
| Hooks | _(add via train)_ |
| Utilities / lib | _(add via train)_ |
| API routes | _(add via train)_ |
| Public assets | _(add via train)_ |

## Project Conventions

> Extend these via the `train` command as the project evolves.

| Convention | Value |
|-----------|-------|
| Component library | _(add via train)_ |
| State management | Zustand |
| Storybook | yes |
| API layer / client | _(add via train)_ |
| Auth pattern | _(add via train)_ |
| Form validation | _(add via train)_ |
| Feature flags | _(add via train)_ |
| Environment config | _(add via train)_ |

## How to Extend

Run `train` on the NextJS Orchestrator and target `project-config` to add any new convention, path, or setting. The change will be available to all agents on their next invocation — no need to update individual agent files.

## Phases

Control which SDLC phases are active for this project. Agents check this table at runtime before doing any work — disabled phases are skipped gracefully.

| Phase | Enabled | Notes |
|-------|---------|-------|
| planning | ✅ enabled | Requirement writing and acceptance criteria, Component diagrams and API contracts |
| development | ✅ enabled | TypeScript/React implementation |
| testing | ✅ enabled | Unit tests and E2E tests |
