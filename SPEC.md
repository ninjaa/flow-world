# Flow World Spec

## Open-source typed classifier gates for agent tool use

**Status:** draft v1
**Date:** 2026-04-23
**Primary domain:** agent tool governance
**Graph representation:** `@fbp/types` / GraphSchemata-style flow graph as the canonical public IR
**Initial model preference:** Gemini 3.1 Flash Lite via OpenRouter (exact provider slug to verify at implementation time)
**Downstream gate model:** LightGBM

---

## 1. One-line pitch

Flow World is a demo and reference implementation for **flow-based programming with learned gates**: a user talks to an agent, the agent materializes an `@fbp/types` graph, and certain graph nodes are **gates** backed by typed prompt-pack evaluation plus downstream routing into branches like **ALLOW**, **SANDBOX**, **REQUEST_SUDO**, **REVIEW**, or **DENY**.

---

## 2. Why this exists

The prompt-injection experiments proved a reusable technique:

1. use a **bank of typed prompts** instead of one giant prompt
2. require **structured outputs**
3. turn those outputs into a **feature vector**
4. train a simple downstream model to make the final decision

That technique is more interesting in **real operational domains** than in prompt-injection classification alone.

The first domain for Flow World is **agent tool gating**.

Why this domain wins:

- it is instantly understandable
- it is product-like rather than academic
- it maps onto real OpenClaw hook surfaces
- it supports human approval / request-sudo flows cleanly
- it can replay synthetic or real-derived proposals and later run live
- it naturally fits a public FBP graph representation instead of custom hidden policy logic

This repo should produce a clean, open-source version of the technique without relying on any NDA-bound internal implementation details.

---

## 3. Product thesis

### Core claim

Agent safety and autonomy should not be controlled by:

- a single giant system prompt
- a brittle hand-written rule tree
- a single opaque yes/no classifier

Instead, they should be controlled by a **typed intermediate representation** and surfaced as a **flow graph**.

That means:

- the user can talk to an agent about the workflow they want
- the agent can materialize a public graph IR (`@fbp/types`)
- prompt sensors estimate meaningful properties of proposed actions
- those sensor outputs are visible and inspectable
- the gate model learns how to combine them
- the final route is understandable and debuggable

### What makes Flow World compelling

It is not “an LLM that says allow or deny.”
It is “a conversationally-authored flow graph where typed prompt sensors drive learned routing.”

---

## 4. What the demo should show

The first public demo should show a **scripted transcript -> graph -> replay** loop.

That means the on-screen story is:

1. a fixed back-and-forth transcript with the agent
2. the graph that transcript produced, in `@fbp/types` form
3. the replay path through the graph, including gate behavior

### Why this demo surface

This shows both:

- the **real product model**: talk to an agent, get a graph
- the **core technical novelty**: gate nodes are backed by prompt-pack evaluation + routing

### Minimum on-screen layers

- a scripted conversation panel
- a graph view showing nodes / edges
- a replay view showing the selected path through the graph
- per-gate structured classifier outputs
- final route / branch for each replayed proposal

---

## 5. MVP demo story

A user or agent proposes a tool action, for example:

- run a shell command
- read or write a file
- browse a URL
- fill a browser field
- call an external API

Flow World shows this path:

```text
Scripted transcript
  -> Graph authored by agent (`@fbp/types`)
  -> Gate node references eval pack
  -> Prompt-bank evaluation
  -> Feature vector
  -> Gate model
  -> Route
  -> Action / Explanation
```

The route is one of:

- `ALLOW`
- `SANDBOX`
- `REQUEST_SUDO`
- `REVIEW`
- `DENY`

The demo then shows:

- the transcript that produced the graph
- the graph itself
- the structured outputs from each gate's classifier bank
- the chosen route
- the replayed branch taken through the graph

### First believable walkthrough

