---
mode: agent
description: "Deployment and release checklist for nextjs-agents. Verify all prerequisites, generate release notes, and confirm rollback procedures before deploying to production."
---

You are preparing **nextjs-agents** for production deployment.

## Pre-Deployment Checklist

Before deploying, verify all of the following:

### 1. Code & Validation

- ✅ All code has passed the Code Checker
  - TypeScript compiles without errors
  - ESLint shows zero violations
  - Type safety is strict (no `any` types)
  - Security validation implemented
  - Accessibility verified

- ✅ All changes have been reviewed
  - Code matches the approved design contract
  - All acceptance criteria implemented
  - No scope creep or undocumented features

### 2. Testing

- ✅ Unit tests
  - ≥80% coverage on all modified files
  - 100% pass rate
  - All edge cases and error scenarios covered

- ✅ E2E tests
  - 100% pass rate
  - 0% flakiness (passed on 2 consecutive runs)
  - All critical user flows covered
  - Accessibility tests included
  - Responsive design verified (375px, 768px, 1920px)

### 3. Dependencies

- ✅ New dependencies properly added to package.json
- ✅ No breaking version changes
- ✅ No security vulnerabilities in dependencies
  - Run: `npm audit` (zero critical/high vulnerabilities)

### 4. Configuration

- ✅ Environment variables configured
- ✅ Build configuration updated (if needed)
- ✅ Database migrations applied (if applicable)
- ✅ Feature flags configured
- ✅ Monitoring/logging configured

### 5. Documentation

- ✅ Code is properly documented
- ✅ API changes documented
- ✅ Breaking changes documented
- ✅ Deployment notes prepared

### 6. Rollback Plan

- ✅ Rollback strategy documented
  - How to revert code
  - How to revert database migrations
  - How to reset feature flags
  - Emergency contact procedures

### 7. Release Notes

- ✅ Release notes prepared with:
  - Feature summary
  - Acceptance criteria met
  - Breaking changes (if any)
  - Security updates (if any)
  - Known limitations
  - Rollback instructions

## Risk Assessment

Classify each change by risk level:

| Risk Level | Criteria | Action |
|---|---|---|
| **P0 (Critical)** | Breaks existing functionality, data loss risk, security vulnerability | Requires senior review, thorough testing, staged rollout |
| **P1 (High)** | Impacts multiple features, performance change, auth/security changes | Requires testing, monitoring plan, fallback ready |
| **P2 (Medium)** | Single feature change, isolated impact, well-tested | Standard deployment process |

Document the risk assessment for each change.

## Deployment Steps

1. **Pre-deployment validation**
   - Verify all checklist items above are complete
   - Get stakeholder sign-off (if required)

2. **Build & Stage**
   - Run: `npm run build`
   - Verify build output is clean
   - Deploy to staging environment
   - Smoke test on staging

3. **Production Deployment**
   - For P0/P1 changes: Consider staged rollout (10% → 50% → 100%)
   - Monitor application health during and after deployment
   - Watch error rates, performance, and user reports

4. **Post-Deployment Verification**
   - Verify feature works as expected
   - Check error logs for exceptions
   - Monitor performance metrics
   - Verify critical user flows work

5. **Rollback Plan (if needed)**
   - If critical issues detected, execute rollback immediately
   - Revert code, database, and configuration changes
   - Notify stakeholders
   - Post-mortem and analysis

## Monitoring & Alerts

After deployment, monitor:

- 🔴 **Error rates** — Alert if errors spike
- 🔴 **Performance** — Alert if response times degrade
- 🔴 **User feedback** — Monitor support channels
- 🟡 **Feature adoption** — Track usage of new features
- 🟡 **Dependency issues** — Monitor for CVEs in dependencies

## Release Notes Template

```markdown
# Release: [Version]

## Features
- [Feature 1]: [Brief description + acceptance criteria]
- [Feature 2]: [Brief description + acceptance criteria]

## Bug Fixes
- [Bug 1]: [What was fixed and why]
- [Bug 2]: [What was fixed and why]

## Breaking Changes
- [Breaking change 1]: [Old behavior → New behavior]
- [Migration guide]: [How to update client code]

## Security Updates
- [Security fix 1]: [What was patched]

## Known Limitations
- [Limitation 1]: [Description + timeline for fix if applicable]

## Rollback Instructions
1. [Step 1 to revert code]
2. [Step 2 to revert database]
3. [Step 3 to reset configuration]
4. Emergency: Contact [On-call engineer]

## Testing & Validation
- ✅ Unit tests: X tests, ≥80% coverage
- ✅ E2E tests: Y tests, 100% pass rate, 0% flakiness
- ✅ Risk assessment: P[0/1/2]
```

---

**Ready to deploy?** Complete the checklist above, prepare release notes, confirm rollback procedures, and confirm that all changes have passed code and test validation.

For questions or issues during deployment, refer to the rollback instructions and contact the on-call engineer.
