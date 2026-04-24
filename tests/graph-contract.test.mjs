import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const graph = JSON.parse(await fs.readFile(new URL('../graphs/tool-approval-runtime-v1.json', import.meta.url), 'utf8'));

test('graph has a gate node with external references', () => {
  const gate = graph.nodes.find((node) => node.name === 'tool_approval_gate');
  assert.ok(gate, 'tool_approval_gate node should exist');
  const props = Object.fromEntries(gate.props.map((prop) => [prop.name, prop.value]));
  assert.equal(props.pack_ref, 'prompt-packs/tool-approval-v1');
  assert.equal(props.policy_ref, 'policies/tool-approval-v1');
  assert.equal(props.fallback_route, 'REVIEW');
});

test('graph has explicit route edges from the gate', () => {
  const ports = new Set(graph.edges.filter((edge) => edge.src.node === 'tool_approval_gate').map((edge) => edge.src.port));
  for (const route of ['ALLOW', 'SANDBOX', 'REQUEST_APPROVAL', 'REVIEW', 'DENY']) {
    assert.ok(ports.has(route), `missing route edge for ${route}`);
  }
});
