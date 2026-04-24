import { ScoreList } from './ScoreList';

function JsonBlock({ value }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-200">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

export function DecisionInspector({ result }) {
  if (!result) return null;

  const familyScores = result.gate_outputs.tool_risk_family.scores;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-100">Chosen route</div>
            <div className="mt-1 text-xs text-slate-400">Expected {result.expected_route} · Predicted {result.predicted_route}</div>
          </div>
          <div className={`rounded-full px-4 py-2 text-sm font-semibold ${result.match ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
            {result.predicted_route}
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-300">{result.reason_summary}</p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="text-sm font-semibold text-slate-100">Action document</h3>
        <div className="mt-4">
          <JsonBlock value={result.action_document} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="text-sm font-semibold text-slate-100">Gate scores</h3>
        <div className="mt-4">
          <ScoreList scores={result.gate_outputs.scores} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-slate-100">Risk family</h3>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">{result.gate_outputs.tool_risk_family.chosen}</span>
        </div>
        <div className="mt-4">
          <ScoreList scores={familyScores} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="text-sm font-semibold text-slate-100">Replay artifact excerpt</h3>
        <div className="mt-4">
          <JsonBlock value={{
            example_id: result.example_id,
            gate_id: result.gate_id,
            pack_id: result.gate_outputs.pack_id,
            pack_version: result.gate_outputs.pack_version,
            provider_model: result.gate_outputs.provider_model,
            approval_need_score: result.gate_outputs.approval_need_score,
            predicted_route: result.predicted_route,
            expected_route: result.expected_route
          }} />
        </div>
      </section>
    </div>
  );
}
