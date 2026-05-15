import { categoryLabel } from '../../utils/labels';

export default function ProductRecognizedCard({ data }) {
  if (!data) return null;

  const n = data.nutritionPer100g || {};

  return (
    <div className="ai-product-result">
      <div className="ai-product-result-head">
        <h3>{data.name}</h3>
        {data.category && (
          <span className="ai-pill ai-pill-info">{categoryLabel(data.category)}</span>
        )}
      </div>

      {data.description && <p className="ai-assessment">{data.description}</p>}

      <div className="ai-nutrition-grid">
        <div className="ai-nutrition-item">
          <span className="ai-nutrition-value">{n.calories ?? '—'}</span>
          <span className="ai-nutrition-label">ккал</span>
        </div>
        <div className="ai-nutrition-item">
          <span className="ai-nutrition-value">{n.protein ?? '—'}</span>
          <span className="ai-nutrition-label">білки, г</span>
        </div>
        <div className="ai-nutrition-item">
          <span className="ai-nutrition-value">{n.fats ?? '—'}</span>
          <span className="ai-nutrition-label">жири, г</span>
        </div>
        <div className="ai-nutrition-item">
          <span className="ai-nutrition-value">{n.carbs ?? '—'}</span>
          <span className="ai-nutrition-label">вуглеводи, г</span>
        </div>
        {n.fiber != null && (
          <div className="ai-nutrition-item">
            <span className="ai-nutrition-value">{n.fiber}</span>
            <span className="ai-nutrition-label">клітковина, г</span>
          </div>
        )}
      </div>
      <p className="muted ai-nutrition-note">На 100 г продукту</p>
    </div>
  );
}
