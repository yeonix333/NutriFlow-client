import { useEffect, useState } from 'react';
import { aiApi, productsApi } from '../api/client';
import Alert from '../components/Alert';
import { CATEGORIES, categoryLabel } from '../utils/labels';

const emptyProduct = {
  name: '',
  category: 'other',
  nutritionPer100g: { calories: '', protein: '', fats: '', carbs: '' },
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [form, setForm] = useState(emptyProduct);
  const [aiName, setAiName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    productsApi
      .list(params)
      .then((res) => setProducts(res.data || []))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = {
        ...form,
        nutritionPer100g: {
          calories: Number(form.nutritionPer100g.calories),
          protein: Number(form.nutritionPer100g.protein),
          fats: Number(form.nutritionPer100g.fats),
          carbs: Number(form.nutritionPer100g.carbs),
        },
      };
      await productsApi.create(body);
      setForm(emptyProduct);
      setShowForm(false);
      setSuccess('Продукт додано');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Видалити продукт?')) return;
    try {
      await productsApi.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAiCreate = async (e) => {
    e.preventDefault();
    if (!aiName.trim()) return;
    setError('');
    setLoading(true);
    try {
      await aiApi.createProduct(aiName.trim());
      setAiName('');
      setSuccess('Продукт створено через AI');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setNutrition = (key, value) =>
    setForm((f) => ({
      ...f,
      nutritionPer100g: { ...f.nutritionPer100g, [key]: value },
    }));

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Продукти</h1>
          <p className="muted">База продуктів для прийомів їжі</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Скасувати' : '+ Новий продукт'}
        </button>
      </header>

      {error && <Alert onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}

      <section className="card">
        <h3>Додати через AI</h3>
        <form className="inline-form" onSubmit={handleAiCreate}>
          <input
            placeholder="Назва продукту, напр. борщ"
            value={aiName}
            onChange={(e) => setAiName(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary" disabled={loading}>
            AI створити
          </button>
        </form>
      </section>

      {showForm && (
        <section className="card">
          <h2>Новий продукт</h2>
          <form onSubmit={handleCreate} className="form">
            <div className="form-grid">
              <label>
                Назва
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Категорія
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Ккал / 100г
                <input type="number" min="0" value={form.nutritionPer100g.calories} onChange={(e) => setNutrition('calories', e.target.value)} required />
              </label>
              <label>
                Білки
                <input type="number" min="0" step="0.1" value={form.nutritionPer100g.protein} onChange={(e) => setNutrition('protein', e.target.value)} required />
              </label>
              <label>
                Жири
                <input type="number" min="0" step="0.1" value={form.nutritionPer100g.fats} onChange={(e) => setNutrition('fats', e.target.value)} required />
              </label>
              <label>
                Вуглеводи
                <input type="number" min="0" step="0.1" value={form.nutritionPer100g.carbs} onChange={(e) => setNutrition('carbs', e.target.value)} required />
              </label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Зберегти
            </button>
          </form>
        </section>
      )}

      <section className="card">
        <form className="inline-form filters" onSubmit={handleSearch}>
          <input
            placeholder="Пошук..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Усі категорії</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-secondary">
            Знайти
          </button>
        </form>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Назва</th>
                <th>Категорія</th>
                <th>Ккал</th>
                <th>Б / Ж / В</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{categoryLabel(p.category)}</td>
                  <td>{p.nutritionPer100g?.calories}</td>
                  <td className="muted">
                    {p.nutritionPer100g?.protein} / {p.nutritionPer100g?.fats} /{' '}
                    {p.nutritionPer100g?.carbs}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm danger"
                      onClick={() => handleDelete(p._id)}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="muted empty">Продуктів не знайдено</p>}
        </div>
      </section>
    </div>
  );
}
