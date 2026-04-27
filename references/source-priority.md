# Source Priority

Use this reference when gathering context for a next-agent handoff or dispatch thread seed prompt.

## Authority Order

Use this order unless the user explicitly instructs otherwise:

1. Current-thread user instructions and explicit decisions
2. Repo-local operating instructions such as `AGENTS.md`
3. Current project-management artifact of record
4. Current design or architecture documentation tied to the work item
5. Current implementation state in the workspace
6. Older thread context, stale tickets, or historical notes
7. Your own inferences

## Freshness Rules

- Prefer newer sources over older sources within the same authority level.
- Prefer direct artifacts over summaries of those artifacts.
- Prefer the latest explicit user instruction in the current thread over older summaries or inferred intent.
- Prefer observed code state over stale descriptions when answering "what exists right now?"
- Prefer planning artifacts over code state when answering "what is the intended scope or priority?"
- Prefer design artifacts over ticket prose when answering "what behavior should the implementation have?"

## Domain Mapping

Treat each source type as authoritative for different questions:

- Thread: latest intent, approvals, scope changes, and priorities
- Project management: work item framing, owners, dependencies, milestone context, and success criteria
- Design docs: intended behavior, architecture, tradeoffs, and non-goals
- Code state: what is currently implemented, broken, missing, or already validated
- Validation signals: what has been proven, what failed, and what still needs checking

## Conflict Handling

When sources disagree:

1. State the disagreement plainly.
2. Name the sources and, when possible, include dates or timestamps.
3. Choose the controlling source based on authority plus freshness.
4. Preserve the lower-confidence information as `Assumption`, `Inference`, or `Open question`.

Do not silently merge conflicting facts into a fake consensus.

## Required Normalization

When a planning artifact exists, normalize its useful content into:

### Objective
What are we trying to achieve, and why does it matter?

### Context / Constraints
Relevant background, dependencies, assumptions, non-goals, and implementation constraints.

### Materially verifiable success criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Execution notes
Suggested approach, likely files or systems, risks, open questions, and handoff notes.

If the source does not provide enough information to fill one of these sections, leave the gap visible.

## Execution Control Mapping

Convert source facts into execution controls for the handoff prompt:

- Next actions: highest-priority, source-supported operations the next agent can perform immediately
- Ownership boundaries: files, systems, tickets, or domains that are in scope or explicitly out of scope
- Validation gates: tests, commands, review checks, screenshots, manual checks, or rollout checks required to prove success
- Stop conditions: missing credentials, unavailable sources, conflicting requirements, failing validation outside scope, destructive operations, or unclear user intent

Do not turn weak hints into commands. Mark unsupported guidance as `Assumption` or `Inference`.
