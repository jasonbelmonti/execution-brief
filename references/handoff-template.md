# Handoff Prompt Template

Use this template to produce the final handoff prompt. Adapt only when the user asks for a different format.

## Template

```md
You are taking over work on <initiative or task name>. Treat this prompt as the current source-grounded snapshot and handoff guidance.

As of <YYYY-MM-DD HH:MM TZ>:

### Objective
<What we are trying to achieve and why it matters>

### Authoritative sources
- <source name or title> (<date or retrieval status>): <why it is authoritative and what it controls>

### Current status
- Planning / PM: <scope, priority, dependencies, owners, blockers>
- Design: <intended behavior, constraints, non-goals>
- Implementation: <what exists, relevant files, diffs, branches, worktrees, incomplete pieces>
- Validation: <tests run, gaps, known failures, or unverified areas>

### Handoff execution plan
1. <highest-priority next action>
2. <second action>
3. <third action>

### Agentic execution contract
- First action: <specific file, command, tool call, ticket, or document to inspect or change first>
- Ownership boundary: <files, systems, or work areas in scope; name anything explicitly out of scope>
- Validation gates: <tests, checks, review steps, or manual verification required before reporting done>
- Stop conditions: <conditions that require asking the user, escalating, or revising scope>

### Context / Constraints
- <constraint>
- <non-goal>
- <dependency>

### Materially verifiable success criteria
- [ ] <criterion>
- [ ] <criterion>
- [ ] <criterion>

### Execution notes
- <relevant file paths, likely systems, or suggested sequence>
- <risk or edge case to watch>
- <handoff note>

### Confirmed facts
- <fact>

### Assumptions / Inferences
- <assumption>

### Open questions / Missing inputs
- <question or blocker>

### Recommended first steps
1. <first check or read>
2. <first edit or tool call>
3. <first validation step>
```

## Drafting Rules

- Write as if the next agent will start from this prompt alone.
- Use exact dates, issue IDs, document titles, branch names, and absolute file paths when available.
- Keep the prompt concise; include only context that changes execution.
- If a critical source is missing, say so directly instead of guessing.
- Keep `Confirmed facts`, `Assumptions / Inferences`, and `Open questions / Missing inputs` separate.
- Make every execution instruction concrete enough for an agent to act on without rereading the original thread.
- Include stop conditions when missing context, failing validation, permission boundaries, or scope conflicts should halt execution.