1. Show a scripted conversation that asks for a simple agent workflow.
2. Show the graph materialized from that transcript.
3. Replay one safe tool proposal and one sudo-worthy proposal.
4. Show the gate node outputs for both.
5. Show why one path routes to `ALLOW` while the other routes to `REQUEST_SUDO`.

---

## 6. Goals and non-goals

### Goals

- open-source the **technique**, not the NDA-bound implementation details
- use `@fbp/types` as the canonical graph IR, not just as a loose inspiration
- make tool governance feel like **flow-based programming**, not hidden policy magic
- support offline replay first, then live hook integration
- keep the first version inspectable, legible, and easy to demo
- work with one preferred cheap model first: Gemini 3.1 Flash Lite on OpenRouter

### Non-goals (v1)

- live OpenClaw hook integration
- generalized no-code automation builder
- full production policy engine for every tool family
- fancy distributed orchestration
- perfect universal safety classifier
- replacing OpenClaw itself

Flow World v1 is a **clear demo + reference architecture**, not a full platform.

---

## 7. The flow model

### Canonical v1 flow

```text
scripted transcript
  -> graph materialization
  -> gate node references eval pack
  -> normalize action context
  -> run typed prompt pack
  -> validate structured outputs
  -> convert to feature vector
  -> score with LightGBM
  -> map score / class to route
  -> emit route + explanation
  -> replay selected branch in UI
```

### Why flow-based programming fits

Each stage is narrow and composable:

- **conversation node**: captures intent in transcript form
- **graph node**: stores the public workflow representation
- **gate reference node**: points at an eval pack
- **classifier nodes**: produce typed signals
- **feature node**: creates a stable numerical vector
- **gate node**: chooses route
- **policy node**: applies hard floors / ceilings
- **explanation node**: renders the decision for humans

This makes the demo visual and intellectually clean.

---

## 8. Graph representation

### Canonical public IR

Use the FBP spec / `@fbp/types` representation as the canonical public graph format for:

- nodes
- edges
- ports
- channels
- subgraphs / boundaries
- node-level properties needed to wire behavior

Flow World should treat the graph as a **real public flow graph**, not as a custom hidden structure with an FBP export bolted on later.

### Gate node rule for v1

A gate node should **reference a named prompt-pack / eval asset**, not inline the full prompt-pack config.

Reason:

- keeps the graph clean and portable
- keeps evaluator assets reusable across graphs
- keeps the graph legible in demos
- avoids shoving ML/prompt configuration blobs into the graph document itself

### Resulting shape

- graph document: public workflow IR
- gate pack / eval asset: external referenced artifact
- replay artifact: separate execution/evaluation data

This means the graph is the orchestration surface, while the eval pack is the implementation behind certain gates.

---

## 9. Input contract: the action document

The classifier bank should never look at raw fragments alone.
It should receive a normalized action document with consistent fields.

### Suggested v1 input shape

```json
{
  "session_id": "...",
  "turn_id": "...",
  "agent_goal": "...",
  "user_request": "...",
  "tool_name": "exec",
  "tool_args": {"command": "rm -rf /tmp/demo"},
  "tool_family": "exec",
  "workspace_context": {
    "cwd": "/repo",
    "git_dirty": true,
    "network_enabled": true
  },
  "action_summary": "Run destructive shell command in workspace",
  "preceding_context": {
    "prior_tool_failures": 1,
    "requires_external_side_effect": true,
    "contains_secrets": false
  }
}
```

### Design rule

The prompt bank sees a **normalized document**, not ad hoc concatenated strings hidden in code.
That document should be saved for replay and evaluation.

---

## 10. The typed classifier bank

The bank should copy the useful pattern from the prompt-pack experiments:

- several focused binary-ish “sensor” prompts
- several choice prompts
- several score prompts
- all returning structured JSON

### 10.1 Sensor families

#### Binary / probability sensors

These output probabilities from 0 to 1.

Suggested v1 sensors:

