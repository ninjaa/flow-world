# Flow World Spec

## Open-source flow-based tool decision systems

**Status:** draft v2
**Date:** 2026-04-23
**Primary domain:** agent tool governance
**Graph representation:** `@fbp/types` as the canonical public graph IR
**Phase 1:** runtime decision flow
**Phase 2:** graph construction UX

---

## 1. One-line pitch

Flow World is an open-source demo of **flow-based tool-call decisions**.
A proposed tool call enters a small operational flow, passes through one or more gate nodes, and exits down a visible branch like **ALLOW**, **SANDBOX**, **REQUEST_APPROVAL**, **REVIEW**, or **DENY**.

Later, the same flow becomes authorable and composable through a graph UX built on the FBP graph model.

---

## 2. What we are actually showing

This needed simplification.

We are **not** starting with a general chat-to-graph product.
We are **not** starting with a giant workflow builder.
We are **not** starting with a fake “AI designed this whole graph” theater piece.

### Phase 1 shows

A **runtime decision flow** for tool calls:

```text
proposed tool call
  -> normalize action document
  -> evaluate gate pack
  -> apply route policy
  -> emit route
  -> follow branch
```

That is the first real thing to demo.

### Phase 2 shows

A **graph construction UX** where:

- users or agents construct flows visually
- a graph can be reused as a node
- gate flows become reusable building blocks
- the editor / graph model handles composition cleanly

So the project sequence is:

1. **prove the operational decision flow works**
2. **then expose authoring and composition UX**

---

## 3. Product thesis

The core idea is still the same:

- decisions should not be hidden in one giant prompt
- decisions should not be a brittle tree of handwritten if/else rules
- decisions should be visible as a flow with named steps and inspectable gate outputs

The public graph is the orchestration surface.
The gate pack is how a gate evaluates.
The route policy is how a gate turns evaluation into action.

---

## 4. Phase model

## Phase 1 — Runtime decision flow

### Goal

Show that tool governance can be expressed as a small, legible flow.

### Demo story

A tool proposal comes in:

```json
{"tool":"exec","args":{"command":"rm -rf build-cache"}}
```

The demo shows:

1. the normalized action document
2. the gate pack outputs
3. the route chosen
4. the branch taken

Then a second tool proposal comes in:

```json
{"tool":"exec","args":{"command":"cat README.md"}}
```

and the demo shows a different route.

### What matters in Phase 1

- visible operational steps
- visible gate outputs
- visible branch choice
- at least one safe and one approval-worthy example
- reproducible replay from saved artifacts

### What does **not** matter yet

- live OpenClaw integration
- chat-based graph authoring
- large-scale graph editing
- general reusable skills for agents

## Phase 2 — Graph construction UX

### Goal

Let users build and compose these flows explicitly.

### Core UX idea

Any graph can be used as a node.

This matters because it enables:

- composition
- abstraction
- reuse
- subgraph encapsulation
- reusable gate flows as building blocks

### Design implication

Phase 1 should already respect this future.
The runtime flow we build first should be representable as a graph that can later be wrapped and reused as a node.

---

## 5. Why `@fbp/types`

Use `@fbp/types` as the canonical public IR for:

- nodes
- ports
- edges
- channels
- subgraphs
- graph-as-node composition

The graph should be a **real graph artifact**, not an export added later for marketing.

### Important practical note

Per your note, the existing FBP toolchain already supports **subgraph as node**, and the editor UX for that is strong.
That means Flow World should lean into native composition rather than inventing a custom nesting model.

---

## 6. The runtime flow (Phase 1)

### Canonical operational flow

```text
tool proposal
  -> normalize_action
  -> evaluate_gate_pack
  -> apply_route_policy
  -> branch_to_action
```

### Minimum route set

For now use:

- `ALLOW`
- `SANDBOX`
- `REQUEST_APPROVAL`
- `REVIEW`
- `DENY`

### Why `REQUEST_APPROVAL`, not `REQUEST_SUDO`

`REQUEST_SUDO` is a useful mental model for shell/destructive actions, but too narrow as a public route label.
Phase 1 should use **`REQUEST_APPROVAL`** as the general route and optionally display request-sudo as the concrete example flavor for exec commands.

---

## 7. Gate node model

A gate node is a graph node that references an external gate pack.

### Rule

The graph stores:

- where the gate is
- what pack it uses
- what branches it can emit

The graph does **not** inline the full prompt pack.

### Minimal gate contract

Suggested gate props:

- `gate_id`
- `gate_kind`
- `pack_ref`
- `route_ports`
- `fallback_route`
- `policy_ref`

### Example

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

### Port rule

For v1, the gate node must have:

- one input carrying the action document
- one output port per route

That keeps the graph genuinely flow-based.

---

## 8. Gate pack model

A gate pack is the external artifact that defines how a gate evaluates an input.

