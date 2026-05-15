import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { GENDERS, ACTIVITY_LEVELS, GOALS } from '../utils/labels';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profile, setProfile] = useState(user?.profile || {});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => setProfile((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await updateProfile({
        name,
        email,
        profile: {
          ...profile,
          age: Number(profile.age) || undefined,
          weight: Number(profile.weight) || undefined,
          height: Number(profile.height) || undefined,
        },
      });
      setSuccess('Профіль оновлено');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const norms = user?.dailyNorms;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Профіль</h1>
          <p className="muted">Особисті дані та денні норми</p>
        </div>
      </header>

      {error && <Alert onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}

      {norms && (
        <section className="card">
          <h2>Денні норми (розраховані)</h2>
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label">Ккал</span>
              <span className="stat-value sm">{norms.calories}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Білки</span>
              <span className="stat-value sm">{norms.protein} г</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Жири</span>
              <span className="stat-value sm">{norms.fats} г</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Вуглеводи</span>
              <span className="stat-value sm">{norms.carbs} г</span>
            </div>
          </div>
        </section>
      )}

      <section className="card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
            <label>
              Ім&apos;я
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Вік
              <input type="number" value={profile.age ?? ''} onChange={(e) => setField('age', e.target.value)} />
            </label>
            <label>
              Стать
              <select value={profile.gender || 'male'} onChange={(e) => setField('gender', e.target.value)}>
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </label>
            <label>
              Вага (кг)
              <input type="number" value={profile.weight ?? ''} onChange={(e) => setField('weight', e.target.value)} />
            </label>
            <label>
              Зріст (см)
              <input type="number" value={profile.height ?? ''} onChange={(e) => setField('height', e.target.value)} />
            </label>
            <label>
              Активність
              <select value={profile.activityLevel || 'moderate'} onChange={(e) => setField('activityLevel', e.target.value)}>
                {ACTIVITY_LEVELS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </label>
            <label>
              Ціль
              <select value={profile.goal || 'maintain'} onChange={(e) => setField('goal', e.target.value)}>
                {GOALS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Збереження...' : 'Зберегти'}
          </button>
        </form>
      </section>
    </div>
  );
}