- `intent_legitimate`
- `task_aligned`
- `destructive_action`
- `external_side_effect`
- `secret_exposure_risk`
- `privilege_escalation_risk`
- `exfiltration_risk`
- `irreversible_action`
- `safe_to_sandbox`
- `needs_human_confirmation`
- `benign_admin_maintenance`
- `user_explicitly_authorized`

#### Choice prompts

These output:

- `chosen`
- `probabilities`
- `confidence`

Suggested v1 choice families:

- `goal_family`
  - `normal_task_execution`
  - `workspace_modification`
  - `system_administration`
  - `credential_or_secret_access`
  - `network_or_external_publish`
  - `security_sensitive_operation`
  - `ambiguous_or_other`

- `tool_risk_family`
  - `routine_safe`
  - `sandboxable`
  - `confirmation_needed`
  - `review_needed`
  - `blockworthy`

- `failure_mode_family`
  - `low_context`
  - `scope_ambiguity`
  - `side_effect_risk`
  - `permission_risk`
  - `policy_violation`
  - `none_or_benign`

#### Score prompts

These output:

- `expectation`
- `confidence`

Suggested v1 score prompts:

- `destructiveness_score` (0–10)
- `privilege_score` (0–10)
- `data_sensitivity_score` (0–10)
- `autonomy_risk_score` (0–10)
- `reversibility_score` (0–10, where low means hard to undo)
- `approval_need_score` (0–10)

### 10.2 Output contract

A single prompt-pack run should produce one structured payload like:

```json
{
  "sensors": {
    "intent_legitimate": 0.88,
    "task_aligned": 0.91,
    "destructive_action": 0.79,
    "external_side_effect": 0.35,
    "secret_exposure_risk": 0.12,
    "privilege_escalation_risk": 0.84,
    "exfiltration_risk": 0.10,
    "irreversible_action": 0.77,
    "safe_to_sandbox": 0.22,
    "needs_human_confirmation": 0.94,
    "benign_admin_maintenance": 0.44,
    "user_explicitly_authorized": 0.19
  },
  "goal_family": {
    "chosen": "system_administration",
    "probabilities": {
      "normal_task_execution": 0.03,
      "workspace_modification": 0.08,
      "system_administration": 0.66,
      "credential_or_secret_access": 0.05,
      "network_or_external_publish": 0.03,
      "security_sensitive_operation": 0.12,
      "ambiguous_or_other": 0.03
    },
    "confidence": 0.66
  },
  "tool_risk_family": {
    "chosen": "confirmation_needed",
    "probabilities": {
      "routine_safe": 0.02,
      "sandboxable": 0.11,
      "confirmation_needed": 0.58,
      "review_needed": 0.19,
      "blockworthy": 0.10
    },
    "confidence": 0.58
  },
  "destructiveness_score": {"expectation": 7.8, "confidence": 0.86},
  "privilege_score": {"expectation": 8.3, "confidence": 0.88},
  "approval_need_score": {"expectation": 9.1, "confidence": 0.93}
}
```

### 10.3 Model choice for v1

Use **Gemini 3.1 Flash Lite on OpenRouter** for all prompt-bank calls in v1.

Reason:

- cheap enough for large replay runs
- fast enough for interactive demos
- easy to standardize on one provider path first

Implementation note:

- lock the prompt bank to one provider/model first
- keep the API surface generic so another model can be swapped later
- verify the exact OpenRouter slug at implementation time instead of baking in stale names blindly

---

## 11. Feature extraction

The downstream model should not consume raw JSON blobs directly.
It should consume a stable feature schema.

### Feature groups

- raw sensor probabilities
- one-hot chosen labels for each choice family
- full choice probabilities
- confidence values
- score expectations
- score confidence values
- derived margins between top two choices
- thresholded confidence flags
- tool-family metadata
- optional low-cardinality action metadata (e.g. `tool_family=exec`)

### Example feature names

