# ExecPlan — Consolidate the Flow World tool-gating concept into one OSS spec

_A living design + execution record for the first real product-definition task._

---

## Metadata

- **Owner:** Codex
- **Created:** 2026-04-23
- **Last Updated:** 2026-04-23
- **Status:** done
- **Issue / Slug:** tool-gating-spec
- **Scope / Area:** repo strategy + product specification
- **Branch / PR:** n/a
- **Related Plans:** `.agents/plans/bootstrap/PLAN.md`
- **Depends on:** `.agents/plans/bootstrap/PLAN.md`
- **Blocks:** offline replay implementation work
- **Repo Plan:** `../../../PLAN.md`

---

## Task

Write one consolidated, open-source-safe spec for Flow World that turns the prompt-pack + structured-output + LightGBM technique into a tool-gating / request-sudo flow demo centered on OpenClaw hook integration.

---

## Why this matters

The ideas were spread across messy or crowded repos, especially `typesafe-experiments`, and the actual product direction was only partly captured in chat.
A clean spec is the shortest path to making the project buildable by future contributors without dragging NDA-bound or cluttered source material along.

---

## Context and Orientation

Relevant local inputs used for this spec:

- `/Users/ad_p_/Projects/typesafe-experiments-inspect/experiments/prompt-injection/pipeline_lib.py`
- `/Users/ad_p_/Projects/typesafe-experiments-inspect/experiments/prompt-injection/gemini_prompt_pack_check.py`
- `/Users/ad_p_/Projects/typesafe-experiments-inspect/reports/prompt-injection/prompt-pack-autoresearch-latest.md`
- `/Users/ad_p_/Projects/typesafe-experiments-inspect/reports/pr-root-issue/full-openclaw-open-prs.json`

Important user constraints:

- first demo domain should be tool governance, not just prompt classification
- OpenClaw hook support now exists and should shape the design
- request-sudo / approval routing is a first-class requirement
- TypeSafe itself is behind NDA, so the open-source project should capture the technique cleanly without leaking private implementation details
- preferred v1 model is Gemini 3.1 Flash Lite on OpenRouter

---

## Plan of Work

### Step 1 — Extract the reusable technique from the messy source repos
- **Files / Areas:** local clone of `typesafe-experiments`, local OpenClaw-related artifacts
- **Change:** inspect the prompt-pack / LightGBM pattern and the relevant OpenClaw hook descriptions
- **Commands:**
  ```bash
  # from /Users/ad_p_/Projects/flow-world
  rg -n -S "prompt-pack|gemini|LightGBM|before_llm_call|before_agent_reply|before_response_emit"     /Users/ad_p_/Projects/typesafe-experiments-inspect
  ```
- **Validation / acceptance:** enough evidence gathered to state the technique and the integration points cleanly
- **Recovery / rollback:** read-only inspection only
- **Artifacts / evidence:** file references recorded in the final spec

### Step 2 — Draft one consolidated spec
- **Files / Areas:** `SPEC.md`, `PLAN.md`
- **Change:** collapse the product idea, architecture, prompt-bank design, routing model, OpenClaw integration, request-sudo path, and MVP scope into one clear document
- **Commands:**
  ```bash
  # from /Users/ad_p_/Projects/flow-world
  python - <<'PY'
  print('draft spec content')
  PY
  ```
- **Validation / acceptance:** the spec should stand alone without requiring future contributors to dig through the messy source repos first
- **Recovery / rollback:** revise structure if the story feels too prompt-injection-centric or too abstract
- **Artifacts / evidence:** final `SPEC.md`

### Step 3 — Update repo-level plan and record the task plan
- **Files / Areas:** `PLAN.md`, `.agents/plans/tool-gating-spec/PLAN.md`
- **Change:** update repo direction to match the now-concrete product thesis and keep a task-level record of the decision
- **Commands:**
  ```bash
  # from /Users/ad_p_/Projects/flow-world
  find . -maxdepth 4 -type f | sort
  ```
