# AGENTS.md

Repository-local instructions for AI coding agents working in `flow-world`.
This file supplements the broader OMX / global agent contract with repo-specific workflow rules.

## Project posture

This repository uses the **openai-codex-exec-plan** workflow as the default starting point, with a few modernizations:

- Keep **repo-level direction** in `PLAN.md`.
- Keep **task-level execution plans** in `.agents/plans/<issue-or-slug>/PLAN.md`.
- Use **Beads** (`bd`) when work spans sessions, has dependencies, or needs durable tracking.
- Prefer **current** frontier GPT-5 / Codex-capable models supported by local tooling instead of freezing stale model IDs into docs or commands.
- Prefer **tests first** for substantive behavior changes; if you intentionally skip TDD, say why in the task plan.

## Current repo state

This repo is still in bootstrap mode.
If the codebase is sparse, start by updating `PLAN.md` and creating the first task plan before making large edits.

## Workflow: PLAN.md + Beads + Exec Plans

| Artifact / Tool | Purpose | Source of truth for |
| --- | --- | --- |
| `PLAN.md` | Repo-level roadmap and current phase | Why this repo exists / what matters next |
| `.agents/plans/<issue-or-slug>/PLAN.md` | Task-level living execution record | How a specific slice gets done |
| `bd` / `.beads/` | Durable task queue and dependencies | What is queued / blocked / in progress |
| `.agents/beads.md` | Beads reference | Exact CLI usage and conventions |

### Starting work

1. **Read `PLAN.md` first** for repo goals, current phase, and open questions.
2. **Pick or create a task**:
   - If beads is already in use, prefer:
     ```bash
     bd ready --priority 0,1,2,3 --json
     ```
   - If this is still early bootstrap work, use a readable slug (for example `bootstrap`, `auth-shell`, `editor-v1`) even before beads is initialized.
3. **Create an exec plan before substantive edits**:
   ```bash
   mkdir -p .agents/plans/<issue-or-slug>
   cp .agents/template/PLAN.md .agents/plans/<issue-or-slug>/PLAN.md
   ```
4. **Work from the plan**:
   - keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Verification Evidence` current
   - capture exact commands, expected outputs, and rollback notes
   - keep diffs small, reviewable, and reversible
5. **Close the loop**:
   - run the relevant verification for the slice
   - update `PLAN.md` if priorities or milestones changed
   - close / sync the beads item when one exists

### Naming conventions

- Use a **beads issue ID** when the task is tracked in beads.
- Use a **short readable slug** when the task is not yet in beads.
- Good plan directories:
  - `.agents/plans/fw-101/PLAN.md`
  - `.agents/plans/bootstrap/PLAN.md`
  - `.agents/plans/first-playable-loop/PLAN.md`

## Exec plan expectations

Every task plan should be self-contained enough that another contributor can resume with just:

- the task plan itself
- the repo-level `PLAN.md`
- the current branch / diff

That means each plan should include:

- the goal and visible success condition
- the relevant files and interfaces
- exact commands to run
- acceptance / verification criteria
- recovery notes for risky steps
- a running log of discoveries and decisions

## Beads usage

See `.agents/beads.md` for the full reference.
Default posture:

- use beads for multi-session or dependency-heavy work
- skip backlog (`P4`) when choosing autonomous work
- close issues with a real reason, not just "done"

## External-model consultation

When you need a second opinion or a large-context read:

1. Check the currently supported models in the local tool first.
2. Prefer the **current frontier GPT-5 browser-capable model** for deep reasoning / critique.
3. Prefer the **current highest-context Gemini model** for broad summarization / large-file digestion.
4. Do not hardcode stale model names into new docs unless the environment requires them.

## Commit style

- Use **intent-first** commit subjects.
- For non-trivial commits, prefer Lore-style trailers when helpful:
  - `Constraint:`
  - `Rejected:`
  - `Confidence:`
  - `Scope-risk:`
  - `Directive:`
  - `Tested:`
  - `Not-tested:`

## Rules

1. Never delete files without explicit human permission.
2. No destructive git commands (`reset --hard`, `clean -fd`, `rm -rf`) without explicit approval.
3. Create or update an exec plan before substantive work.
4. Keep `PLAN.md` current when roadmap-level decisions change.
5. Prefer statements over hedging; lead with the answer.
