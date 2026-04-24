export function ScoreList({ scores = {} }) {
  return (
    <div className="space-y-2">
      {Object.entries(scores).map(([key, value]) => (
        <div key={key}>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
            <span>{key}</span>
            <span>{value.toFixed(2)}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-cyan-400"
              style={{ width: `${Math.max(4, Math.min(100, value * 100))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
