---
name: execution-brief
description: Create and maintain a durable, source-grounded Execution Brief artifact for agentic kickoff, execution, resume-after-compression, and review readiness. Use when handing work to another agent, resuming implementation after planning, preserving execution context on disk, preparing review-ready context, or producing an execution artifact with objective, scope, review boundaries, validation gates, stop conditions, planned follow-up work, and revision history.
---

# Execution Brief

## Overview

Create a durable Execution Brief on disk before execution depends on fragile chat context. Treat the brief as the current source-grounded operating artifact for kickoff, execution, context-compression recovery, and review. Keep it concise, source-backed, intentionally revised, and directly usable by another agent without rereading the full thread.

The artifact path is:

```text
./.codefactory/execution-briefs/<brief-id>/execution-brief.md
```

## Durable Artifact Context Contract

This skill writes durable planning state to the filesystem. A written file is
not automatically in model context. After creating or updating an Execution
Brief:

1. Write the artifact to disk.
2. Perform the semantic quality and compactness check.
3. Run validation and checksum steps when available.
4. Re-read the artifact from disk before relying on its contents.
5. Return the exact artifact path, validation status, checksum path when
   present, and stop conditions.

At kickoff, handoff, resume after context compression, or review preparation:

1. Read the relevant Execution Brief from disk first.
2. Verify checksum or validation state when present.
3. Treat newer explicit user instructions as higher authority than the brief.
4. If scope, constraints, validation gates, review boundaries, or stop
   conditions changed, update the brief and revision log before continuing.
5. Do not rely on chat memory, summaries, or the fact that the artifact was
   recently written.

## Required Workflow

Follow these steps in order.

### Step 1: Establish the artifact location

Choose a stable `brief_id` from the work item, branch, ticket, or short slug. Create or update:

- `./.codefactory/execution-briefs/<brief-id>/execution-brief.md`
- `./.codefactory/execution-briefs/<brief-id>/execution-brief.sha256`

Read [references/artifact-lifecycle.md](references/artifact-lifecycle.md) before creating, resuming, or updating the artifact.

For a new brief, declare `compactness_contract: source-v1` in frontmatter. A
legacy brief without this field migrates only when its execution contract is
materially revised; opening, resuming, or validating it is not a migration.

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

Use [profiles/execution-brief.yaml](profiles/execution-brief.yaml) as the required artifact structure and deterministic validation contract.

Apply these rules:

- write the artifact to disk, not only into chat
- use exact dates, issue IDs, file paths, branch names, worktree paths, and document titles when available
- separate confirmed facts from assumptions, inferences, and open questions
- make the first action executable by naming the first files, commands, tools, or artifacts to inspect or change
- define review boundaries before execution reaches review
- include planned follow-up work that should not affect current approval
- keep source text at or below the 10,000-code-unit advisory target when the
  content permits; never delete required execution controls merely to meet the
  target; `sourceLength` uses JavaScript UTF-16 code units
- keep new and materially revised briefs at or below the 14,000-code-unit hard
  maximum imposed by `compactness_contract: source-v1`
- treat the brief as a current snapshot: replace stale state instead of
  appending a running execution journal
- give each fact one primary owner: sources record authority and retrieval;
  scope records inclusion and approval impact; success criteria record required
  outcomes; the execution plan records next actions; validation gates record
  commands and evidence locations; stop conditions record escalation triggers
- keep detailed logs and evidence in their native artifacts; summarize only the
  current result and its path or commit in the brief
- include optional detail only when it materially changes execution, validation,
  handoff, or review; derive review-packet mappings at dispatch unless the
  mapping itself must be durable
- revise surgically and preserve unaffected text
- update `Revision Log` only for a material execution-contract revision;
  coalesce related edits from one execution or review cycle into one row
- do not add revision rows for wording compression, checksum refreshes,
  validation reruns, or ordinary implementation edits that do not change the
  execution contract
- do not silently rewrite existing scope, constraints, or review boundaries

### Step 5: Perform a quality and compactness check

