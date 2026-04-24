# Flow World

Flow World is an open-source demo of **flow-based tool-call decisions**.

Phase 1 shows a runtime decision flow:

`tool proposal -> @fbp/types graph -> external gate pack -> deterministic route policy -> visible branch`

Phase 2 will add graph construction UX and graph-as-node composition.

## Current phase

This repo currently implements the **phase 1 runtime decision flow**:

- a real `@fbp/types` graph artifact
- an external gate pack
- a deterministic route policy
- synthetic replay examples
- a replay UI that shows gate outputs and chosen branch

## Quick start

```bash
npm install
npm run replay:generate
npm run dev
```

`npm run replay:generate` requires `OPENROUTER_API_KEY` and currently uses `google/gemini-3.1-flash-lite-preview`.

Open the local Vite URL and inspect the replay examples.

## Important files

- `graphs/tool-approval-runtime-v1.json` — runtime decision graph
- `prompt-packs/tool-approval-v1/` — gate pack definition
- `policies/tool-approval-v1.json` — deterministic route policy
- `examples/tool-approval-v1/examples.jsonl` — synthetic replay examples
- `reports/replay-evals/tool-approval-runtime-v1.json` — generated replay artifact

## Why this shape

The point is to show that tool governance can be represented as a visible flow with explicit operational steps, instead of hiding decisions inside one giant prompt or a brittle implicit ruleset.
