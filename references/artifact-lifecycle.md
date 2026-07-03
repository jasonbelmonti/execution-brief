# Artifact Lifecycle

Use this reference before creating, resuming, validating, checksumming, or
revising an Execution Brief.

## Required Location

Write the brief inside the target workspace:

```text
./.codex/execution-briefs/<brief-id>/execution-brief.md
./.codex/execution-briefs/<brief-id>/execution-brief.sha256
```

Choose `<brief-id>` from the ticket ID, branch name, PR number, or a short
hyphen-case slug. Keep the ID stable for the work item.

## Creation Procedure

1. Gather the source inventory before writing the brief.
2. Draft a brief that satisfies `profiles/execution-brief.yaml`.
3. Populate required sections with source-grounded facts.
4. Mark missing sources and open questions explicitly.
5. Validate the brief with `profiles/execution-brief.yaml`.
6. Write the SHA-256 checksum file.
7. Return the brief path, validation result, checksum path, and stop conditions.

## Checksum Procedure

Run from the target workspace:

```bash
shasum -a 256 ./.codex/execution-briefs/<brief-id>/execution-brief.md > ./.codex/execution-briefs/<brief-id>/execution-brief.sha256
```

Use the checksum as a drift signal. It does not replace the `Revision Log`.

## Resume Procedure

When execution resumes after context compression or handoff:

1. Read the on-disk Execution Brief first.
2. Verify the checksum when the checksum file exists.
3. Load only the named sources needed to continue or verify freshness.
4. Apply newer explicit user instructions over stale brief content.
5. Update `Revision Log`, validate, and rewrite the checksum after material
   changes.

## Allowed Updates

Update the brief when a material execution fact changes:

- objective, scope, constraints, or non-goals
- source authority, retrieval status, or missing inputs
- implementation status, known gaps, or blockers
- validation gates, validation results, or confidence risks
- planned follow-up work
- review boundary or approval-impact rules
- stop conditions

Do not update the brief for incidental chat phrasing, unrelated repo state, or
speculative future work that is not part of the current execution boundary.

## Revision Log Rules

Every intentional material update requires a `Revision Log` row with:

- timestamp in an exact date-time format
- actor, such as `codex` or a named human
- concise change summary
- checksum value or `pending` before the new checksum is written

Never silently rewrite old revision rows. Add a new row.

## Compression Safety Rules

- Treat the brief as the durable memory surface.
- Keep the brief compact enough to read quickly after compression.
- Keep source references concrete enough to reload missing context.
- Do not depend on chat-only details for scope, review boundaries, or stop
  conditions.
- If the brief and current thread conflict, follow `source-priority.md` and then
  revise the brief.