Before validation and checksum, verify that the artifact answers:

- What is the actual goal?
- Which sources are authoritative?
- What has already been decided or implemented?
- What exactly should happen next?
- What is in scope and out of scope?
- What review boundary should prevent diff or scope creep?
- How will success be checked?
- What is still uncertain?
- When should an agent stop and ask for direction?
- Does each material fact have one primary owner rather than repeated wording?
- Is the artifact a current snapshot rather than an accumulated journal?
- Does every optional detail materially affect execution, validation, handoff,
  or review?

Resolve missing answers and avoidable duplication now, before validation. Do
not run the checksum until this check is complete.

### Step 6: Validate and checksum the artifact

Validate the artifact with the installed bundled CLI and declarative profile:

```bash
"${MARKDOWN_ENGINE_BIN_DIR:-$HOME/.local/bin}/markdown-engine" validate --file ./.codefactory/execution-briefs/<brief-id>/execution-brief.md --profile <skill-dir>/profiles/execution-brief.yaml --format json
```

The profile uses `markdown-engine.validation@v2` and `sourceLength`; use the
shared CLI selected by the active fleet runtime policy.

Interpret compactness diagnostics as follows:

- `document.source-length.target` is an advisory warning. It does not make the
  aggregate result invalid and must not trigger a rewrite by itself.
- `document.source-length.maximum` is a blocking error for briefs that declare
  `compactness_contract: source-v1`. Revise the brief before use.
- A legacy brief without `compactness_contract` does not fail the hard maximum.
  Do not opt it in or compact it solely because it was opened or validated.

If validation fails, revise the artifact and validate again before using it as
execution or review context. When validation is valid, write the checksum:

```bash
shasum -a 256 ./.codefactory/execution-briefs/<brief-id>/execution-brief.md > ./.codefactory/execution-briefs/<brief-id>/execution-brief.sha256
```

### Step 7: Use the brief during execution

At kickoff or after context compression, read the Execution Brief before continuing. Treat it as the durable state snapshot unless a newer explicit user instruction overrides it.

Update the brief when execution changes the contract or the route another agent
must follow. Material changes include changed scope, validation gates,
blockers, planned follow-up work, review boundaries, stop conditions, or a
milestone that materially changes the next action. Ordinary code edits, test
reruns, review iterations, wording compression, and checksum refreshes are not
material revisions by themselves.

### Step 8: Prepare review-ready context

Before invoking any review workflow, read [references/review-boundaries.md](references/review-boundaries.md). Use the Execution Brief as the canonical planning artifact and map its sections into a review packet or reviewer prompt:

- `Objective` maps to the task objective.
- `Execution Scope` in-scope rows map to approval-affecting review scope.
- `Execution Scope` out-of-scope rows map to non-goals.
- `Context / Constraints` maps to constraints and accepted tradeoffs.
- `Review Boundary` maps directly to the approval boundary reviewers must apply.
- `Planned Follow-up Work` maps to deferred non-blocking work.
- `Validation Gates` maps to test or risk context.
- `Review Packet Inputs`, when a durable explicit mapping is needed, records the
  exact review-context fields reviewers should receive.

Do not allow planned follow-up work or out-of-scope improvements to become blocking review feedback unless the current diff creates a correctness, safety, regression, or maintainability issue inside the stated review boundary.

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
- correct mechanical compactness, validation, wording, and checksum issues
  silently; report the final state or a blocker that requires user action, not
  each internal repair pass

## Reference Files

- Read [references/source-priority.md](references/source-priority.md) when deciding authority, freshness, or how to merge thread, planning, design, artifact, and code state.
- Read [references/artifact-lifecycle.md](references/artifact-lifecycle.md) before creating, resuming, validating, checksumming, or revising an Execution Brief.
- Read [references/review-boundaries.md](references/review-boundaries.md) before preparing review context or review packet inputs.
- Use [profiles/execution-brief.yaml](profiles/execution-brief.yaml) as the required artifact structure and markdown-engine validation profile.
