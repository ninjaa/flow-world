# Flow World — Repo Plan

This is the **repo-level plan**.
Use it for product direction, current phase, milestones, and open questions.
Use `.agents/plans/<issue-or-slug>/PLAN.md` for task-level execution details.

---

## Status

- **Phase:** planning
- **Last updated:** 2026-04-23
- **Repo state:** early-stage concept repo with clarified demo direction and planning artifacts in progress
- **Workflow choice:** use the modernized `openai-codex-exec-plan` pattern for day-to-day work

---

## Project definition

**Product / user outcome:**

Flow World is an open-source demo and reference architecture for **flow-based tool gating**.
A user talks to an agent, the agent materializes an `@fbp/types` graph, and gate nodes in that graph are backed by typed prompt-pack evaluation plus a downstream LightGBM router.

### First believable public demo

The first public demo should show:

`scripted transcript -> graph -> replay`

Where:

- the transcript shows the workflow being authored
- the graph is represented in `@fbp/types`
- the replay shows a gate node producing typed sensor outputs and routing one safe example to `ALLOW` and one risky example to `REQUEST_SUDO`

---

## Current goals

1. Freeze the product direction in a single open-source spec.
2. Create concrete PRD and test-spec artifacts for the first replayable slice.
3. Build the smallest convincing offline replay before any live OpenClaw hook work.
4. Leave a clean spec seam for the future `prompt + examples => flow => playable eval` skill.

---

## Near-term milestones

### Milestone 0 — Bootstrap the repo workflow
- [x] Add `AGENTS.md`
- [x] Add repo-level `PLAN.md`
- [x] Add `.agents/` scaffold and exec-plan template
- [x] Seed the first task plan for repo bootstrap

### Milestone 1 — Lock the product spec
- [x] Write a crisp product / scope statement
- [x] Create a consolidated spec for the first demo
- [x] Run deep-interview to clarify the demo surface
- [x] Choose ralplan as the next lane

### Milestone 2 — Offline replay prototype
- [ ] Write the scripted transcript that produces the graph
- [ ] Define the v1 `@fbp/types` graph artifact
- [ ] Define the gate-pack reference contract
- [ ] Define the synthetic example set
- [ ] Implement prompt-bank scoring + feature extraction
- [ ] Train and evaluate the first LightGBM gate
- [ ] Produce a replay UI with visible sensors and routes

### Milestone 3 — Future follow-ons
- [ ] Spec the future `prompt + examples => flow => playable eval` skill in more detail
- [ ] Plan live OpenClaw integration after replay works

---

## Active / known plans

- `.agents/plans/bootstrap/PLAN.md` — repo scaffold + workflow bootstrap
- `.agents/plans/tool-gating-spec/PLAN.md` — consolidated OSS spec for the first Flow World demo
- `.omx/specs/deep-interview-tool-gating-demo.md` — latest clarified execution brief
- `plans/prd-flow-world-scripted-transcript-graph-replay-v1.md` — current PRD target
- `plans/test-spec-flow-world-scripted-transcript-graph-replay-v1.md` — current test spec target

---

## Open questions

- What is the smallest exact gate-pack reference shape inside the graph?
- Which minimal `@fbp/types` subset is enough for the first demo?
- Which implementation stack should render the transcript / graph / replay screens fastest?
- How much explanatory detail belongs in the replay inspector by default?

---

## Working conventions

- Repo-level strategy lives here.
- Task-level execution lives in `.agents/plans/.../PLAN.md`.
- `SPEC.md` is the canonical consolidated product / architecture spec.
- Deep-interview artifacts in `.omx/specs/` override older ambiguous assumptions.
- Use beads when work becomes multi-session or dependency-heavy.
- Keep this document short and current.
