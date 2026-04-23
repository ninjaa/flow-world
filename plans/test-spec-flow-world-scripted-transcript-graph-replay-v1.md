# Test Spec — Flow World scripted transcript -> graph -> replay demo v1

- **Date:** 2026-04-23T23:05:36Z
- **Status:** draft
- **Source brief:** `.omx/specs/deep-interview-tool-gating-demo.md`
- **Companion PRD:** `.omx/plans/prd-flow-world-scripted-transcript-graph-replay-v1.md`

---

## Test strategy

The first slice is done when the demo is both **legible** and **rerunnable**.
That means testing must cover:

1. artifact validity
2. gate-pack execution correctness
3. route correctness on contrasting examples
4. replay UI rendering of the key decision surfaces

---

## Test layers

### 1. Artifact validation tests

Validate that these artifacts exist and are parseable:

- transcript file
- `@fbp/types` graph JSON
- prompt-pack schema / inventory
- synthetic example dataset

#### Assertions
- graph JSON parses cleanly
- graph contains at least one gate node
- gate node contains a valid external pack reference
- examples file contains at least one safe and one sudo-worthy row

### 2. Prompt-pack output schema tests

Validate that the prompt-bank runner returns structured JSON in the expected schema.

#### Assertions
- all required sensors are present
- choice prompts return `chosen`, `probabilities`, and `confidence`
- score prompts return `expectation` and `confidence`
- output schema version is stable and recorded

### 3. Feature extraction tests

Validate feature generation from saved prompt-pack outputs.

#### Assertions
- deterministic feature keys for identical inputs
- expected derived fields exist (margins, confidence flags, metadata)
- saved artifacts can be reloaded without schema drift

### 4. Routing tests

Validate route mapping logic.

#### Assertions
- safe example routes to `ALLOW`
- sudo-worthy example routes to `REQUEST_SUDO`
- route labels are stable under rerun with saved prompt outputs
- any hard policy override behaves deterministically

### 5. Replay integration tests

Validate the end-to-end replay path.

#### Assertions
- transcript -> graph -> example selection -> gate evaluation completes end-to-end
- graph pack reference resolves to the correct prompt-pack asset
- replay artifact includes sensor outputs, chosen route, and explanation payload

### 6. UI tests

Validate the replay UI shows the critical layers.

#### Assertions
- transcript view renders the scripted conversation
- graph view renders the `@fbp/types` graph
- replay inspector renders typed sensor outputs
- replay inspector renders final route label
- both contrasting examples can be selected and inspected

---

## Acceptance test matrix

| ID | Scenario | Expected result |
|---|---|---|
| AT1 | Load the scripted transcript | Transcript renders cleanly |
| AT2 | Load the graph artifact | Graph parses and renders |
| AT3 | Inspect gate node | External pack reference is visible and resolves |
| AT4 | Replay safe example | Route is `ALLOW` |
| AT5 | Replay risky example | Route is `REQUEST_SUDO` |
| AT6 | Inspect safe example outputs | Typed sensor outputs are visible |
| AT7 | Inspect risky example outputs | Typed sensor outputs are visible |
| AT8 | Rerun eval pipeline | Same saved prompts/examples can regenerate outputs |

---

## Verification commands (target)

These are planning targets; exact command names may change during implementation.

```bash
python src/models/eval.py --examples examples/tool-gating-v1/examples.jsonl
python src/models/train_lightgbm.py --examples examples/tool-gating-v1/examples.jsonl
python -m pytest
```

Potential UI verification:

```bash
npm test
npm run dev
```

---

## Failure conditions

The slice is not done if any of the following are true:

- graph is not represented in `@fbp/types` form
- gate node inlines the whole pack instead of referencing it
- typed sensor outputs are not visible in the UI
- there is no clear contrasting `ALLOW` vs `REQUEST_SUDO` example pair
- eval cannot be rerun from saved prompts and examples
- the transcript / graph / replay loop is broken or visually disjoint

---

## Recommended test ownership

- artifact and schema tests: `executor` or `test-engineer`
- route correctness tests: `executor` + `test-engineer`
- UI checks: `executor` or `designer`
- final claim validation: `verifier`
