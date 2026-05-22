# Review Boundaries

Use this reference before preparing review context, building consensus-review
packet inputs, or revising approval criteria.

## Boundary Purpose

Review boundaries prevent reviewers from turning adjacent improvements,
deferred work, or preferred rewrites into approval blockers. They do not hide
real correctness, safety, regression, or maintainability issues inside the
current scope.

## Required Boundary Fields

Record review boundaries in the `Review Boundary` table with these columns:

- `Boundary`: short name for the review rule or area
- `Scope`: `in-scope` or `out-of-scope`
- `Approval impact`: `blocking` or `non-blocking`
- `Notes`: source-grounded explanation of how reviewers should apply it

Use `in-scope` with `blocking` for requirements the current diff must satisfy.
Use `out-of-scope` with `non-blocking` for deferred or unrelated work.

## Scope Classification

Use these classifications consistently:

- `in-scope`: Required for the current objective, success criteria, validation
  gates, or safety of the implemented change.
- `out-of-scope`: Explicit non-goal, deferred enhancement, unrelated cleanup, or
  work assigned to a later task.
- `planned follow-up`: Deferred work that should be copied into
  `Planned Follow-up Work` and treated as non-blocking unless the current diff
  contradicts, prevents, or makes it unsafe.

## Approval Impact Rules

- A validated blocker inside an in-scope boundary should cause rejection.
- Missing out-of-scope work should not cause rejection.
- Planned follow-up work should not cause rejection unless the current diff
  makes that follow-up impossible, contradicts it, or creates a current
  correctness, safety, regression, or maintainability issue.
- Non-blocking observations may be recorded separately for later work.
- If the boundary is ambiguous enough that a responsible verdict cannot be
  issued, mark that as a confidence risk and stop before review dispatch.

## Consensus Review Mapping

Map the Execution Brief into `consensus-review` packet fields as follows:

| Execution Brief section | consensus-review packet field |
| --- | --- |
| Objective | `task_definition.objective` |
| Execution Scope in-scope rows | `task_definition.in_scope` |
| Execution Scope out-of-scope rows | `task_definition.out_of_scope` |
| Context / Constraints | `task_definition.constraints` |
| Review Boundary | `review_boundary` |
| Planned Follow-up Work | `planned_follow_up_work` |
| Validation Gates | `test_or_risk_context` |
| Authoritative Sources | `planning_artifacts` and `repo_instructions` as relevant |
| Current State | `planning_artifacts` and task context summaries |

The `Consensus Review Packet Inputs` table should name every packet field that
must be populated before reviewer dispatch.

## Boundary Quality Check

Before review dispatch, verify:

- Reviewers can tell what should affect approval.
- Reviewers can tell what should be noted but not block approval.
- Planned follow-up work is visible and explicitly non-blocking.
- The review boundary matches the latest user instruction and current brief.
- The packet can be built without relying on hidden chat context.
