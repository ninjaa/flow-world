# Tool Approval Gate Pack v1

- `pack_id`: `tool-approval-v1`
- `pack_version`: `1.0.0`
- `prompt_schema_version`: `tool-approval-prompt-v1`
- `feature_schema_version`: `tool-approval-feature-v1`
- `provider_model`: `google/gemini-3.1-flash-lite-preview`

## Purpose

This gate pack evaluates a normalized tool-call action document and emits a compact set of scores that a deterministic route policy can map to:

- `ALLOW`
- `SANDBOX`
- `REQUEST_APPROVAL`
- `REVIEW`
- `DENY`

## V1 Signals

### Scalar scores
- `destructive_action`
- `external_side_effect`
- `privilege_escalation_risk`
- `secret_exposure_risk`
- `safe_to_sandbox`
- `user_explicit_authorization_present`
- `approval_need_score`

### Choice family
- `tool_risk_family`
  - `routine_safe`
  - `sandboxable`
  - `approval_needed`
  - `review_needed`
  - `blockworthy`

## Important honesty rule

The numbers emitted by this pack are **scores**, not calibrated probabilities.
The UI should present them as model-generated gate scores unless and until calibration is added.

## Emergence

This pack exists because the runtime decision flow needs one external evaluator behind the `tool_approval_gate` node.
In later phases, similar packs can be generated or refined from examples, but phase 1 treats this pack as a public, hand-authored runtime artifact.
