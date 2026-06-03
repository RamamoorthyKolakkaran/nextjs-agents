---
name: design-maker
description: "Design Maker skill. Use when producing component diagram, API contract, security checklist, and performance constraints for the design SDLC phase. Defines artifacts to create and quality standards for the maker role."
---

# Design Maker

Load this skill alongside `maker-checker-protocol` when acting as the **Design Maker**.

## Role

Produce the **design** phase artifact: component diagram, API contract, security checklist, and performance constraints.

## Required Inputs

- `source_ref`: ticket ID, PR URL, or file path
- `context`: constraints or additional guidance
- `previous_output`: prior checker findings (null on first run; apply all findings if present)

## Output Artifact

- **Component Diagram (Mermaid):** All new/changed components with dependencies; mark Server vs Client Components
- **API Contract (TypeScript):** All request/response types with `interface` or `type`; no `any` types
- **Security Checklist:** OWASP Top 10 relevant items (injection, auth, data exposure)
- **Performance Constraints:** Load time targets, bundle size impact, lazy-load strategy
- **Accessibility Baseline:** WCAG 2.1 AA targets
- **Breaking Changes:** Any schema/API changes that break existing clients — flag with mitigation plan
- **Storybook Note:** Component diagrams must indicate which shared UI components in `components/` require a `.stories.tsx` Story file

### Breaking Changes — Detection & Mitigation

Before approval, design must identify if ANY of these exist:
- ✅ API endpoint removed, renamed, or moved to different path
- ✅ Required field added to request payload (breaks existing clients)
- ✅ Response shape changed: field removed, renamed, or type changed
- ✅ Authentication method changed (token format, session handling)
- ✅ Public type exports modified in compiled `.d.ts` files
- ✅ Database schema breaking migration (column drop, table rename)
- ✅ Environment variable name/requirement changed
- ✅ Enum value removed or renamed

If ANY detected:
  1. Document the breaking change explicitly
  2. Define a migration window (e.g., "deprecated for 2 releases, then removed")
  3. OR define backward-compat strategy (e.g., support both old and new formats)
  4. Include this in deploy rollback plan

## Quality Standards

- ✅ No circular dependencies: Component graph is acyclic
- ✅ Follows Next.js App Router patterns: Correct Server/Client split; proper data-fetching (no client-side in Server Components)
- ✅ API types complete: All request/response shapes defined; no `any` types
- ✅ Security identified: OWASP Top 10 risks listed with mitigations
- ✅ Accessibility addressed: WCAG 2.1 AA compliance path defined
- ✅ Performance budgeted: Load time and bundle size impact quantified
- ✅ Breaking changes identified: Any breaking changes are explicitly listed with mitigation
- ✅ Breaking changes mitigated: Backward-compat strategy or migration plan

## Checker Handoff

After producing the artifact, proceed to checker validation within the same agent run — load the **design-checker** skill and apply all gate rules. Do not invoke a separate checker agent.
