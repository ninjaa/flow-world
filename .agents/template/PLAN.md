# ExecPlan Template

_A living design + execution record for one concrete task or slice._

This plan must be **self-contained**.
A new contributor should be able to resume from this file, `PLAN.md`, and the current diff without hunting through chat logs.

Keep these sections current as work proceeds:

- `Progress`
- `Surprises & Discoveries`
- `Decision Log`
- `Verification Evidence`
- `Outcome / Retrospective`

---

## Metadata

- **Owner:** <name or team>
- **Created:** <YYYY-MM-DD>
- **Last Updated:** <YYYY-MM-DD>
- **Status:** <draft | active | blocked | done>
- **Issue / Slug:** <beads-id or readable slug>
- **Scope / Area:** <subsystem, feature, or path>
- **Branch / PR:** <branch name, PR link, or n/a>
- **Related Plans:** <links or paths>
- **Depends on:** <plans / issues / none>
- **Blocks:** <plans / issues / none>
- **Repo Plan:** `../../PLAN.md`

---

## Task

State the task in one sentence.
Include the visible or testable done condition.

> Example: “Add a first-pass world editor shell so a user can create, save, and reload a scene from the local app.”

---

## Why this matters

Explain the user or system value.
Focus on observable outcomes, not just internal refactors.

---

## Context and Orientation

Summarize the current state so another contributor can re-enter quickly.
Include:

- where this fits in the repo
- relevant files / directories (full relative paths)
- current behavior
- constraints / assumptions
- interfaces, dependencies, or external services involved
- prior attempts or known dead ends
- domain terms that are not obvious

---

## Plan of Work

Break the work into concrete, testable steps.
For each step, capture:

- **Files / Areas touched**
- **Change**
- **Commands** (include working directory)
- **Validation / acceptance**
- **Recovery / rollback**
- **Artifacts / evidence to capture**

### Step 1 — <title>
- **Files / Areas:**
- **Change:**
- **Commands:**
  ```bash
  # from <working-directory>
  <command>
  ```
- **Validation / acceptance:**
- **Recovery / rollback:**
- **Artifacts / evidence:**

### Step 2 — <title>
- **Files / Areas:**
- **Change:**
- **Commands:**
  ```bash
  # from <working-directory>
  <command>
  ```
- **Validation / acceptance:**
- **Recovery / rollback:**
- **Artifacts / evidence:**

### Step 3 — <title>
- **Files / Areas:**
- **Change:**
- **Commands:**
  ```bash
  # from <working-directory>
  <command>
  ```
- **Validation / acceptance:**
- **Recovery / rollback:**
- **Artifacts / evidence:**

---

## Progress

Track status with UTC timestamps.
Split partial progress into done vs. remaining.

- [ ] (YYYY-MM-DD HH:MM Z) Step 1
- [ ] (YYYY-MM-DD HH:MM Z) Step 2
- [ ] (YYYY-MM-DD HH:MM Z) Step 3

---

## Surprises & Discoveries

Log unexpected findings as they appear.
Each entry should include the evidence behind the observation.

- **Observation:**
- **Evidence:**
- **Impact:**

---

## Decision Log

Record material choices so future contributors do not re-litigate them.

- **Decision:**
- **Rationale:**
- **Date / Author:**

---

## Verification Evidence

Capture what proves the work is correct.
Prefer exact commands and concise result summaries.

- **Command:** `...`
- **Result:**
- **Notes:**

Include:

- tests run
- lint / typecheck / build output summaries
- manual checks
- anything intentionally not run

---

## Risks / Open Questions

- Remaining technical risk
- Ambiguities
- Follow-up work that should become separate issues or plans

---

## Handoff Notes

What should the next contributor know?
Include blockers, partial work, temp branches, or links to artifacts.

---

## Outcome / Retrospective

Fill this in when stopping or finishing.

- **Result:** <success | partial success | blocked | abandoned>
- **What changed:**
- **What was verified:**
- **What remains:**
- **Lessons:**
