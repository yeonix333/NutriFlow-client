import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsApi, mealsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import MacroBar from '../components/MacroBar';
import Alert from '../components/Alert';
import { mealTypeLabel, todayISO } from '../utils/labels';

export default function DashboardPage() {
  const { user } = useAuth();
  const [daily, setDaily] = useState(null);
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState('');
  const date = todayISO();

  useEffect(() => {
    Promise.all([
      analyticsApi.daily(date),
      mealsApi.list({ startDate: date, endDate: date, limit: 10 }),
    ])
      .then(([dailyRes, mealsRes]) => {
        setDaily(dailyRes.data);
        setMeals(mealsRes.data || []);
      })
      .catch((err) => setError(err.message));
  }, [date]);

  const nutrition = daily?.totalNutrition || {};
  const norms = daily?.dailyNorms || user?.dailyNorms || {};
  const progress = daily?.progress || {};

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Вітаємо, {user?.name}!</h1>
          <p className="muted">Сьогодні — {new Date().toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <Link to="/meals" className="btn btn-primary">
          + Додати прийом їжі
        </Link>
      </header>

      {error && <Alert onClose={() => setError('')}>{error}</Alert>}

      <div className="grid-2 grid-dashboard">
        <section className="card">
          <h2>Калорії сьогодні</h2>
          <div className="stat-big">
            <span className="stat-value">{Math.round(nutrition.calories || 0)}</span>
            <span className="stat-unit">/ {norms.calories ?? '—'} ккал</span>
          </div>
          <div className="progress-track lg">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, progress.caloriesPercent || 0)}%`,
                background: 'var(--accent)',
              }}
            />
          </div>
          <p className="muted stat-hint">{progress.caloriesPercent ?? 0}% від денної норми</p>

          <div className="macro-list">
            <MacroBar label="Білки" current={nutrition.protein || 0} target={norms.protein} color="#3b82f6" />
            <MacroBar label="Жири" current={nutrition.fats || 0} target={norms.fats} color="#f59e0b" />
            <MacroBar label="Вуглеводи" current={nutrition.carbs || 0} target={norms.carbs} color="#10b981" />
          </div>
        </section>

        <section className="card">
          <h2>Рекомендації</h2>
          {daily?.recommendations?.length ? (
            <ul className="recommendations">
              {daily.recommendations.map((r, i) => (
                <li key={i} className={`rec rec-${r.type}`}>
                  <strong>{r.category}</strong>
                  <p>{r.message}</p>
                  {r.suggestion && <small>{r.suggestion}</small>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Додайте прийоми їжі, щоб отримати рекомендації.</p>
          )}
        </section>
      </div>

      <section className="card">
        <div className="card-header-row">
          <h2>Прийоми їжі сьогодні</h2>
          <Link to="/meals" className="link">Усі →</Link>
        </div>
        {meals.length === 0 ? (
          <p className="muted">Ще немає записів за сьогодні.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Назва</th>
                  <th>Тип</th>
                  <th>Ккал</th>
                  <th>Б / Ж / В</th>
                </tr>
              </thead>
              <tbody>
                {meals.map((m) => (
                  <tr key={m._id}>
                    <td>{m.name}</td>
                    <td>{mealTypeLabel(m.mealType)}</td>
                    <td>{Math.round(m.totalNutrition?.calories || 0)}</td>
                    <td className="muted">
                      {Math.round(m.totalNutrition?.protein || 0)} /{' '}
                      {Math.round(m.totalNutrition?.fats || 0)} /{' '}
                      {Math.round(m.totalNutrition?.carbs || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
