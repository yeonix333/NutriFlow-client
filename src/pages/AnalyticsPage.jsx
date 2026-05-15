import { useEffect, useState } from 'react';
import { analyticsApi } from '../api/client';
import Alert from '../components/Alert';
import { todayISO } from '../utils/labels';

export default function AnalyticsPage() {
  const [tab, setTab] = useState('daily');
  const [daily, setDaily] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [chart, setChart] = useState([]);
  const [water, setWater] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setError('');
    if (tab === 'daily') {
      analyticsApi.daily(date).then((r) => {
        setDaily(r.data);
        setWater(String(r.data?.waterIntake ?? ''));
        setWeight(String(r.data?.weight ?? ''));
      }).catch((e) => setError(e.message));
    } else if (tab === 'weekly') {
      analyticsApi.weekly().then((r) => setWeekly(r.data)).catch((e) => setError(e.message));
    } else if (tab === 'chart') {
      analyticsApi.chart(14).then((r) => setChart(r.data || [])).catch((e) => setError(e.message));
    }
  }, [tab, date]);

  const saveDailyExtras = async (e) => {
    e.preventDefault();
    try {
      await analyticsApi.updateDaily({
        date,
        waterIntake: water ? Number(water) : undefined,
        weight: weight ? Number(weight) : undefined,
      });
      setSuccess('Збережено');
      const r = await analyticsApi.daily(date);
      setDaily(r.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Аналітика</h1>
          <p className="muted">Прогрес харчування та вода / вага</p>
        </div>
      </header>

      {error && <Alert onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}

      <div className="tabs">
        {['daily', 'weekly', 'chart'].map((t) => (
          <button
            key={t}
            type="button"
            className={tab === t ? 'tab active' : 'tab'}
            onClick={() => setTab(t)}
          >
            {t === 'daily' ? 'День' : t === 'weekly' ? 'Тиждень' : 'Графік'}
          </button>
        ))}
      </div>

      {tab === 'daily' && (
        <>
          <section className="card">
            <label className="inline-label">
              Дата:
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            {daily && (
              <div className="stats-row">
                <div className="stat-card">
                  <span className="stat-label">Калорії</span>
                  <span className="stat-value sm">{Math.round(daily.totalNutrition?.calories || 0)}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Вода (мл)</span>
                  <span className="stat-value sm">{daily.waterIntake || 0}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Вага (кг)</span>
                  <span className="stat-value sm">{daily.weight || '—'}</span>
                </div>
              </div>
            )}
          </section>

          <section className="card">
            <h3>Вода та вага</h3>
            <form className="inline-form" onSubmit={saveDailyExtras}>
              <input type="number" placeholder="Вода, мл" value={water} onChange={(e) => setWater(e.target.value)} />
              <input type="number" step="0.1" placeholder="Вага, кг" value={weight} onChange={(e) => setWeight(e.target.value)} />
              <button type="submit" className="btn btn-primary">Зберегти</button>
            </form>
          </section>
        </>
      )}

      {tab === 'weekly' && weekly && (
        <section className="card">
          <h2>Тижневий підсумок</h2>
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label">Середні ккал</span>
              <span className="stat-value sm">{Math.round(weekly.summary?.averageCalories || 0)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Днів відстежено</span>
              <span className="stat-value sm">{weekly.summary?.daysTracked || 0}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Білки (сер.)</span>
              <span className="stat-value sm">{Math.round(weekly.summary?.averageProtein || 0)} г</span>
            </div>
          </div>
        </section>
      )}

      {tab === 'chart' && (
        <section className="card">
          <h2>Калорії за 14 днів</h2>
          <div className="chart-bars">
            {chart.map((d) => {
              const max = Math.max(...chart.map((c) => c.calories || 0), 1);
              const h = ((d.calories || 0) / max) * 100;
              return (
                <div key={d.date} className="chart-bar-col" title={`${d.date}: ${Math.round(d.calories)} ккал`}>
                  <div className="chart-bar" style={{ height: `${h}%` }} />
                  <small>{new Date(d.date).getDate()}</small>
                </div>
              );
            })}
          </div>
          {chart.length === 0 && <p className="muted">Недостатньо даних</p>}
        </section>
      )}
    </div>
  );
}
