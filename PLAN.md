# Flow World — Repo Plan

This is the **repo-level plan**.
Use it for product direction, milestones, and current execution focus.

---

## Status

- **Phase:** planning
- **Last updated:** 2026-04-23
- **Repo state:** public OSS repo with clarified two-phase direction
- **Current execution target:** phase 1 runtime decision flow

---

## Product definition

Flow World is an open-source demo and reference architecture for **flow-based tool-call decisions**.

### Phase 1
Show a runtime decision flow where a proposed tool call moves through a graph, hits a gate node, emits gate outputs, and exits down a visible route.

### Phase 2
Add graph construction UX, including graph-as-node composition built on the FBP graph model.

---

## Current goals

1. Freeze the phase split clearly.
2. Build the smallest convincing phase 1 runtime decision flow.
3. Keep phase 2 graph construction UX planned but not blocking.

---

## Near-term milestones

### Milestone 0 — Bootstrap the repo workflow
- [x] Add `AGENTS.md`
- [x] Add repo-level `PLAN.md`
- [x] Add `.agents/` scaffold and exec-plan template
- [x] Push the initial public repo

### Milestone 1 — Lock the product shape
- [x] Create the consolidated product spec
- [x] Create `WORKING-SPEC.md` as shared artifact format
- [x] Clarify that phase 1 is runtime decision flow
- [x] Clarify that phase 2 is graph construction UX

### Milestone 2 — Phase 1 runtime decision flow
- [ ] Define the smallest `@fbp/types` decision graph
- [ ] Define the gate node contract with explicit route ports
- [ ] Define the external gate-pack contract
- [ ] Define the deterministic route policy
- [ ] Write a synthetic example set
- [ ] Build replay + route UI
- [ ] Show one `ALLOW` and one `REQUEST_APPROVAL` path end-to-end

### Milestone 3 — Phase 2 graph construction UX
- [ ] Define how graph-as-node composition appears in Flow World
- [ ] Reuse the existing FBP graph editor/editor UX where practical
- [ ] Support reusable subgraphs as nodes

---

## Active / known plans

- `.agents/plans/bootstrap/PLAN.md`
- `.agents/plans/tool-gating-spec/PLAN.md`
- `plans/prd-flow-world-runtime-decision-flow-v1.md`
- `plans/test-spec-flow-world-runtime-decision-flow-v1.md`

---

## Open questions

- What exact minimal `@fbp/types` subset is enough for phase 1?
- What should the deterministic route policy artifact look like?
- Should phase 1 use a simple graph renderer or adapt editor components immediately?

---

## Working conventions

- `SPEC.md` = narrative product/architecture spec
- `WORKING-SPEC.md` = shared implementation artifact format
- `plans/` = planning artifacts we execute against
- Phase 1 runtime flow should stay small and legible
- Phase 2 authoring UX should build on native graph composition rather than replacing it
