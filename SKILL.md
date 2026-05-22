---
name: execution-brief
description: Create and maintain a durable, source-grounded Execution Brief artifact for agentic kickoff, execution, resume-after-compression, and review readiness. Use when handing work to another agent, resuming implementation after planning, preserving execution context on disk, preparing consensus-review inputs, or producing an execution artifact with objective, scope, review boundaries, validation gates, stop conditions, planned follow-up work, and revision history.
---

# Execution Brief

## Overview

Create a durable Execution Brief on disk before execution depends on fragile chat context. Treat the brief as the current source-grounded operating artifact for kickoff, execution, context-compression recovery, and review. Keep it concise, source-backed, intentionally revised, and directly usable by another agent without rereading the full thread.

The artifact path is:

```text
./.codex/execution-briefs/<brief-id>/execution-brief.md
```

## Required Workflow

Follow these steps in order.

### Step 1: Establish the artifact location

Choose a stable `brief_id` from the work item, branch, ticket, or short slug. Create or update:

- `./.codex/execution-briefs/<brief-id>/execution-brief.md`
- `./.codex/execution-briefs/<brief-id>/execution-brief.sha256`

Read [references/artifact-lifecycle.md](references/artifact-lifecycle.md) before creating, resuming, or updating the artifact.

### Step 2: Build a source inventory

Start with the current thread. List every source that materially affects execution:

- latest user instructions and explicit decisions in the thread
- repo-local operating instructions such as `AGENTS.md`
- the existing Execution Brief, when resuming or revising one
- project-management artifacts referenced in the thread or available via tools
- design docs, architecture notes, PRDs, RFCs, screenshots, or planning docs
- implementation state in the workspace: branch, worktree, relevant files, diffs, tests, and known gaps

If a ticket, page, file, pull request, or document is named but its contents have not been loaded yet, fetch it before drafting or revising the brief. Do not rely on titles or memory alone.

Record source names, dates or timestamps when available, retrieval status, and what each source controls. Mark any referenced but unavailable source as missing input.

Read [references/source-priority.md](references/source-priority.md) before resolving conflicts or freshness.

### Step 3: Extract execution-relevant state

Pull only the facts the next agent needs to execute:

- objective and why it matters
- current status and what is already decided
- current implementation state and notable incomplete work
- constraints, dependencies, non-goals, and blockers
- materially verifiable success criteria
- risks, unknowns, assumptions, and accepted tradeoffs
- review boundary, out-of-scope work, and planned follow-up work
- required validation commands, manual checks, review gates, or rollout checks
- stop conditions that require asking the user, changing scope, or escalating

Prefer direct facts over interpretation. Mark unsupported guidance as `Assumption` or `Inference`.

### Step 4: Write or revise the Execution Brief

Use [references/execution-brief-template.md](references/execution-brief-template.md) as the output contract.

Apply these rules:

- write the artifact to disk, not only into chat
- use exact dates, issue IDs, file paths, branch names, worktree paths, and document titles when available
- separate confirmed facts from assumptions, inferences, and open questions
- make the first action executable by naming the first files, commands, tools, or artifacts to inspect or change
- define review boundaries before execution reaches review
- include planned follow-up work that should not affect current approval
- keep the brief compact unless the user explicitly asks for exhaustive detail
- update `Revision Log` for every intentional artifact revision
- do not silently rewrite existing scope, constraints, or review boundaries

### Step 5: Validate and checksum the artifact

Validate the artifact with the bundled profile:

```bash
npx -y @jasonbelmonti/markdown-engine@2.0.0 validate --file ./.codex/execution-briefs/<brief-id>/execution-brief.md --profile <skill-dir>/profiles/execution-brief.yaml
```

Then write a checksum:

```bash
shasum -a 256 ./.codex/execution-briefs/<brief-id>/execution-brief.md > ./.codex/execution-briefs/<brief-id>/execution-brief.sha256
```

If validation fails, revise the artifact before using it as execution or review context.

### Step 6: Use the brief during execution

At kickoff or after context compression, read the Execution Brief before continuing. Treat it as the durable state snapshot unless a newer explicit user instruction overrides it.

When execution changes material facts, update the brief and checksum immediately. Material facts include changed scope, changed validation gates, discovered blockers, completed milestones, new planned follow-up work, or changed review boundaries.

### Step 7: Prepare consensus-review context

Before invoking `consensus-review`, read [references/review-boundaries.md](references/review-boundaries.md). Use the Execution Brief as the canonical planning artifact and map its sections into the review packet:

- `Objective` maps to `task_definition.objective`
- `Execution Scope` in-scope rows map to `task_definition.in_scope`
- `Execution Scope` out-of-scope rows map to `task_definition.out_of_scope`
- `Review Boundary` maps directly to `review_boundary`
- `Planned Follow-up Work` maps to `planned_follow_up_work` and non-blocking out-of-scope context
- `Validation Gates` maps to `test_or_risk_context`
- `Consensus Review Packet Inputs` records the exact packet fields reviewers should receive

Do not allow planned follow-up work or out-of-scope improvements to become blocking review feedback unless the current diff creates a correctness, safety, regression, or maintainability issue inside the stated review boundary.

### Step 8: Perform a quality check

Before handing off, resuming execution, or dispatching review, verify that the artifact answers:

- What is the actual goal?
- Which sources are authoritative?
- What has already been decided or implemented?
- What exactly should happen next?
- What is in scope and out of scope?
- What review boundary should prevent diff or scope creep?
- How will success be checked?
- What is still uncertain?
- When should an agent stop and ask for direction?

If any answer is missing, revise the brief, validate it, and update the checksum.

## Output Expectations

Return the artifact path, validation status, checksum path, and any missing inputs or stop conditions. Do not replace the on-disk artifact with a chat-only summary.

Always:

- anchor the brief in the current thread first
- distinguish confirmed facts from assumptions and inferences
- preserve materially verifiable success criteria
- include concrete first actions
- include validation gates and stop conditions
- record review boundaries and planned follow-up work
- keep the revision log current
- state blockers and missing inputs plainly

## Reference Files

- Read [references/source-priority.md](references/source-priority.md) when deciding authority, freshness, or how to merge thread, planning, design, artifact, and code state.
- Read [references/artifact-lifecycle.md](references/artifact-lifecycle.md) before creating, resuming, validating, checksumming, or revising an Execution Brief.
- Read [references/review-boundaries.md](references/review-boundaries.md) before preparing review context or consensus-review packet inputs.
- Use [references/execution-brief-template.md](references/execution-brief-template.md) as the required artifact structure.
