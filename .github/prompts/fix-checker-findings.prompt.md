---
mode: agent
description: "Re-invoke a phase agent with prior findings to apply fixes. Use when a phase agent has returned gate failures and you need it to re-run with the findings pre-loaded."
---

You are re-entering the fix loop for **nextjs-agents**.

## How to Use This Prompt

When a phase agent (Planning, Code, or Test) fails validation, use this prompt to re-run the phase with the failing findings pre-loaded.

### Step 1: Identify Which Phase Failed

Determine the artifact type that failed:

| Artifact Type | Phase Agent | Produces |
|---|---|---|
| `requirement` | Planning | Requirement analysis, acceptance criteria, diagrams, API contracts |
| `code` | Code | TypeScript/React implementation |
| `test` | Test | Unit tests (Vitest) + E2E tests (Playwright) |

### Step 2: Provide Your Inputs

Supply the following:

- **`artifact_type`**: `requirement` / `code` / `test` (required)
- **`source_ref`**: the original ticket, PR URL, branch, or file path (required)
- **`previous_output`**: paste the complete failing output envelope from the checker in JSON format (required)

The `previous_output` must include the `findings` array with all failed gates and `gate_result: fail`.

### Step 3: The Phase Agent Re-runs

Based on `artifact_type`, the correct phase agent will be invoked:

| artifact_type | Agent invoked | Re-runs |
|---|---|---|
| `requirement` | Planning | Planning Maker + Planning Checker |
| `code` | Code | Code Maker + Code Checker |
| `test` | Test | Test Maker + Test Checker |

The agent will:

1. Load all skills
2. Read `previous_output` containing the failures
3. **Apply all remediation items** from the failed gates
4. Patch only what failed — **do not regenerate from scratch**
5. Re-run checker validation against the updated artifact
6. Present a fresh validation checklist

### Step 4: Fix Iteration Tracking

This is counted as **fix iteration 2** if the phase agent has already run once.

**Rules:**
- **Iteration 1** → Phase agent runs normally, produces artifact, validates
- **Iteration 2** → You use this prompt to re-run with fixes
- **Iteration 3+** → If validation still fails after iteration 2, findings are escalated to human for manual review

## Example Workflow

**Scenario:** Code Checker found 3 gate failures.

1. Code Agent outputs: `findings` array with 3 failed gates + `gate_result: fail`
2. You review the findings and fix your code
3. You use this prompt with:
   ```
   artifact_type: code
   source_ref: PROJ-123
   previous_output: <paste entire failing output envelope JSON>
   ```
4. Code Agent re-runs with failures pre-loaded
5. Code Agent patches the code to address all failures
6. Code Checker validates again
7. If still failing: Escalation to human

## Important Notes

- **Do NOT manually run the phase agent again** — use this prompt instead so the agent has your fixes pre-loaded
- **Provide the complete JSON envelope** — The agent needs the full `previous_output` to know what was wrong
- **One fix iteration only** — If failures persist after this re-run, findings are escalated

---

**Ready to apply fixes?** Provide `artifact_type`, `source_ref`, and the complete `previous_output` JSON, and the corresponding phase agent will re-run with fixes pre-loaded.
