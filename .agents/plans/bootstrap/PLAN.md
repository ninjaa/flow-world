# ExecPlan — Bootstrap the flow-world workflow scaffold

_A living design + execution record for the initial repo setup._

---

## Metadata

- **Owner:** Codex
- **Created:** 2026-04-23
- **Last Updated:** 2026-04-23
- **Status:** done
- **Issue / Slug:** bootstrap
- **Scope / Area:** repo scaffolding
- **Branch / PR:** n/a
- **Related Plans:** none
- **Depends on:** none
- **Blocks:** first substantive task plans
- **Repo Plan:** `../../PLAN.md`

---

## Task

Set up `AGENTS.md`, repo-level `PLAN.md`, and a modernized `.agents/` scaffold so future work in `flow-world` follows a consistent exec-plan workflow.

---

## Why this matters

The repo was effectively empty, so future agents had no local workflow contract, no repo-level roadmap file, and no task-plan scaffold.
This setup makes the first real feature easier to start and easier to resume.

---

## Context and Orientation

Current state before this work:

- repo root contained only `.omx/`
- no git repository was initialized
- no `AGENTS.md`, `PLAN.md`, or `.agents/` folder existed
- sibling projects such as `openai-codex-exec-plan`, `parameta-trades`, `phabulous`, and `tooltool` all used some flavor of exec-plan scaffolding

Relevant paths created by this task:

- `AGENTS.md`
- `PLAN.md`
- `.agents/beads.md`
- `.agents/template/PLAN.md`
- `.agents/plans/bootstrap/PLAN.md`
- `.agents/.gitignore`

---

## Plan of Work

### Step 1 — Inspect sibling templates
- **Files / Areas:** sibling repos under `/Users/ad_p_/Projects`
- **Change:** compare `AGENTS.md`, `.agents/`, and plan-template patterns to choose a base scaffold
- **Commands:**
  ```bash
  # from /Users/ad_p_/Projects/flow-world
  ls -la /Users/ad_p_/Projects
  python - <<'PY'
  import os
  root='/Users/ad_p_/Projects'
  for name in sorted(os.listdir(root)):
      path=os.path.join(root,name)
      if os.path.isdir(path) and (
          os.path.exists(os.path.join(path,'AGENTS.md')) or
          os.path.exists(os.path.join(path,'PLAN.md')) or
          os.path.isdir(os.path.join(path,'.agents'))
      ):
          print(name)
  PY
  ```
- **Validation / acceptance:** enough examples identified to pick a consistent base
- **Recovery / rollback:** read-only inspection only
- **Artifacts / evidence:** list of sibling repos using these patterns

### Step 2 — Draft the modernized scaffold
- **Files / Areas:** repo-root docs and `.agents/`
- **Change:** use `openai-codex-exec-plan` as the base, but modernize it with a repo-level plan, readable slug support, and a more practical exec-plan template
- **Commands:**
  ```bash
  # from /Users/ad_p_/Projects/flow-world
  python - <<'PY'
  print('draft scaffold content')
  PY
  ```
- **Validation / acceptance:** files are coherent, self-consistent, and adapted to an early-stage repo
- **Recovery / rollback:** rewrite the docs before finalizing if the structure is awkward
- **Artifacts / evidence:** final file tree + file contents

### Step 3 — Write files and verify structure
- **Files / Areas:** repo root + `.agents/`
- **Change:** create the scaffold and confirm the new structure exists
- **Commands:**
  ```bash
  # from /Users/ad_p_/Projects/flow-world
  find . -maxdepth 3 -type f | sort
  ```
- **Validation / acceptance:** all intended files exist and contain the expected scaffolding
- **Recovery / rollback:** delete or edit the created docs if the structure needs to change
- **Artifacts / evidence:** verified file listing

---

## Progress

- [x] (2026-04-23 21:40 Z) Inspected sibling templates and chose `openai-codex-exec-plan` as the base
- [x] (2026-04-23 21:45 Z) Drafted a modernized repo-local AGENTS / PLAN / exec-plan template set
- [x] (2026-04-23 21:47 Z) Wrote the scaffold files and verified the resulting structure

---

## Surprises & Discoveries

- **Observation:** `flow-world` was not yet a git repository.
- **Evidence:** `git rev-parse --is-inside-work-tree` returned `not-git`.
- **Impact:** the scaffold had to stay repo-agnostic and could not rely on existing git metadata.

- **Observation:** sibling repos split into two patterns: informal root `PLAN.md` files and structured `.agents` exec-plan setups.
- **Evidence:** `openai-codex-exec-plan`, `parameta-trades`, `phabulous`, and `tooltool` all used `.agents`, while `jailborked` and `storyteller` only had root plans.
- **Impact:** this repo now uses both: a root roadmap plus task-level exec plans.

---

## Decision Log

- **Decision:** Base the scaffold on `openai-codex-exec-plan` instead of the looser root-plan-only examples.
- **Rationale:** it already matched the user's preferred workflow and had the cleanest starting structure.
- **Date / Author:** 2026-04-23 / Codex

- **Decision:** Keep a repo-root `PLAN.md` in addition to `.agents/template/PLAN.md`.
- **Rationale:** the repo is still undefined, so a roadmap / north-star doc is useful alongside task-specific exec plans.
- **Date / Author:** 2026-04-23 / Codex

- **Decision:** Modernize the template by avoiding hardcoded stale model IDs and by allowing readable plan slugs before beads exists.
- **Rationale:** the repo is at bootstrap stage, and the tool/model layer will keep changing.
- **Date / Author:** 2026-04-23 / Codex

---

## Verification Evidence

- **Command:** `find . -maxdepth 3 -mindepth 1 | sort`
- **Result:** confirmed the newly created repo files and `.agents/` tree exist
- **Notes:** repo now has local workflow scaffolding

- **Command:** `git rev-parse --is-inside-work-tree 2>/dev/null || echo 'not-git'`
- **Result:** `not-git`
- **Notes:** useful context captured in the plan

---

## Risks / Open Questions

- The actual product definition for Flow World is still blank.
- The first real task plan should replace placeholders in `PLAN.md` with concrete scope.
- If beads becomes part of the routine, the repo will eventually need `.beads/` initialization and issue conventions.

---

## Handoff Notes

Next contributor should:

1. replace the TBD sections in `PLAN.md`
2. create the first non-bootstrap task plan under `.agents/plans/`
3. decide whether to initialize beads now or after the first few tasks

---

## Outcome / Retrospective

- **Result:** success
- **What changed:** added repo-local workflow docs and `.agents/` scaffold
- **What was verified:** file structure and key contents were created as intended
- **What remains:** actual product definition and the first real implementation plan
- **Lessons:** combining a root roadmap with task-level exec plans fits early-stage repos better than using either pattern alone
