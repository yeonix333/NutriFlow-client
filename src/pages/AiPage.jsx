import { useState } from 'react';
import { aiApi } from '../api/client';
import Alert from '../components/Alert';
import AiDailyReport from '../components/ai/AiDailyReport';
import AiWeeklyReport from '../components/ai/AiWeeklyReport';
import AiSuggestionsReport from '../components/ai/AiSuggestionsReport';
import ProductRecognizedCard from '../components/ai/ProductRecognizedCard';
import { todayISO } from '../utils/labels';

function AiAnalysisResult({ tab, data }) {
  if (!data) return null;
  if (tab === 'daily') return <AiDailyReport data={data} />;
  if (tab === 'weekly') return <AiWeeklyReport data={data} />;
  return <AiSuggestionsReport data={data} />;
}

export default function AiPage() {
  const [tab, setTab] = useState('daily');
  const [result, setResult] = useState(null);
  const [productName, setProductName] = useState('');
  const [recognized, setRecognized] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const runAnalyze = async () => {
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res =
        tab === 'daily'
          ? await aiApi.analyzeDaily(todayISO())
          : tab === 'weekly'
            ? await aiApi.analyzeWeekly()
            : await aiApi.suggestions();
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runRecognize = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setRecognized(null);
    try {
      const res = await aiApi.recognizeProduct(productName.trim());
      setRecognized(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>AI-помічник</h1>
          <p className="muted">Аналіз раціону та розпізнавання продуктів (ліміт 20 запитів/год)</p>
        </div>
      </header>

      {error && <Alert onClose={() => setError('')}>{error}</Alert>}

      <section className="card">
        <h3>Розпізнати продукт</h3>
        <form className="inline-form" onSubmit={runRecognize}>
          <input
            placeholder="Назва продукту"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary" disabled={loading}>
            {loading ? '...' : 'Розпізнати'}
          </button>
        </form>
        {recognized && <ProductRecognizedCard data={recognized} />}
      </section>

      <section className="card ai-analysis-card">
        <div className="ai-analysis-toolbar">
          <div className="tabs">
            {['daily', 'weekly', 'suggestions'].map((t) => (
              <button
                key={t}
                type="button"
                className={tab === t ? 'tab active' : 'tab'}
                onClick={() => {
                  setTab(t);
                  setResult(null);
                }}
              >
                {t === 'daily' ? 'День' : t === 'weekly' ? 'Тиждень' : 'Поради'}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-primary" onClick={runAnalyze} disabled={loading}>
            {loading ? 'Аналіз...' : 'Запустити аналіз'}
          </button>
        </div>

        {loading && !result && (
          <div className="ai-loading">
            <div className="ai-loading-spinner" />
            <p className="muted">AI аналізує ваш раціон…</p>
          </div>
        )}

        <AiAnalysisResult tab={tab} data={result} />
      </section>
    </div>
  );
}
