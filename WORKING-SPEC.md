# WORKING-SPEC

A shared format for reading, discussing, and implementing Flow World without relying on chat history.

## 1. The project has two phases

## Phase 1 — Runtime decision flow

This is the first thing we are building.

It answers:

> What happens when a tool call enters a visible operational decision flow?

Core loop:

`tool proposal -> graph -> gate pack -> route -> branch`

## Phase 2 — Graph construction UX

This comes next.

It answers:

> How do users or agents build, edit, and compose those flows?

Core loop:

`author flow -> nest subgraphs -> reuse graphs as nodes -> replay`

---

## 2. Canonical artifact types

### A. Graph
Path:
- `graphs/<flow>.json`

Purpose:
- canonical public workflow representation

Format:
- `@fbp/types`

Rules:
- this is the real public IR
- gate nodes reference packs
- route branches are expressed as graph outputs / ports
- phase 2 should support graph-as-node composition naturally

### B. Gate pack
Paths:
- `prompt-packs/<pack-id>/pack.md`
- `prompt-packs/<pack-id>/schema.json`
- optionally `prompt-packs/<pack-id>/inventory.csv`

Purpose:
- define the typed evaluator behind a gate node

Minimum contents:
- `pack_id`
- `pack_version`
- `prompt_schema_version`
- `feature_schema_version`
- `provider_model`
- sensor definitions
- route-relevant outputs

### C. Example set
Path:
- `examples/<flow>/examples.jsonl`

Purpose:
- define replayable candidate tool actions and expected routes

Minimum fields:
- `example_id`
- `graph_id`
- `gate_id`
- `action_document`
- `expected_route`
- `notes`

### D. Replay artifact
Path:
- `reports/replay-evals/<flow>.json`

Purpose:
- capture what happened when examples were run through the flow

Minimum fields:
- `example_id`
- `gate_id`
- `pack_id`
- `pack_version`
- `gate_outputs`
- `predicted_route`
- `expected_route`
- `match`

### E. Policy artifact
Optional path:
- `policies/<policy-id>.json`

Purpose:
- define the deterministic route policy used in phase 1

---

## 3. Gate node contract

A gate node should contain only the routing contract needed by the graph.

Required props:
- `gate_id`
- `pack_ref`
- `policy_ref`
- `route_ports`
- `fallback_route`

Required ports:
- one input for the normalized action document
- one output port for each route

Example:

```json
{
  "name": "tool_approval_gate",
  "type": "flow/gate/tool-approval",
  "props": [
    { "name": "gate_id", "type": "string", "value": "tool-approval-v1" },
    { "name": "pack_ref", "type": "string", "value": "prompt-packs/tool-approval-v1" },
    { "name": "policy_ref", "type": "string", "value": "policies/tool-approval-v1" },
    { "name": "route_ports", "type": "string[]", "value": ["ALLOW", "SANDBOX", "REQUEST_APPROVAL", "REVIEW", "DENY"] },
    { "name": "fallback_route", "type": "string", "value": "REVIEW" }
  ]
}
```

Rule:
- graph = where the decision happens
- pack = how the gate evaluates
- policy = how the route is chosen

---

## 4. Phase 1 working loop

Phase 1 is complete when this loop is real:

1. load graph
2. load pack
3. load policy
4. replay example action document
5. compute gate outputs
6. choose route
7. show branch taken

That is the minimum complete story.

---

## 5. Phase 2 working loop

Phase 2 is complete when this loop is real:

1. edit or create graph visually
2. package a subgraph as a reusable node
3. use that node inside another graph
4. replay through the composed graph

This should lean on the native graph-as-node / subgraph support from the FBP graph model instead of inventing a custom nesting layer.

---

## 6. Pack emergence process

A pack emerges like this:

1. identify the gate need
2. create the gate node in the graph
3. scaffold the external pack
4. write examples against that gate
5. run replay/eval
6. promote the pack version

The graph references the pack.
The examples challenge the pack.
The replay artifact proves what happened.

---

## 7. Shared review checklist

Before changing the system, ask:

- Is the graph valid `@fbp/types`?
- Does the gate node reference a pack instead of inlining one?
- Are route ports explicit?
- What examples define expected behavior?
- What replay artifact proves the current behavior?
- Is this change about phase 1 runtime flow or phase 2 authoring UX?

---

## 8. Frontend stance

### Phase 1
Use a simple runtime decision-flow UI.
Prefer a read-oriented graph view over a full editor.

### Phase 2
Lean on the existing graph editor UX and its graph-as-node support.
Do not rebuild subgraph composition from scratch if the existing ecosystem already solves it well.

---

## 9. What v1 is now

For v1, the shared working loop is:

`tool proposal -> @fbp/types decision graph -> referenced gate pack -> deterministic route policy -> visible branch`

That is the minimum complete Flow World story.
