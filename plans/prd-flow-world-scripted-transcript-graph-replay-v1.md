# PRD — Flow World scripted transcript -> graph -> replay demo v1

- **Date:** 2026-04-23T23:05:36Z
- **Status:** draft
- **Source brief:** `.omx/specs/deep-interview-tool-gating-demo.md`
- **Planning mode:** ralplan

---

## RALPLAN-DR Summary

### Principles
1. Use a real public flow graph, not a fake export.
2. Keep the first demo legible before making it realistic.
3. Preserve typed classifier outputs as the core differentiator.
4. Separate graph representation from gate-pack implementation assets.
5. Keep replay first; defer live hook complexity.

### Decision Drivers
1. The first public demo must show **scripted transcript -> graph -> replay**.
2. The graph should use `@fbp/types` as the canonical IR.
3. The first slice must visibly distinguish a safe route from a sudo-worthy route.

### Viable Options

#### Option A — Graph plus replay only
- **Pros:** Smallest implementation.
- **Cons:** Fails the clarified requirement to show how the graph came from conversation.

#### Option B — Full live chat authoring
- **Pros:** Closest to the eventual product.
- **Cons:** Too much complexity for v1; conflicts with the explicit no-live-hook / replay-first boundary.

#### Option C — Scripted transcript -> graph -> replay (**chosen**)
- **Pros:** Shows the full product story while staying bounded and demo-friendly.
- **Cons:** Less dynamic than live authoring; transcript is fixed rather than interactive.

---

## Requirements Summary

Build the first public Flow World slice as an offline replay demo where:

- a scripted conversation is shown on screen
- that conversation corresponds to a graph represented in `@fbp/types`
- the graph includes at least one gate node
- the gate node references an external prompt-pack / eval asset
- replaying candidate tool actions through the graph shows typed classifier outputs and final route decisions
- at least one example routes to `ALLOW` and one routes to `REQUEST_SUDO`
- prompt-bank scoring + downstream routing can be rerun from saved prompts and examples

---

## User / audience story

A technically curious user should be able to watch the demo and understand:

1. the workflow was authored conversationally
2. the workflow exists as a real public flow graph
3. gates are not magic if-statements; they are backed by typed prompt-pack evaluation
4. the final branch choice is a learned route, not a single opaque prompt output

---

## In-scope

- One scripted conversation artifact
- One `@fbp/types` graph artifact corresponding to that conversation
- One external prompt-pack / eval asset referenced by a gate node
- One synthetic example set
- Prompt-bank runner using Gemini via OpenRouter
- Feature extraction + LightGBM route model
- Replay UI with transcript, graph, and replay inspector
- One safe example and one sudo-worthy example shown end-to-end

## Out-of-scope

- Live OpenClaw hook integration
- Real conversational graph authoring in the browser
- Real session-derived datasets as a hard dependency
- Full production-safe request-sudo integration
- The future `prompt + examples => flow => playable eval` skill implementation

---

## Concrete deliverables

1. `examples/tool-gating-v1/transcript.md`
2. `graphs/scripted-demo-graph.json`
3. `prompt-packs/tool-gating-v1/pack.md`
4. `prompt-packs/tool-gating-v1/schema.json`
5. `examples/tool-gating-v1/examples.jsonl`
6. `src/flow/normalize.py`
7. `src/flow/features.py`
8. `src/models/train_lightgbm.py`
9. `src/models/eval.py`
10. Minimal replay UI showing transcript / graph / replay inspector

---

## Functional requirements

### FR1 — Scripted transcript artifact
The repo must contain a single scripted conversation that is short enough to demo but rich enough to justify the resulting graph.

### FR2 — Canonical graph IR
The graph artifact must be represented in `@fbp/types`-compatible form.

### FR3 — External gate-pack reference
The gate node must reference an external prompt-pack / eval asset instead of embedding the full prompt configuration inline.

### FR4 — Typed gate outputs
Replaying an example through the gate must surface structured sensor outputs and route-relevant values.

### FR5 — Route visibility
The replay UI must show the chosen branch (`ALLOW`, `REQUEST_SUDO`, etc.) clearly.

### FR6 — Contrasting examples
The replay set must contain at least:
- one clearly safe example
- one clearly sudo-worthy example

### FR7 — Re-runnable evaluation
Saved prompts and examples must be sufficient to rerun scoring, feature extraction, and route evaluation.

---

## Non-functional requirements

- OSS-safe and NDA-safe
- Fast enough to rerun locally without heroic setup
- Legible enough for a short recorded walkthrough
- Structured artifacts should be inspectable in Git

---

## Acceptance criteria

1. The replay UI shows typed sensor outputs per action.
2. The replay UI shows the chosen route / branch clearly.
3. One safe and one sudo-worthy example both work end-to-end.
4. Training/eval can be rerun from saved prompts and examples.
5. The graph artifact is actually represented in `@fbp/types` form.
6. The gate node references an external eval pack rather than inlining the whole prompt-pack config.
7. The demo shows the transcript, graph, and replay as one coherent loop.

---

## Risks and mitigations

### Risk: `@fbp/types` fidelity adds implementation drag
- **Mitigation:** target the smallest viable subset of the graph spec for v1.

### Risk: The replay UI becomes generic ML demo sludge
- **Mitigation:** enforce the transcript -> graph -> replay story and keep typed sensor outputs front-and-center.

### Risk: Prompt-pack config leaks into the graph and makes it ugly
- **Mitigation:** keep gate packs as referenced external assets.

### Risk: Synthetic examples feel too fake
- **Mitigation:** write two or three crisp, plausible canonical examples with clear routing contrast.

---

## ADR

### Decision
Build Flow World v1 as a scripted transcript -> graph -> replay demo using `@fbp/types` for the graph and externally referenced prompt-pack gate assets.

### Drivers
- User explicitly chose scripted transcript -> graph -> replay as the required on-screen loop.
- User explicitly wants the graph to use the FBP spec as the real graph layer.
- User explicitly chose external gate-pack references over inlined gate-pack config.
- User explicitly allowed synthetic examples for the first slice.

### Alternatives considered
- Graph plus replay only
- Full live conversational authoring
- Inline gate-pack config inside graph nodes

### Why chosen
This is the smallest version that still communicates the real product idea instead of collapsing into either a static graph viewer or a generic classifier demo.

### Consequences
- The first slice is cleaner and more teachable.
- Live hook integration is delayed.
- Gate-pack assets need a clean external artifact format.

### Follow-ups
- Design the future `prompt + examples => flow => playable eval` skill.
- Add live OpenClaw hook integration after the replay loop is solid.

---

## Available-agent-types roster for follow-up execution

- `executor` — implementation and refactoring
- `architect` — graph/gate contract review
- `critic` — plan / quality challenge
- `test-engineer` — test strategy and fixture design
- `writer` — docs / skill / artifact guidance
- `researcher` — external spec confirmation if needed

## Suggested staffing guidance

### Ralph lane
- one owner implementing the replay prototype sequentially
- optional critic/test pass after core artifacts exist

### Team lane
- lane 1: graph + artifact schema
- lane 2: prompt-pack runner + features + model
- lane 3: replay UI + explanation layer
- lane 4: tests / fixtures / rerun harness

## Verification path

- artifact validation for transcript / graph / pack / examples
- rerunnable eval command works
- replay UI shows both contrasting examples correctly
- graph-to-pack reference resolves correctly
