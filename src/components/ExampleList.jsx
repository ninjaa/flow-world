export function ExampleList({ examples, selectedId, onSelect }) {
  return (
    <div className="space-y-3">
      {examples.map((example) => {
        const active = example.example_id === selectedId;
        return (
          <button
            key={example.example_id}
            type="button"
            onClick={() => onSelect(example.example_id)}
            className={`w-full rounded-xl border p-4 text-left transition ${
              active ? 'border-cyan-400 bg-slate-900/90' : 'border-slate-800 bg-slate-900 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-100">{example.example_id}</div>
                <div className="mt-1 text-xs text-slate-400">{example.action_document.action_summary}</div>
              </div>
              <div className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200">
                {example.expected_route}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
