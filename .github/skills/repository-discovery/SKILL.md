---
name: repository-discovery
description: "Minimal codebase exploration protocol. Load in the code agent to enforce locality-first patterns, minimize file reads, and maximize reuse of existing code."
---

# Repository Discovery

This skill defines the **exploration protocol** for the development phase. It enforces minimal repository scanning, locality-first implementation, and maximum reuse of existing patterns.

## Core Principle

**Read the minimum context required to implement — no more.**

Before reading any file, ask: _"Do I already have enough context to implement this?"_ If yes, skip the read.

## Context Loading Order

Load context in this order, stopping as soon as you have enough to proceed:

1. **The target file(s)** — Read only files directly mentioned in the task
2. **Neighbouring files** — Read adjacent components, hooks, or utilities in the same directory
3. **Import graph (one level)** — Trace imports from the target files only
4. **Conventions reference** — Check `best-practices` skill for naming and structure rules
5. **Full directory scan** — Only if the above is insufficient

Never jump to step 5 without exhausting steps 1–4.

## Locality-First Patterns

Before creating anything new, check:

1. **Does a similar component exist in `components/`?** → Extend or reuse it
2. **Does a similar hook exist in `hooks/`?** → Reuse or compose it
3. **Does a similar utility exist in `lib/` or `utils/`?** → Call it
4. **Does a similar API call exist in `services/` or `api/`?** → Reuse the pattern

Only create new files if no existing file can be extended or reused.

## File Reading Budget

| Context Type | Max Files |
|---|---|
| Target implementation files | Unlimited |
| Supporting components / hooks | 5 |
| Utility / lib files | 3 |
| Config files | 2 |
| **Total supporting reads** | **10** |

If you need more than 10 supporting reads, **stop and ask the user** which specific context is needed.

## Repository Reuse Rules

1. **Never duplicate logic** — if a utility already does it, call it
2. **Never create a new state management pattern** — use the project's existing solution (Zustand v4.5.5)
3. **Never introduce a new library** — if the task requires a library not already in `package.json`, stop and ask
4. **Never invent API behavior** — if an API contract is unclear, stop and ask

## Scope Control

Only modify files that are:
- Directly required by the task
- Test files for changed code
- Type files for changed contracts

Do not touch:
- Unrelated components
- Global configuration (unless the task explicitly requires it)
- Shared utilities (unless extending is the minimal-change solution)

## Exploration Delegation

When file scanning is required, always delegate to the **Explore** subagent — do not inline file reads within the code generation step. Pass discovered context back as a structured list of relevant files and patterns.

### Exploration Request Format

When delegating to Explore, provide:

```
Scan: <directory or glob>
Find: <what to look for — e.g., existing Button component, existing API fetch pattern>
Return: file paths + relevant code snippets (max 20 lines per file)
```

### Exploration Output Format

Expect Explore to return:

```
Existing patterns found:
  - <file path>: <one-line description of relevant pattern>

Reuse recommendation:
  - Extend <file> for <reason>
  OR
  - No reusable pattern found — safe to create new file
```

## Anti-Patterns to Avoid

- Reading the entire repository before writing a single line
- Scanning unrelated directories out of curiosity
- Creating new abstractions for one-time use
- Adding utility functions that already exist elsewhere
- Importing from files that are not in the direct dependency chain