- `sensor__destructive_action`
- `sensor__needs_human_confirmation`
- `goal_prob__system_administration`
- `goal_choice__system_administration`
- `risk_prob__confirmation_needed`
- `scalar__destructiveness_score`
- `scalar__approval_need_score`
- `scalar__goal_margin`
- `scalar__all_required_confidence_ok`
- `meta__tool_family__exec`

### Principle

Keep the feature schema **versioned** and stable.
The model is trainable only if the feature contract stays legible.

---

## 12. Downstream gate model

### Primary v1 gate

Use **LightGBM** for the route decision.

Initial route classes:

- `ALLOW`
- `SANDBOX`
- `REQUEST_SUDO`
- `REVIEW`
- `DENY`

### Why LightGBM

- handles mixed dense numeric features well
- trains fast on moderate datasets
- easy to inspect with feature importance
- good baseline for tabular sensor outputs
- consistent with the successful pattern from the prompt-pack experiments

### Decision mapping

Two acceptable v1 strategies:

#### Option A — direct multiclass

Train LightGBM to emit one of the five routes directly.

#### Option B — risk band + hard policy map

Train a continuous or ordinal risk output, then map it with policy thresholds and hard constraints.

Example:

- `DENY` if hard block rule fires
- else `REQUEST_SUDO` if approval need high and user authorization absent
- else `SANDBOX` if task looks safe but side effects need containment
- else `REVIEW` for ambiguous cases
- else `ALLOW`

**Recommendation:** start with **Option B** for clearer debugging, then evaluate direct multiclass later.

---

## 13. Route semantics

### `ALLOW`

Proceed normally.

### `SANDBOX`

Proceed, but only in a restricted environment.

### `REQUEST_SUDO`

Pause and ask the user for explicit elevation / confirmation.
This is the route that should integrate with the existing **request-sudo / approval UX**.

### `REVIEW`

Escalate to a human or a review lane.

### `DENY`

Block the action.

---

## 14. OpenClaw integration strategy

Flow World should be compatible with OpenClaw’s hook model rather than pretending it lives in a vacuum.

### Relevant OpenClaw hook surfaces

Based on the locally available OpenClaw PR artifacts, the useful hook surfaces are:

- `before_agent_reply`
- `before_llm_call`
- `after_llm_call`
- `before_response_emit`

### Recommended v1 live integration point

The primary v1 integration point should be **`after_llm_call`**.

### Secondary integration points

- use `before_agent_reply` to implement `REQUEST_SUDO` as a short-circuit approval experience
- use `before_response_emit` to explain why a route was chosen in user-facing language

### Important v1 boundary

Live OpenClaw hook wiring is **explicitly out of scope for the first slice**.
The first slice is replay-only, but it should be designed so later hook integration is natural.

---

## 15. Request-sudo design

The request-sudo path is not an implementation detail. It is one of the headline branches.

### User-facing behavior

When the route is `REQUEST_SUDO`, the system should present:

- the proposed action
- a short reason for elevation
- the specific risk factors that triggered it
- what will happen if approved
- what safer alternative exists, if any

### Design rule

The approval UX should be grounded in the **same structured sensor outputs** the model used.
It should not invent a separate explanation path.

---

## 16. Data and labeling strategy

For the first slice, **synthetic / hand-authored examples are acceptable and preferred**.

Why:

- they are faster to create
- they are safer for public release
- they let the demo optimize for conceptual clarity
- they avoid blocking on session hygiene or scrubbing work

A dataset row should represent **one candidate action**, not one whole session.

Suggested columns:

- example id
- tool name
- tool args summary
- normalized action document path
- transcript segment id
- final route label
- route source (`synthetic` for v1)
- notes / adjudication

---

## 17. Evaluation plan

### Offline evaluation

At minimum measure:

- route accuracy
- confusion matrix
- precision / recall for `REQUEST_SUDO`
- false-allow rate on clearly dangerous actions
- unnecessary-friction rate on clearly safe actions

