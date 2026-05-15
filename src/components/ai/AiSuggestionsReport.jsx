import { BulletList, SectionCard } from './AiReportParts';
import { categoryLabel, mealTypeLabel } from '../../utils/labels';

export default function AiSuggestionsReport({ data }) {
  if (!data) return null;

  return (
    <div className="ai-report">
      <div className="ai-report-hero">
        <h2 className="ai-report-title">Персональні поради</h2>
        <p className="ai-report-summary muted">
          Рекомендації на основі вашого профілю та останніх прийомів їжі
        </p>
      </div>

      {data.recommendedProducts?.length > 0 && (
        <SectionCard icon="🛒" title="Рекомендовані продукти">
          <div className="ai-product-cards">
            {data.recommendedProducts.map((p, i) => (
              <div key={i} className="ai-product-card">
                <div className="ai-product-card-head">
                  <strong>{p.name}</strong>
                  {p.category && (
                    <span className="ai-pill ai-pill-info">{categoryLabel(p.category)}</span>
                  )}
                </div>
                {p.reason && <p>{p.reason}</p>}
                {p.whenToEat && (
                  <p className="ai-meta">
                    <span>Коли:</span> {p.whenToEat}
                  </p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {data.mealIdeas?.length > 0 && (
        <SectionCard icon="🍽️" title="Ідеї страв">
          <div className="ai-meal-ideas">
            {data.mealIdeas.map((meal, i) => (
              <article key={i} className="ai-meal-card">
                <header>
                  <span className="ai-pill">{mealTypeLabel(meal.mealType)}</span>
                  <h4>{meal.name}</h4>
                </header>
                {meal.ingredients?.length > 0 && (
                  <p className="ai-ingredients">
                    {meal.ingredients.join(' · ')}
                  </p>
                )}
                {meal.benefits && <p className="ai-benefits">{meal.benefits}</p>}
              </article>
            ))}
          </div>
        </SectionCard>
      )}

      {data.hydrationTips && (
        <SectionCard icon="💧" title="Гідратація" variant="info">
          <p className="ai-assessment">{data.hydrationTips}</p>
        </SectionCard>
      )}

      {data.lifestyleAdvice?.length > 0 && (
        <SectionCard icon="🌿" title="Стиль життя">
          <BulletList items={data.lifestyleAdvice} variant="tip" />
        </SectionCard>
      )}
    </div>
  );
}
