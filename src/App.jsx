import { useEffect, useMemo, useState } from 'react';
import { GraphEditor } from '@fbp/graph-editor';
import { ExampleList } from './components/ExampleList';
import { DecisionInspector } from './components/DecisionInspector';
import { loadJson } from './lib/loadData';

export default function App() {
  const [graph, setGraph] = useState(null);
  const [artifact, setArtifact] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedGraphNodeIds, setSelectedGraphNodeIds] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function bootstrap() {
      try {
        const [loadedGraph, loadedArtifact] = await Promise.all([
          loadJson('/graphs/tool-approval-runtime-v1.json'),
          loadJson('/reports/replay-evals/tool-approval-runtime-v1.json')
        ]);
        setGraph(loadedGraph);
        setArtifact(loadedArtifact);
        setSelectedId(loadedArtifact.results[0]?.example_id ?? null);
      } catch (err) {
        setError(err.message);
      }
    }

    bootstrap();
  }, []);

  const selectedResult = useMemo(
    () => artifact?.results.find((result) => result.example_id === selectedId) ?? null,
    [artifact, selectedId]
  );

  if (error) {
    return <div className="p-8 text-rose-300">{error}</div>;
  }

  if (!graph || !artifact || !selectedResult) {
    return <div className="p-8 text-slate-300">Loading Flow World runtime decision flow…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/95 px-6 py-5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Flow World · Phase 1</p>
            <h1 className="mt-2 text-3xl font-semibold">Runtime decision flow</h1>
            <p className="mt-2 max-w-4xl text-sm text-slate-400">
              A proposed tool call enters a real <code>@fbp/types</code> graph, hits an external gate pack, and exits down a visible route.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs text-slate-300">
            <div>Requested model: <span className="text-slate-100">{artifact.requested_model}</span></div>
            <div className="mt-1">Replay artifact: <span className="text-slate-100">{artifact.artifact_id}</span></div>
          </div>
        </div>
      </header>

      <main className="grid min-h-[calc(100vh-104px)] grid-cols-12 gap-6 p-6">
        <section className="col-span-12 rounded-2xl border border-slate-800 bg-slate-925 p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Replay examples</h2>
              <p className="mt-1 text-xs text-slate-400">Synthetic examples with expected routes</p>
            </div>
          </div>
          <ExampleList examples={artifact.results} selectedId={selectedId} onSelect={setSelectedId} />
        </section>

        <section className="col-span-12 rounded-2xl border border-slate-800 bg-slate-900 lg:col-span-5">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold">Decision graph</h2>
            <p className="mt-1 text-xs text-slate-400">Selected graph nodes: {selectedGraphNodeIds.join(', ') || 'none'}</p>
          </div>
          <div className="h-[720px] overflow-hidden rounded-b-2xl">
            <GraphEditor
              graph={graph}
              definitions={graph.definitions}
              showNodePalette={false}
              showStatusBar={false}
              onSelectionChange={setSelectedGraphNodeIds}
              className="h-full"
            />
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4">
          <DecisionInspector result={selectedResult} />
        </section>
      </main>
    </div>
  );
}
