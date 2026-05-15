import { useEffect, useState } from 'react';
import { mealsApi, productsApi } from '../api/client';
import Alert from '../components/Alert';
import { MEAL_TYPES, mealTypeLabel, todayISO } from '../utils/labels';

export default function MealsPage() {
  const [meals, setMeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterDate, setFilterDate] = useState(todayISO());

  const [form, setForm] = useState({
    name: '',
    mealType: 'lunch',
    date: todayISO(),
    notes: '',
    items: [{ product: '', amount: 100 }],
  });

  const loadMeals = () => {
    mealsApi
      .list({ startDate: filterDate, endDate: filterDate })
      .then((res) => setMeals(res.data || []))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    productsApi.list({ limit: 100 }).then((res) => setProducts(res.data || []));
  }, []);

  useEffect(() => {
    loadMeals();
  }, [filterDate]);

  const setItem = (index, key, value) => {
    setForm((f) => {
      const items = [...f.items];
      items[index] = { ...items[index], [key]: value };
      return { ...f, items };
    });
  };

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, { product: '', amount: 100 }] }));

  const removeItem = (index) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = {
        name: form.name,
        mealType: form.mealType,
        date: form.date,
        notes: form.notes || undefined,
        items: form.items
          .filter((i) => i.product)
          .map((i) => ({ product: i.product, amount: Number(i.amount) })),
      };
      if (!body.items.length) throw new Error('Додайте хоча б один продукт');
      await mealsApi.create(body);
      setForm({
        name: '',
        mealType: 'lunch',
        date: todayISO(),
        notes: '',
        items: [{ product: '', amount: 100 }],
      });
      setShowForm(false);
      setSuccess('Прийом їжі збережено');
      loadMeals();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Видалити прийом їжі?')) return;
    try {
      await mealsApi.remove(id);
      loadMeals();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Прийоми їжі</h1>
          <p className="muted">Записуйте що їли протягом дня</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Скасувати' : '+ Додати'}
        </button>
      </header>

      {error && <Alert onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}

      {showForm && (
        <section className="card">
          <h2>Новий прийом їжі</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
              <label>
                Назва
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label>
                Тип
                <select value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })}>
                  {MEAL_TYPES.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </label>
              <label>
                Дата
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </label>
              <label className="span-2">
                Нотатки
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </label>
            </div>

            <h3 className="form-section-title">Продукти</h3>
            {form.items.map((item, i) => (
              <div key={i} className="meal-item-row">
                <select value={item.product} onChange={(e) => setItem(i, 'product', e.target.value)} required>
                  <option value="">Оберіть продукт</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={item.amount}
                  onChange={(e) => setItem(i, 'amount', e.target.value)}
                  placeholder="грами"
                />
                {form.items.length > 1 && (
                  <button type="button" className="btn btn-ghost btn-sm danger" onClick={() => removeItem(i)}>
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-ghost btn-sm" onClick={addItem}>
              + Продукт
            </button>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              Зберегти
            </button>
          </form>
        </section>
      )}

      <section className="card">
        <label className="inline-label">
          Дата:
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        </label>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Назва</th>
                <th>Тип</th>
                <th>Ккал</th>
                <th>Продуктів</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {meals.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{mealTypeLabel(m.mealType)}</td>
                  <td>{Math.round(m.totalNutrition?.calories || 0)}</td>
                  <td>{m.items?.length || 0}</td>
                  <td>
                    <button type="button" className="btn btn-ghost btn-sm danger" onClick={() => handleDelete(m._id)}>
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {meals.length === 0 && <p className="muted empty">Немає записів за цю дату</p>}
        </div>
      </section>
    </div>
  );
}
