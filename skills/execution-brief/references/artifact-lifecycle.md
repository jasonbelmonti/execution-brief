# Artifact Lifecycle

Use this reference before creating, resuming, validating, checksumming, or
revising an Execution Brief.

## Required Location

Write the brief inside the target workspace:

```text
./.codefactory/execution-briefs/<brief-id>/execution-brief.md
./.codefactory/execution-briefs/<brief-id>/execution-brief.sha256
```

Choose `<brief-id>` from the ticket ID, branch name, PR number, or a short
hyphen-case slug. Keep the ID stable for the work item.

## Creation Procedure

1. Gather the source inventory before writing the brief.
2. Draft a brief that satisfies `profiles/execution-brief.yaml`, declares
   `compactness_contract: source-v1`, and stays within its source budget.
3. Populate required sections with source-grounded facts.
4. Mark missing sources and open questions explicitly.
5. Perform the semantic quality and compactness check.
6. Validate the brief with `profiles/execution-brief.yaml`.
7. If validation is invalid, revise and validate again; otherwise write the
   SHA-256 checksum file.
8. Re-read the brief from disk.
9. Return the brief path, validation result, checksum path, and stop conditions.

## Compactness and Migration Procedure

- The profile measures raw Markdown source, including frontmatter and syntax,
  in JavaScript UTF-16 code units.
- A source length above 10,000 code units produces an advisory warning.
  Preserve required controls and do not revise solely to remove this warning.
- `compactness_contract: source-v1` activates a hard 14,000-code-unit maximum.
  New briefs must declare it and satisfy the maximum.
- A legacy brief without the field remains valid beyond the hard maximum. Do
  not add the field, compact the brief, or revise its log solely because the
  brief was read, resumed, or validated.
- On the next material execution-contract revision, migrate a legacy brief by
  adding the field, converting accumulated state into a concise current
  snapshot, and satisfying the hard maximum before checksum.

## Checksum Procedure

Run from the target workspace:

```bash
shasum -a 256 ./.codefactory/execution-briefs/<brief-id>/execution-brief.md > ./.codefactory/execution-briefs/<brief-id>/execution-brief.sha256
```

Use the checksum as a drift signal. It does not replace the `Revision Log`.

## Resume Procedure

When execution resumes after context compression or handoff:

1. Read the on-disk Execution Brief first.
2. Verify the checksum when the checksum file exists.
3. Load only the named sources needed to continue or verify freshness.
4. Apply newer explicit user instructions over stale brief content.
5. If the execution contract changed materially, update the current snapshot,
   migrate a legacy brief to `source-v1`, and add one coalesced `Revision Log`
   row for the cycle.
6. Perform the quality and compactness check, validate, and rewrite the checksum
   after material changes.
7. Re-read the brief before relying on it.

## Allowed Updates

Update the brief when a material execution fact changes:

- objective, scope, constraints, or non-goals
- source authority, retrieval status, or missing inputs
- implementation status or blockers that materially change the next action
- validation gates or confidence risks
- planned follow-up work
- review boundary or approval-impact rules
- stop conditions

Replace stale state in place; do not append a journal. Do not update the brief
for incidental chat phrasing, ordinary code edits, test reruns, validation
results already recorded in their native evidence, checksum refreshes, wording
compression, unrelated repo state, or speculative future work outside the
current execution boundary.

## Revision Log Rules

Every material execution-contract revision requires one `Revision Log` row
with:

- timestamp in an exact date-time format
- actor, such as `codex` or a named human
- concise change summary
- checksum value or `pending` before the new checksum is written

Coalesce related changes from one execution or review cycle. Never silently
rewrite old revision rows. Do not add rows for mechanical artifact maintenance
or ordinary implementation progress.

## Compression Safety Rules

- Treat the brief as the durable memory surface.
- Keep the brief compact enough to read quickly after compression.
- Keep one primary owner for each fact and represent current state instead of a
  chronological execution journal.
- Keep source references concrete enough to reload missing context.
- Do not depend on chat-only details for scope, review boundaries, or stop
  conditions.
- If the brief and current thread conflict, follow `source-priority.md` and then
  revise the brief.
