import {
  AssessmentBlock,
  BulletList,
  MotivationBanner,
  SectionCard,
  SuggestionColumns,
} from './AiReportParts';

export default function AiDailyReport({ data }) {
  if (!data) return null;

  return (
    <div className="ai-report">
      <div className="ai-report-hero">
        <h2 className="ai-report-title">Аналіз денного раціону</h2>
        {data.overallAssessment && (
          <p className="ai-report-summary">{data.overallAssessment}</p>
        )}
      </div>

      <div className="ai-report-grid">
        <SectionCard icon="✓" title="Сильні сторони" variant="success">
          <BulletList items={data.strengths} variant="success" />
        </SectionCard>

        <SectionCard icon="!" title="Що покращити" variant="warning">
          <BulletList items={data.weaknesses} variant="warning" />
        </SectionCard>
      </div>

      <SectionCard icon="⚖️" title="Баланс БЖВ">
        <AssessmentBlock
          assessment={data.macroBalance?.assessment}
          recommendations={data.macroBalance?.recommendations}
        />
      </SectionCard>

      <SectionCard icon="🕐" title="Режим харчування">
        <AssessmentBlock
          assessment={data.mealTiming?.assessment}
          recommendations={data.mealTiming?.recommendations}
        />
      </SectionCard>

      {data.missingNutrients?.length > 0 && (
        <SectionCard icon="🧪" title="Можливий дефіцит нутрієнтів" variant="info">
          <BulletList items={data.missingNutrients} variant="info" />
        </SectionCard>
      )}

      {data.specificSuggestions && (
        <SectionCard icon="💡" title="Конкретні поради">
          <SuggestionColumns
            toAdd={data.specificSuggestions.toAdd}
            toReduce={data.specificSuggestions.toReduce}
            alternatives={data.specificSuggestions.alternatives}
          />
        </SectionCard>
      )}

      <MotivationBanner text={data.motivationalMessage} />
    </div>
  );
}
