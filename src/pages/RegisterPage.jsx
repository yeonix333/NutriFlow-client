import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { GENDERS, ACTIVITY_LEVELS, GOALS } from '../utils/labels';

const emptyProfile = {
  age: '',
  gender: 'male',
  weight: '',
  height: '',
  activityLevel: 'moderate',
  goal: 'maintain',
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(emptyProfile);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setProfileField = (key, value) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const buildProfile = () => {
    const p = {
      gender: profile.gender,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
    };
    if (profile.age !== '') p.age = Number(profile.age);
    if (profile.weight !== '') p.weight = Number(profile.weight);
    if (profile.height !== '') p.height = Number(profile.height);
    return p;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const passwordOk = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
    if (!passwordOk) {
      setError(
        'Пароль має бути мінімум 6 символів і містити велику літеру, малу літеру та цифру (наприклад: Test123)'
      );
      return;
    }

    if (name.trim().length < 2) {
      setError("Ім'я має бути від 2 до 50 символів");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        profile: buildProfile(),
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <span className="brand-icon lg">🥗</span>
          <h1>Реєстрація</h1>
        </div>

        {error && <Alert onClose={() => setError('')}>{error}</Alert>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
            <label>
              Ім&apos;я
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="span-2">
              Пароль (мін. 6 символів, велика/мала літера та цифра)
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>
          </div>

          <h3 className="form-section-title">Профіль (для розрахунку норм)</h3>
          <div className="form-grid">
            <label>
              Вік
              <input
                type="number"
                min={13}
                max={120}
                value={profile.age}
                onChange={(e) => setProfileField('age', e.target.value)}
              />
            </label>
            <label>
              Стать
              <select
                value={profile.gender}
                onChange={(e) => setProfileField('gender', e.target.value)}
              >
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Вага (кг)
              <input
                type="number"
                min={20}
                max={500}
                value={profile.weight}
                onChange={(e) => setProfileField('weight', e.target.value)}
              />
            </label>
            <label>
              Зріст (см)
              <input
                type="number"
                min={50}
                max={300}
                value={profile.height}
                onChange={(e) => setProfileField('height', e.target.value)}
              />
            </label>
            <label>
              Активність
              <select
                value={profile.activityLevel}
                onChange={(e) => setProfileField('activityLevel', e.target.value)}
              >
                {ACTIVITY_LEVELS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Ціль
              <select
                value={profile.goal}
                onChange={(e) => setProfileField('goal', e.target.value)}
              >
                {GOALS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Реєстрація...' : 'Створити акаунт'}
          </button>
        </form>

        <p className="auth-footer">
          Вже є акаунт? <Link to="/login">Увійти</Link>
        </p>
      </div>
    </div>
  );
}
