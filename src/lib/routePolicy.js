export function decideRoute(evaluation, policy) {
  const s = evaluation.scores;
  const family = evaluation.tool_risk_family.scores;
  const t = policy.thresholds;

  if (s.secret_exposure_risk >= t.deny.secret_exposure_risk_min || family.blockworthy >= t.deny.blockworthy_min) {
    return 'DENY';
  }

  if (
    s.destructive_action >= t.request_approval.destructive_action_min ||
    s.privilege_escalation_risk >= t.request_approval.privilege_escalation_risk_min ||
    evaluation.approval_need_score >= t.request_approval.approval_need_score_min ||
    family.approval_needed >= t.request_approval.approval_needed_min
  ) {
    return 'REQUEST_APPROVAL';
  }

  if (
    s.external_side_effect >= t.sandbox.external_side_effect_min &&
    s.safe_to_sandbox >= t.sandbox.safe_to_sandbox_min &&
    family.sandboxable >= t.sandbox.sandboxable_min
  ) {
    return 'SANDBOX';
  }

  if (
    s.destructive_action <= t.allow.destructive_action_max &&
    s.privilege_escalation_risk <= t.allow.privilege_escalation_risk_max &&
    s.external_side_effect <= t.allow.external_side_effect_max &&
    s.secret_exposure_risk <= t.allow.secret_exposure_risk_max &&
    evaluation.approval_need_score <= t.allow.approval_need_score_max &&
    family.routine_safe >= t.allow.routine_safe_min
  ) {
    return 'ALLOW';
  }

  return policy.fallback_route;
}
