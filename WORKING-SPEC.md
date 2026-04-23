# WORKING-SPEC

A shared working format for Flow World so the project can be read, discussed, and implemented without relying on chat history.

## 1. Core idea

Flow World has four first-class artifact types:

1. **Transcript** — how the workflow was asked for
2. **Graph** — the public flow IR (`@fbp/types`)
3. **Gate pack** — the external prompt/eval asset used by a gate node
4. **Replay / eval artifacts** — examples, outputs, routes, and metrics

If an idea cannot be expressed across those four layers, it is not ready.

---

## 2. Canonical artifacts

### A. Transcript
Path:
- `examples/<demo>/transcript.md`

Purpose:
- explain where the graph came from
- provide a human-readable authoring story

Minimum contents:
- user asks
- agent clarifies
- agent proposes graph/gates
- final graph-authoring turn

### B. Graph
Path:
- `graphs/<demo>.json`

Purpose:
- canonical public workflow representation

Format:
- `@fbp/types`

Rule:
- gate nodes reference packs; they do not inline packs

### C. Gate pack
Paths:
- `prompt-packs/<pack-id>/pack.md`
- `prompt-packs/<pack-id>/schema.json`
- `prompt-packs/<pack-id>/inventory.csv`
- optionally `prompt-packs/<pack-id>/routes.json`

Purpose:
- define the typed evaluator behind one gate family

Minimum contents:
- `pack_id`
- `pack_version`
- sensor definitions
- choice-family definitions
- score-family definitions
- output schema version
- feature schema version
- route labels

### D. Example set
Path:
- `examples/<demo>/examples.jsonl`

Purpose:
- define replayable candidate actions with expected routes

Minimum fields:
- `example_id`
- `graph_id`
- `gate_id`
- `action_document`
- `expected_route`
- `notes`

### E. Replay artifact
Path:
- `reports/replay-evals/<demo>.json`

Purpose:
- capture what happened when examples were replayed

Minimum fields:
- `example_id`
- `pack_id`
- `pack_version`
- `model`
- `prompt_outputs`
- `features`
- `predicted_route`
- `expected_route`
- `match`

---

## 3. Gate node contract

A gate node in the graph should contain only the minimum routing contract needed by the graph layer.

Suggested node props:
- `gate_id`
- `gate_kind`
- `pack_ref`
- `route_set`
- `fallback_route`

Example:

```json
{
  "name": "tool_risk_gate",
  "type": "flow/gate/tool-risk",
  "props": [
    { "name": "gate_id", "type": "string", "value": "tool-risk-v1" },
    { "name": "pack_ref", "type": "string", "value": "prompt-packs/tool-gating-v1" },
    { "name": "route_set", "type": "string[]", "value": ["ALLOW", "SANDBOX", "REQUEST_SUDO", "REVIEW", "DENY"] },
    { "name": "fallback_route", "type": "string", "value": "REVIEW" }
  ]
}
```

Rule:
- the graph says **which pack to use**
- the pack says **how to evaluate**

---

## 4. Pack emergence process

A pack should emerge in six steps:

1. **Need identified** in conversation or planning
2. **Gate added** to graph with a stable `pack_ref`
3. **Pack scaffold generated** from gate intent
4. **Examples authored** against the gate
5. **Eval run** to produce outputs + routes
6. **Pack version promoted** if behavior is acceptable

This means packs are born from:
- gate intent
- examples
- eval results

not from isolated prompt hacking.

---

## 5. Shared review checklist

Before changing a Flow World design, ask:

- What transcript produced this graph?
- Is the graph valid `@fbp/types`?
- Does the gate node reference a pack instead of inlining one?
- What examples define expected behavior?
- What replay artifact proves the gate behaves correctly?
- What changed: graph, pack, examples, or route mapping?

---

## 6. Frontend stance

Default plan:
- reuse or adapt `@fbp/graph-editor` for graph rendering if practical
- keep Flow World-specific UI focused on:
  - transcript view
  - gate inspector
  - replay route inspector

That avoids rebuilding a graph editor from scratch while keeping the project focused on gate behavior.

---

## 7. What v1 is

For v1, the shared working loop is:

`scripted transcript -> @fbp/types graph -> referenced gate pack -> synthetic examples -> replay/eval -> visible route`

That is the minimum complete Flow World story.