### Baselines

Compare against:

- direct binary LLM judge
- rules-only baseline
- logistic regression over the same feature set
- LightGBM over the prompt-bank feature set

---

## 18. Demo UX

### Screen 1 — Scripted transcript

Show the fixed back-and-forth that asked the agent to create the workflow.

### Screen 2 — Graph view

Show the resulting `@fbp/types` graph, including the gate node(s).

Default frontend plan: reuse or adapt `@fbp/graph-editor` for the graph view if integration cost stays reasonable, instead of building a graph canvas from scratch.

### Screen 3 — Replay / decision inspector

For the selected action, show:

- normalized action document
- prompt-bank outputs
- top features
- final route
- replayed branch through the graph

The first public demo should show all three layers together as one coherent loop.

---

## 19. Future skill (spec now, build later)

A future skill should exist that turns:

`prompt + examples -> flow -> playable eval`

This should be **specified now** but **not required to ship in the first replayable slice**.

The first slice should only leave a clean spec seam for this skill.

---


## 19A. How the pack emerges

The gate pack should emerge through a visible authoring loop, not by appearing as a magic hand-written blob.

### Authoring loop

1. **Conversation intent**
   - the user describes the workflow they want
   - the agent identifies where a gate is needed in the graph

2. **Graph materialization**
   - the agent creates or updates the `@fbp/types` graph
   - the gate node is added with a stable reference to a future pack asset

3. **Pack skeleton generation**
   - the system proposes a gate-pack scaffold:
     - sensor names
     - choice families
     - score families
     - schema version
     - route targets

4. **Example set definition**
   - examples are attached to the gate intent
   - each example is labeled with the expected route

5. **Eval / calibration**
   - prompt-bank outputs are generated from the examples
   - features are extracted
   - LightGBM is trained or refreshed
   - route behavior is reviewed against expected outcomes

6. **Pack publication**
   - the pack becomes a versioned artifact
   - the gate node keeps referencing the pack by ID / URI
   - replay and later live runs resolve the same pack artifact consistently

### Design principle

The graph stores **where** the gate is and **which pack** it uses.
The pack artifact stores **how** the gate thinks.
The eval artifacts store **how well** it performs.

## 20. Proposed repo structure

```text
flow-world/
  SPEC.md
  PLAN.md
  .agents/
  graphs/
    scripted-demo-graph.json
  prompt-packs/
    tool-gating-v1/
      pack.md
      schema.json
      inventory.csv
  examples/
    tool-gating-v1/
      transcript.md
      examples.jsonl
  src/
    flow/
      normalize.py
      features.py
      routing.py
      replay.py
    models/
      train_lightgbm.py
      eval.py
    ui/
      transcript_view.*
      graph_view.*
      replay_view.*
  reports/
    replay-evals/
    model-evals/
```

---

## 21. Open-source boundaries

This project should open-source the **pattern** without leaking NDA-bound product details.

### Safe to include

- typed prompt-bank pattern
- generic JSON schemas
- LightGBM training / eval pipeline
- route classes and flow design
- `@fbp/types` graph artifacts
- synthetic transcript/examples for the first demo

### Do not include

- any private internal SDK details
- provider-specific private prompts copied from NDA work
- tenant-specific policy values
- secret-bearing session content
- any proprietary threshold tables lifted from closed work

---

## 22. Immediate next step

Build the smallest offline replay path first.

Specifically:

1. write a scripted conversation that produces the graph
2. define a tiny synthetic labeled example set of candidate tool actions
3. represent the graph in `@fbp/types`
4. define a gate node that references an external prompt-pack / eval asset
5. implement the typed prompt bank for those actions
6. train a LightGBM route model
7. replay one route to `ALLOW` and one route to `REQUEST_SUDO` in the UI
8. only then plan the live hook integration and future skill build
