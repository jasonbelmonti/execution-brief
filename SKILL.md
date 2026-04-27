---
name: handoff-prompt
description: Generate a standardized, source-grounded handoff prompt for the next agent by synthesizing the current thread, project-management artifacts such as Jira or Linear, design or architecture documentation, and current implementation state. Use when handing work to another agent, resuming execution after planning, creating an execution brief, or producing an agentic execution prompt with concrete first actions, validation gates, constraints, stop conditions, and open questions from mixed sources.
---

# Handoff Prompt

## Overview

Generate a self-contained handoff prompt that gives the next agent the right context to execute correctly without rereading the full thread. Build a current-state snapshot across planning, design, and implementation, then turn it into clear execution guidance with explicit success criteria, constraints, validation gates, stop conditions, and open questions.

## Required Workflow

Follow these steps in order. Keep the final handoff prompt concise, source-grounded, and directly usable as the next prompt.

### Step 1: Build a source inventory

Start with the current thread. List every source that materially affects execution:
- latest user instructions and decisions in the thread
- repo-local operating instructions such as `AGENTS.md`
- project-management artifacts referenced in the thread or available via tools
- design docs, architecture notes, PRDs, RFCs, screenshots, or planning docs
- implementation state in the workspace: branch, worktree, relevant files, diffs, tests, and known gaps

If a ticket, page, file, or document is named but its contents have not been loaded yet, fetch it before drafting the handoff prompt. Do not rely on titles or memory alone.

Record source names, dates or timestamps when available, and retrieval status. Mark any referenced but unavailable source as missing input in the final prompt.

Read [references/source-priority.md](references/source-priority.md) before resolving conflicts or freshness.

### Step 2: Extract only execution-relevant state

For each source, pull only the facts the next agent needs to execute:
- objective and why it matters
- current status and what is already decided
- current implementation state and notable incomplete work
- constraints, dependencies, non-goals, and blockers
- materially verifiable success criteria
- risks, unknowns, and assumptions
- required validation commands, manual checks, review gates, or rollout checks
- stop conditions that require asking the user, changing scope, or escalating

Prefer direct facts over interpretation. Do not include background that will not change execution.

### Step 3: Normalize planning and design context

When a project-management artifact exists, normalize it into these headings even if the source uses different labels:

#### Objective
What are we trying to achieve, and why does it matter?

#### Context / Constraints
Relevant background, dependencies, assumptions, non-goals, and implementation constraints.

#### Materially verifiable success criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

#### Execution notes
Suggested approach, likely files or systems, risks, open questions, and handoff notes.

Preserve the source meaning. Do not invent missing criteria just to fill the shape; mark gaps explicitly.

If success criteria are vague, convert only directly supported expectations into checkable criteria and mark the rest as an open gap.

### Step 4: Resolve contradictions

Prefer the highest-authority, freshest source. If sources disagree:
- keep the conflict visible
- state which source you trust and why
- mark anything not directly supported as `Assumption` or `Inference`
- use exact dates instead of relative dates

When current code state conflicts with an older ticket or design doc, report both. Intended behavior and implemented behavior are different facts.

### Step 5: Write the handoff prompt

Use [references/handoff-template.md](references/handoff-template.md) as the output contract.

Apply these rules:
- write to the next agent in imperative form
- make the next action executable: name the first files, commands, tools, or artifacts to inspect or change
- include exact issue IDs, file paths, branch or worktree names, and document titles when available
- separate confirmed facts from assumptions and unknowns
- mention missing sources instead of guessing
- keep the prompt self-contained, but omit irrelevant conversation history
- keep the output compact unless the user explicitly asks for exhaustive detail
- include validation gates that prove success and stop conditions that prevent unsafe guessing
- if multiple agents may use the prompt, define ownership boundaries or disjoint work areas when known

### Step 6: Perform a handoff quality check

Before returning the handoff prompt, verify that the next agent can answer these questions without rereading the full thread:
- What is the actual goal?
- What sources are authoritative?
- What has already been decided or implemented?
- What exactly should I do next?
- How will success be checked?
- What is still uncertain?
- When should I stop and ask for direction instead of continuing?

If any answer is missing, revise the prompt.

## Output Expectations

The final output should be a ready-to-send handoff prompt, not a meta-explanation of how you gathered context.

Always:
- anchor the prompt in the current thread first
- distinguish confirmed facts from inferred guidance
- preserve materially verifiable success criteria
- include concrete first actions
- include validation gates and stop conditions
- state blockers and missing inputs plainly

## Reference Files

- Read [references/source-priority.md](references/source-priority.md) when deciding authority, freshness, or how to merge thread, planning, design, and code state.
- Read [references/handoff-template.md](references/handoff-template.md) immediately before drafting the final handoff prompt.
