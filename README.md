# Flow World

Flow World is an open-source runtime for routing AI agent tool calls through visible, programmable decision flows.

If you are trying to make agents reliable enough to automate real work, you usually end up with two bad options:

- hide tool governance inside one giant system prompt
- wire together opaque SaaS automation tools that are closed, old-school, and hard to reason about

Flow World is trying to be the thing in the middle: open-source, inspectable, graph-based tool-call decisions you can version, replay, and improve.

Phase 1 is the **runtime decision flow**.
Phase 2 will be the **graph construction UX** with graph-as-node composition.

## What Phase 1 shows

A proposed tool call goes through a visible operational flow:

`tool proposal -> @fbp/types graph -> external gate pack -> deterministic route policy -> visible branch`

That means you can watch a tool call:

1. enter a real graph artifact
2. hit a gate node
3. produce structured gate outputs
4. get routed to a branch like `ALLOW`, `REQUEST_APPROVAL`, or `DENY`

## Screenshot

![Flow World runtime decision flow UI](docs/images/runtime-decision-flow-ui.png)

## Why this exists

- **Agent tool calls are decisions, but most systems hide them.** Flow World makes each decision a visible flow you can read, test, and replay.
- **Prompt-only governance does not scale.** Once an agent can call lots of tools, one giant prompt becomes a blurry policy blob.
- **Hardcoded rules are brittle, and closed visual automation tools are not enough.** Flow World keeps the system open, programmable, and inspectable.
- **Reproducibility matters.** Every decision can produce a replay artifact with the action document, gate outputs, and route taken.
- **Composition should be native.** The graph model already supports subgraphs as nodes, which makes reusable gate flows possible later.

## Current repo contents

This repo currently includes:

- a real `@fbp/types` graph artifact
- an external gate pack
- a deterministic route policy
- synthetic replay examples
- a replay artifact generated from model calls
- a React/Vite UI using `@fbp/graph-editor`
- tests for graph contract and route policy

## Quick start

```bash
npm install
npm run replay:generate
npm run dev
```

`npm run replay:generate` requires `OPENROUTER_API_KEY` and currently uses `google/gemini-3.1-flash-lite-preview`.

Then open the local Vite URL and inspect the replay examples.

## Important files

- `graphs/tool-approval-runtime-v1.json` — runtime decision graph
- `prompt-packs/tool-approval-v1/` — gate pack definition
- `policies/tool-approval-v1.json` — deterministic route policy
- `examples/tool-approval-v1/examples.jsonl` — synthetic replay examples
- `reports/replay-evals/tool-approval-runtime-v1.json` — generated replay artifact
- `plans/prd-flow-world-runtime-decision-flow-v1.md` — current PRD
- `plans/test-spec-flow-world-runtime-decision-flow-v1.md` — current test spec

## Unified glossary

| Term | Definition |
|---|---|
| **Graph** | A JSON workflow, using `@fbp/types`, that defines the steps a tool call passes through on its way to a decision. |
| **Node** | A single step in the graph, such as normalization, gating, or a terminal branch. |
| **Gate** | A node that evaluates a tool call and decides which route should happen next. |
| **Gate pack** | The external evaluator behind a gate. It defines what signals to score and what output schema to return. |
| **Action document** | The normalized payload a gate receives: tool name, arguments, workspace context, and a readable summary of the action. |
| **Route** | The branch a gate chooses, such as `ALLOW`, `SANDBOX`, `REQUEST_APPROVAL`, `REVIEW`, or `DENY`. |
| **Replay** | Re-running a saved action document through the same graph so you can verify and debug the result. |
| **`@fbp/types`** | The open graph data model Flow World uses as its canonical graph representation. |

## Where this goes next

### Phase 1
Keep proving the runtime decision flow works.

### Phase 2
Add graph construction UX so graphs can be built, nested, and reused as nodes rather than only replayed.
