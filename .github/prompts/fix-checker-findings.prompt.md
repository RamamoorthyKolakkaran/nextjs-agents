---
mode: agent
description: "Re-invoke a phase agent with prior findings to apply fixes. Use when a phase agent has returned gate failures and you need it to re-run with the findings pre-loaded."
---

You are re-entering the fix loop for **next-js-agents**.

Provide the following:
- `artifact_type`: the type of artifact to fix (`requirement` / `design` / `code` / `test` / `pr` / `deploy`)
- `source_ref`: the original ticket, PR URL, branch, or file path
- `previous_output`: paste the failing output envelope (JSON) containing `findings` and `gate_result: fail`

Based on `artifact_type`, this will invoke the correct phase agent with the findings pre-loaded as `previous_output`, so it patches only what failed — without regenerating from scratch.

| artifact_type | Agent invoked |
|--------------|---------------|
| `requirement` | Requirement |
| `design` | Design |
| `code` | Code |
| `test` | Test |
| `pr` | PR |
| `deploy` | Deploy |

> **Note:** This counts as fix iteration 2 if the phase agent has already run once on this artifact. If self-validation fails again after this re-run, findings are escalated to a human.