- **Validation / acceptance:** the repo-level plan and task-level plan both point at the consolidated spec as the new source of truth
- **Recovery / rollback:** narrow the repo plan if it starts duplicating the full spec too much
- **Artifacts / evidence:** verified file list

---

## Progress

- [x] (2026-04-23 22:05 Z) Inspected the local prompt-pack / LightGBM artifacts and the available OpenClaw hook descriptions
- [x] (2026-04-23 22:15 Z) Drafted a single consolidated product / architecture spec for Flow World
- [x] (2026-04-23 22:20 Z) Updated repo-level planning docs and wrote the task plan

---

## Surprises & Discoveries

- **Observation:** the strongest local evidence for OpenClaw hook support was not in a clean repo checkout but in saved PR artifacts embedded inside the `typesafe-experiments` reports.
- **Evidence:** `reports/pr-root-issue/full-openclaw-open-prs.json` contains detailed PR bodies for `before_agent_reply`, `before_llm_call` / `after_llm_call`, and `before_response_emit` hooks.
- **Impact:** the spec can still be grounded, but the repo should eventually replace those second-hand references with direct code references or its own implementation.

- **Observation:** the useful Gemini work was the structured prompt-bank + LightGBM path, not the direct binary judge.
- **Evidence:** `experiments/prompt-injection/gemini_prompt_pack_check.py` uses structured JSON outputs and downstream LightGBM features, while `gemini_direct_check.py` is a simpler direct classifier.
- **Impact:** the Flow World spec explicitly centers the structured intermediate representation rather than a one-shot allow/deny judge.

---

## Decision Log

- **Decision:** make tool governance the first domain instead of prompt-injection detection.
- **Rationale:** it is more product-like, maps directly onto real OpenClaw behavior, and supports request-sudo as a compelling branch.
- **Date / Author:** 2026-04-23 / Codex

- **Decision:** keep one canonical `SPEC.md` at repo root.
- **Rationale:** the user explicitly wanted one consolidated spec because the source repos are messy and crowded.
- **Date / Author:** 2026-04-23 / Codex

- **Decision:** standardize v1 on Gemini 3.1 Flash Lite via OpenRouter plus LightGBM.
- **Rationale:** the user preferred a cheap, simple, open-source-friendly starting point.
- **Date / Author:** 2026-04-23 / Codex

---

## Verification Evidence

- **Command:** `find . -maxdepth 4 -type f | sort`
- **Result:** confirmed the presence of `SPEC.md`, updated `PLAN.md`, and the new task plan
- **Notes:** enough for documentation-only verification in this repo state

- **Command:** `rg -n -S "prompt-pack|gemini|LightGBM|before_llm_call|before_agent_reply|before_response_emit" /Users/ad_p_/Projects/typesafe-experiments-inspect`
- **Result:** found the key local source artifacts used to ground the spec
- **Notes:** these references are cited conceptually in the spec instead of copied wholesale

---

## Risks / Open Questions

- The exact OpenRouter slug for Gemini 3.1 Flash Lite still needs to be verified at implementation time.
- The request-sudo UX contract is still conceptual until tied to the real OpenClaw hook or approvals path.
- Session-derived labels may need manual cleanup before they are good enough for the first LightGBM training run.

---

## Handoff Notes

The next contributor should implement the smallest offline replay path from `SPEC.md` section 22.
Start with saved candidate actions, not live hooks.

---

## Outcome / Retrospective

- **Result:** success
- **What changed:** added a consolidated product / architecture spec and updated repo direction around it
- **What was verified:** file presence and the grounding references used for the spec
- **What remains:** actual prompt-bank, feature extraction, model training, replay UX, and live OpenClaw integration
- **Lessons:** the method is clean once separated from the cluttered experiment repos; the real work now is turning it into the smallest convincing replay demo
