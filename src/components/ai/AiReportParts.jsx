export function MotivationBanner({ text }) {
  if (!text) return null;
  return (
    <div className="ai-motivation">
      <span className="ai-motivation-icon" aria-hidden>✨</span>
      <p>{text}</p>
    </div>
  );
}

export function SectionCard({ icon, title, children, variant }) {
  return (
    <article className={`ai-section ai-section-${variant || 'default'}`}>
      <header className="ai-section-header">
        {icon && <span className="ai-section-icon" aria-hidden>{icon}</span>}
        <h3>{title}</h3>
      </header>
      <div className="ai-section-body">{children}</div>
    </article>
  );
}

export function BulletList({ items, variant = 'default' }) {
  if (!items?.length) return <p className="muted">Немає даних</p>;
  return (
    <ul className={`ai-list ai-list-${variant}`}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function AssessmentBlock({ assessment, recommendations }) {
  return (
  <>
      {assessment && <p className="ai-assessment">{assessment}</p>}
      {recommendations?.length > 0 && (
        <BulletList items={recommendations} variant="tip" />
      )}
    </>
  );
}

export function SuggestionColumns({ toAdd, toReduce, alternatives }) {
  const cols = [
    { key: 'add', title: 'Додати', items: toAdd, icon: '➕', variant: 'success' },
    { key: 'reduce', title: 'Зменшити', items: toReduce, icon: '➖', variant: 'warning' },
    { key: 'alt', title: 'Альтернативи', items: alternatives, icon: '↔️', variant: 'info' },
  ].filter((c) => c.items?.length);

  if (!cols.length) return null;

  return (
    <div className="ai-suggestion-grid">
      {cols.map((col) => (
        <div key={col.key} className={`ai-suggestion-col ai-suggestion-${col.variant}`}>
          <h4>
            <span aria-hidden>{col.icon}</span> {col.title}
          </h4>
          <BulletList items={col.items} variant={col.variant} />
        </div>
      ))}
    </div>
  );
}
