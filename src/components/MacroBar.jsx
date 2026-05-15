export default function MacroBar({ label, current, target, unit = 'г', color }) {
  const percent = target ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return (
    <div className="macro-bar">
      <div className="macro-bar-header">
        <span>{label}</span>
        <span className="muted">
          {Math.round(current)} / {target ?? '—'} {unit}
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
    </div>
  );
}
