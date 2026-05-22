---
title: "Execution Brief Template"
brief_id: "EB-0000"
artifact_version: "1.0.0"
status: "draft"
created_at: "2026-05-22T00:00:00Z"
updated_at: "2026-05-22T00:00:00Z"
target_repo: "/absolute/path/to/target-repo"
target_branch: "main"
review_boundary_id: "RB-0000"
---

# Objective

State what must be achieved and why it matters. Keep this outcome-oriented and
ground it in the latest explicit user instruction or planning artifact.

# Context / Constraints

- Confirmed constraints:
- Dependencies:
- Non-goals:
- Accepted tradeoffs:
- Assumptions / Inferences:

# Authoritative Sources

| Source | Retrieved at | Authority | Status | Controls |
| --- | --- | --- | --- | --- |
| Current thread | 2026-05-22T00:00:00Z | Latest user intent and decisions | loaded | Use latest explicit instruction when conflicts exist. |
| AGENTS.md | 2026-05-22T00:00:00Z | Repo-local operating rules | loaded | Follow unless a higher-priority user instruction conflicts. |
| Target workspace | 2026-05-22T00:00:00Z | Current implementation state | loaded | Treat code state as observed facts, not intended scope. |

# Current State

- Planning / PM:
- Design:
- Implementation:
- Validation:
- Known gaps:

# Execution Scope

| Scope item | Classification | Approval impact | Notes |
| --- | --- | --- | --- |
| Implement the stated objective | in-scope | blocking | Current diff must satisfy this item. |
| Preserve unrelated behavior | in-scope | blocking | Regression inside this boundary blocks approval. |
| Deferred enhancements | out-of-scope | non-blocking | Track under Planned Follow-up Work. |

# Materially Verifiable Success Criteria

- [ ] The requested behavior or artifact exists in the target workspace.
- [ ] Required validation gates pass or failures are documented with owner-visible stop conditions.
- [ ] Review boundaries and planned follow-up work are explicit before review dispatch.

# Review Boundary

| Boundary | Scope | Approval impact | Notes |
| --- | --- | --- | --- |
| Objective completion | in-scope | blocking | Reviewers should reject for correctness, safety, regression, or maintainability issues inside this boundary. |
| Unrelated refactors | out-of-scope | non-blocking | Reviewers may note separately but should not reject unless the current diff makes them necessary. |
| Planned follow-up work | out-of-scope | non-blocking | Follow-up is non-blocking unless the current diff contradicts or prevents it. |

# Planned Follow-up Work

- None currently identified.

# Execution Plan

1. Read the authoritative sources and current implementation state.
2. Make the smallest scoped implementation that satisfies the success criteria.
3. Run validation gates, update this brief, and prepare review context.

# Validation Gates

- Validate this brief:
  `npx -y @jasonbelmonti/markdown-engine@2.0.0 validate --file ./.codex/execution-briefs/EB-0000/execution-brief.md --profile <skill-dir>/profiles/execution-brief.yaml`
- Run target-repo tests or checks that prove the in-scope behavior.
- Record failed or skipped validation as a stop condition when it affects confidence.

# Stop Conditions

- A named authoritative source is unavailable and materially affects scope.
- Sources conflict and the controlling source cannot be determined.
- Required validation fails for reasons outside the current scope.
- The requested change requires destructive operations or credentialed access not already approved.
- Review boundary changes would alter approval criteria after implementation has started.

# Consensus Review Packet Inputs

| Packet field | Source section | Required mapping | Notes |
| --- | --- | --- | --- |
| `task_definition.objective` | Objective | Copy the objective summary. | Keep source-grounded. |
| `task_definition.in_scope` | Execution Scope | Include rows classified as in-scope. | Blocking review items. |
| `task_definition.out_of_scope` | Execution Scope | Include rows classified as out-of-scope. | Non-goals and deferred work. |
| `review_boundary` | Review Boundary | Copy the approval boundary. | Primary anti-scope-creep control. |
| `planned_follow_up_work` | Planned Follow-up Work | Copy each deferred item. | Non-blocking unless contradicted by the diff. |
| `test_or_risk_context` | Validation Gates | Summarize checks run, skipped, or required. | Include known confidence risks. |

# Revision Log

| Timestamp | Actor | Change | Checksum |
| --- | --- | --- | --- |
| 2026-05-22T00:00:00Z | codex | Created initial Execution Brief. | pending |
