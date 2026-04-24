# Test Spec — Flow World phase 1 runtime decision flow v1

- **Status:** draft
- **Scope:** phase 1 only

---

## Test layers

### 1. Graph artifact validation
- graph parses
- gate node exists
- route ports exist
- pack ref exists
- policy ref exists

### 2. Gate pack validation
- schema parses
- required gate outputs exist
- pack version metadata exists

### 3. Policy validation
- policy maps gate outputs to valid route labels
- fallback route is valid

### 4. Replay tests
- safe example routes to `ALLOW`
- approval-worthy example routes to `REQUEST_APPROVAL`
- replay artifact records gate outputs and chosen route

### 5. UI checks
- graph is visible
- chosen route is visible
- gate outputs are visible

---

## Acceptance test matrix

| ID | Scenario | Expected result |
|---|---|---|
| AT1 | Load graph | Graph parses and renders |
| AT2 | Inspect gate node | Pack and policy refs are visible |
| AT3 | Replay safe example | Route is `ALLOW` |
| AT4 | Replay risky example | Route is `REQUEST_APPROVAL` |
| AT5 | Inspect safe example | Gate outputs are visible |
| AT6 | Inspect risky example | Gate outputs are visible |

---

## Failure conditions

The slice is not done if:

- the graph is not a real `@fbp/types` artifact
- route ports are not explicit
- the gate pack is inlined instead of referenced
- the route policy is hidden or implicit
- the UI does not show gate outputs and branch choice
