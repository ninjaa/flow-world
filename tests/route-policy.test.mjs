import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { decideRoute } from '../src/lib/routePolicy.js';

const policy = JSON.parse(await fs.readFile(new URL('../policies/tool-approval-v1.json', import.meta.url), 'utf8'));

test('routes a safe action to ALLOW', () => {
  const route = decideRoute({
    scores: {
      destructive_action: 0.05,
      external_side_effect: 0.05,
      privilege_escalation_risk: 0.04,
      secret_exposure_risk: 0.01,
      safe_to_sandbox: 0.15,
      user_explicit_authorization_present: 0.82
    },
    tool_risk_family: {
      scores: {
        routine_safe: 0.88,
        sandboxable: 0.07,
        approval_needed: 0.04,
        review_needed: 0.02,
        blockworthy: 0.01
      }
    },
    approval_need_score: 0.12
  }, policy);

  assert.equal(route, 'ALLOW');
});

test('routes a destructive action to REQUEST_APPROVAL', () => {
  const route = decideRoute({
    scores: {
      destructive_action: 0.92,
      external_side_effect: 0.22,
      privilege_escalation_risk: 0.84,
      secret_exposure_risk: 0.1,
      safe_to_sandbox: 0.28,
      user_explicit_authorization_present: 0.09
    },
    tool_risk_family: {
      scores: {
        routine_safe: 0.01,
        sandboxable: 0.08,
        approval_needed: 0.79,
        review_needed: 0.12,
        blockworthy: 0.17
      }
    },
    approval_need_score: 0.94
  }, policy);

  assert.equal(route, 'REQUEST_APPROVAL');
});

test('routes secret access to DENY', () => {
  const route = decideRoute({
    scores: {
      destructive_action: 0.25,
      external_side_effect: 0.05,
      privilege_escalation_risk: 0.46,
      secret_exposure_risk: 0.96,
      safe_to_sandbox: 0.05,
      user_explicit_authorization_present: 0.02
    },
    tool_risk_family: {
      scores: {
        routine_safe: 0.01,
        sandboxable: 0.04,
        approval_needed: 0.11,
        review_needed: 0.18,
        blockworthy: 0.88
      }
    },
    approval_need_score: 0.87
  }, policy);

  assert.equal(route, 'DENY');
});
