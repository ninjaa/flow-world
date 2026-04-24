# PRD — Flow World phase 1 runtime decision flow v1

- **Status:** draft
- **Scope:** phase 1 only

---

## Summary

Build the first public Flow World slice as a **runtime decision flow** for tool calls.

A proposed tool call should:

1. enter a small `@fbp/types` decision graph
2. hit a gate node
3. evaluate through an external gate pack
4. route through an explicit policy
5. exit down a visible branch

This slice does **not** include graph authoring UX.

---

## Why this is the right v1

This is the smallest version that is:

- real
- legible
- demoable
- compatible with the longer-term graph-construction vision

It avoids the fake feeling of pretending a whole conversational graph-authoring product already exists.

---

## Requirements

### R1 — Real graph artifact
The runtime flow must be represented as a real `@fbp/types` graph artifact.

### R2 — Explicit gate node
The graph must include at least one gate node with:
- explicit input
- explicit route outputs
- external `pack_ref`
- external `policy_ref`

### R3 — External gate pack
The gate pack must be a separate artifact from the graph.

### R4 — Deterministic route policy
Phase 1 should use an explicit route policy rather than pretending a tiny synthetic LightGBM model proves anything.

### R5 — Contrasting examples
At least one clearly safe example and one clearly approval-worthy example must route differently.

### R6 — Visible branch
The UI must show which branch was taken.

### R7 — Visible gate outputs
The UI must show the gate outputs that drove the route.

---

## Deliverables

1. `graphs/tool-approval-runtime-v1.json`
2. `prompt-packs/tool-approval-v1/pack.md`
3. `prompt-packs/tool-approval-v1/schema.json`
4. `policies/tool-approval-v1.json`
5. `examples/tool-approval-v1/examples.jsonl`
6. replay UI / viewer

---

## Out of scope

- transcript / authoring UX
- live OpenClaw hook integration
- reusable agent skills for pack generation
- learned route model as a required credibility claim

---

## Acceptance criteria

1. A tool proposal can be replayed through the graph end-to-end.
2. The gate node references an external pack.
3. The route policy is explicit and inspectable.
4. One example routes to `ALLOW`.
5. One example routes to `REQUEST_APPROVAL`.
6. The UI shows gate outputs and the chosen route.

---

## Phase 2 handoff

Phase 2 builds graph construction UX on top of this runtime flow and should reuse native graph-as-node composition from the FBP graph model/editor ecosystem.