### Responsibilities

A gate pack owns:

- sensor definitions
- output schema
- feature schema
- optional calibration metadata
- model/provider metadata
- route-policy inputs

### It does **not** own

- the graph topology
- UI layout
- replay examples themselves

### Minimal contents

- `pack_id`
- `pack_version`
- `prompt_schema_version`
- `feature_schema_version`
- `provider/model`
- sensor definitions
- route-relevant outputs

---

## 9. Gate pack emergence

This still matters, but it is **not** Phase 1’s headline.

A pack emerges like this:

1. identify a gate need in the flow
2. define the gate contract in the graph
3. scaffold the external pack
4. write examples for the gate
5. run evals
6. promote the pack version

That means the pack is born from:

- gate intent
- examples
- evaluation

not from isolated prompt hacking.

---

## 10. Input contract: action document

The gate pack receives a normalized action document.

### Suggested shape

```json
{
  "proposal_id": "...",
  "tool_name": "exec",
  "tool_family": "exec",
  "tool_args": {"command": "rm -rf build-cache"},
  "user_request": "clean up the build cache",
  "agent_goal": "free disk space",
  "workspace_context": {
    "cwd": "/repo",
    "git_dirty": true,
    "network_enabled": false
  },
  "action_summary": "Run a destructive shell command in the workspace"
}
```

### Design rule

The action document is the single normalized payload evaluated by the gate.

---

## 11. V1 gate pack shape

Phase 1 should be small.
Do not start with a giant sensor zoo.

### Suggested v1 signals

Keep it narrow and operational:

- `destructive_action`
- `external_side_effect`
- `privilege_escalation_risk`
- `secret_exposure_risk`
- `safe_to_sandbox`
- `user_explicit_authorization_present`

Optional structured families:

- `tool_risk_family`
  - `routine_safe`
  - `sandboxable`
  - `approval_needed`
  - `review_needed`
  - `blockworthy`

- `approval_need_score`

### Important honesty rule

Do not present raw LLM decimals as scientific probabilities unless they are actually calibrated.
In the UI, call them **scores** unless calibration has been done.

---

## 12. Routing policy

For Phase 1, the clearest move is:

### Use a deterministic route policy first

That means:

- gate pack outputs are computed
- a clear route policy maps outputs to one route
- replay shows the resulting branch

This avoids fake-ML theater on a tiny synthetic dataset.

### LightGBM’s role

LightGBM remains part of the broader design, but should be treated as:

- a later calibration / optimization path
- or a second pass once the example set is large enough to justify it

Do not make Phase 1 credibility depend on synthetic LightGBM heroics.

---

## 13. Phase 1 artifacts

The first slice should revolve around these artifacts:

1. `graphs/tool-approval-runtime-v1.json`
2. `prompt-packs/tool-approval-v1/pack.md`
3. `prompt-packs/tool-approval-v1/schema.json`
4. `examples/tool-approval-v1/examples.jsonl`
5. `reports/replay-evals/tool-approval-runtime-v1.json`

Optional:
- `policies/tool-approval-v1.json`

---

## 14. Phase 1 demo UX

### Screen 1 — Proposal
Show the proposed tool call and normalized action document.

### Screen 2 — Decision flow graph
Show the operational graph for the decision flow.

### Screen 3 — Gate inspector
Show:
- gate pack outputs
- route selected
- branch taken
- concise reason summary

That is enough.
No transcript / authoring required in Phase 1.

---

## 15. Phase 2 demo UX

Phase 2 adds graph construction UX.

### Requirements

- construct or edit flows visually
- treat a graph as a reusable node
- expose subgraph composition cleanly
- let gate flows become reusable building blocks

### Default product stance

Use the existing graph ecosystem’s strengths.
Do not reinvent subgraph composition if the FBP model/editor already gives us that.

---

## 16. Shared working format

Use `WORKING-SPEC.md` as the shared format for:

- graph artifacts
- gate pack artifacts
- example sets
- replay artifacts

If a new idea cannot be expressed cleanly in that format, it is not ready.

---

## 17. Open-source boundaries

This project should open-source the **pattern** without leaking private implementation details.

Safe to include:

- public graph artifacts
- public gate-pack schemas
- synthetic examples
- replay/eval outputs
- explicit route policy design

Do not include:

- private internal SDK details
- tenant-specific policy values
- private prompt banks from closed systems
- secret-bearing session data

---

## 18. Immediate next step

Build **Phase 1 runtime decision flow** first.

Specifically:

1. define the smallest gate-flow graph
2. define the gate node contract with route ports
3. define the external pack contract
4. write a small synthetic example set
5. implement replay + route policy
6. show one `ALLOW` and one `REQUEST_APPROVAL` example working end-to-end

After that:

7. begin Phase 2 graph construction UX
