---
name: deploy-maker
description: "Deploy Maker skill. Use when producing release notes and verified rollback plan for the deployment SDLC phase. Defines artifacts to create and quality standards for the maker role."
---

# Deploy Maker

Load this skill alongside `maker-checker-protocol` when acting as the **Deploy Maker**.

## Role

Produce the **deployment** phase artifact: release notes and verified rollback plan.

## Required Inputs

- `source_ref`: ticket ID, PR URL, or file path
- `context`: constraints or additional guidance
- `previous_output`: prior checker findings (null on first run; apply all findings if present)

## Output Artifact

- **Release notes:** User-facing summary; who is affected (all users / specific role / opt-in)
- **Env vars section:** List all NEW or CHANGED env vars with type, required/optional flag, validation rules
- **Migration steps:** If DB schema changed, include UP and DOWN migration commands
- **Monitoring:** Key metrics to watch post-deploy (error rate, response time, user impact)
- **Rollback trigger criteria:** Specific thresholds (e.g., ">5% error rate" or "auth flow broken")
- **Rollback procedure:** Step-by-step tested procedure verified in staging; include "rollback rollback" step

## Quality Standards

- ✅ All env vars documented: NEW vars listed with type (string/number/boolean), required/optional, validation rule
- ✅ All env vars verified: Each required env var confirmed to exist in staging + production config
- ✅ No unmitigated breaking changes: Breaking API/schema changes have backward-compat strategy or migration window
- ✅ Rollback plan actionable: Each step is single, verifiable command or check; includes env var rollback if needed
- ✅ Rollback tested (explicit evidence required):
  - [ ] Dry-run executed (rollback command tested without state change)
  - [ ] Full reversal tested (rollback executed on staging; data restored to pre-deploy state)
  - [ ] Rollback validation documented (specific checks performed)
  - Evidence screenshot/log attached to PR or Deploy output
- ✅ Rollback "rollback" tested: Procedure for rolling forward again documented
- ✅ Monitoring defined: Key metrics identified (error rate, latency, feature usage); alert thresholds set
- ✅ Rollback criteria explicit: Specific, measurable thresholds for rollback (not vague "if issues occur")

## Production Steps

1. Read all changed files and approved PR description
2. **Deploy step 1 — Release notes:** Write summary for non-technical stakeholders; who is affected; any opt-in/migration period
3. **Deploy step 2 — Env var audit:** Scan code for new env vars; for each: var name, type, required/optional, validation rule, example value
4. **Deploy step 3 — Verify env vars:** Check each required env var pre-configured in staging and production (DO NOT create during deploy)
5. **Deploy step 4 — DB migrations:** If schema changed, write UP and DOWN (rollback) commands; test both in staging; document migration window
6. **Deploy step 5 — Breaking changes:** List any breaking API changes (schema, endpoint removal, required fields); document migration strategy
7. **Deploy step 6 — Rollback procedure:** Write step-by-step rollback (revert commit, run DB rollback, verify env vars); test in staging
8. **Deploy step 7 — Monitoring:** Identify key metrics to watch (error rate, latency, feature usage); set alert thresholds
9. **Deploy step 8 — Rollback trigger criteria:** Define explicit, measurable rollback conditions (e.g., "error rate >5% for 5 min")
10. Present rollout plan (canary / phased / full) + monitoring dashboard to ops team

## Checker Handoff

After producing the artifact, proceed to checker validation within the same agent run — load the **deploy-checker** skill and apply all gate rules. Do not invoke a separate checker agent.
