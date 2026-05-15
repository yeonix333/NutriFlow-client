import { AssessmentBlock, BulletList, MotivationBanner, SectionCard } from './AiReportParts';

function ScoreRing({ score }) {
  const value = Math.min(10, Math.max(0, Number(score) || 0));
  const percent = (value / 10) * 100;
  return (
    <div className="ai-score" style={{ '--score': percent }}>
      <div className="ai-score-ring">
        <span className="ai-score-value">{value}</span>
        <span className="ai-score-max">/10</span>
      </div>
      <span className="ai-score-label">Регулярність</span>
    </div>
  );
}

export default function AiWeeklyReport({ data }) {
  if (!data) return null;

  const { consistency, trends, progressTowardsGoal, weeklyRecommendations } = data;

  return (
    <div className="ai-report">
      <div className="ai-report-hero">
        <h2 className="ai-report-title">Тижневий аналіз</h2>
        {data.weeklyOverview && (
          <p className="ai-report-summary">{data.weeklyOverview}</p>
        )}
      </div>

      <div className="ai-weekly-top">
        {consistency && (
          <SectionCard icon="📅" title="Регулярність харчування">
            <div className="ai-consistency-row">
              <ScoreRing score={consistency.score} />
              <div className="ai-consistency-details">
                {consistency.assessment && (
                  <p className="ai-assessment">{consistency.assessment}</p>
                )}
                <div className="ai-stats-inline">
                  {consistency.daysOnTrack != null && (
                    <span className="ai-pill ai-pill-success">
                      У нормі: {consistency.daysOnTrack} дн.
                    </span>
                  )}
                  {consistency.daysOffTrack != null && (
                    <span className="ai-pill ai-pill-warning">
                      Відхилення: {consistency.daysOffTrack} дн.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {progressTowardsGoal && (
          <SectionCard icon="🎯" title="Прогрес до мети" variant="success">
            {progressTowardsGoal.assessment && (
              <p className="ai-assessment">{progressTowardsGoal.assessment}</p>
            )}
            {progressTowardsGoal.estimatedProgress && (
              <p className="ai-highlight">{progressTowardsGoal.estimatedProgress}</p>
            )}
          </SectionCard>
        )}
      </div>

      {trends && (
        <SectionCard icon="📈" title="Тренди">
          <div className="ai-trends">
            {trends.calories && (
              <div className="ai-trend-item">
                <span className="ai-trend-label">Калорії</span>
                <span className="ai-trend-value">{trends.calories}</span>
              </div>
            )}
            {trends.protein && (
              <div className="ai-trend-item">
                <span className="ai-trend-label">Білки</span>
                <span className="ai-trend-value">{trends.protein}</span>
              </div>
            )}
          </div>
          {trends.patterns?.length > 0 && (
            <>
              <h4 className="ai-subtitle">Паттерни</h4>
              <BulletList items={trends.patterns} variant="info" />
            </>
          )}
        </SectionCard>
      )}

      {data.keyIssues?.length > 0 && (
        <SectionCard icon="⚠️" title="Ключові проблеми" variant="warning">
          <BulletList items={data.keyIssues} variant="warning" />
        </SectionCard>
      )}

      {data.achievements?.length > 0 && (
        <SectionCard icon="🏆" title="Досягнення" variant="success">
          <BulletList items={data.achievements} variant="success" />
        </SectionCard>
      )}

      {weeklyRecommendations && (
        <SectionCard icon="📋" title="Рекомендації на тиждень">
          {weeklyRecommendations.priority?.length > 0 && (
            <>
              <h4 className="ai-subtitle">Пріоритет</h4>
              <BulletList items={weeklyRecommendations.priority} variant="tip" />
            </>
          )}
          {weeklyRecommendations.mealPlan?.length > 0 && (
            <>
              <h4 className="ai-subtitle">Планування їжі</h4>
              <BulletList items={weeklyRecommendations.mealPlan} variant="tip" />
            </>
          )}
          {weeklyRecommendations.lifestyle?.length > 0 && (
            <>
              <h4 className="ai-subtitle">Стиль життя</h4>
              <BulletList items={weeklyRecommendations.lifestyle} variant="tip" />
            </>
          )}
        </SectionCard>
      )}

      {data.nextSteps?.length > 0 && (
        <SectionCard icon="👣" title="Наступні кроки">
          <BulletList items={data.nextSteps} variant="tip" />
        </SectionCard>
      )}

      <MotivationBanner text={data.motivationalMessage} />
    </div>
  );
}
