const API_URL = import.meta.env.VITE_API_URL || '/api';

function formatApiError(data, status) {
  if (data?.errors?.length) {
    const messages = [...new Set(data.errors.map((e) => e.msg).filter(Boolean))];
    if (messages.length) return messages.join('. ');
  }
  return data?.message || `Помилка ${status}`;
}

function getToken() {
  return localStorage.getItem('token');
}

export async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = formatApiError(data, response.status);
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authApi = {
  register: (body) => apiRequest('/auth/register', { method: 'POST', body }),
  login: (body) => apiRequest('/auth/login', { method: 'POST', body }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (body) => apiRequest('/auth/profile', { method: 'PUT', body }),
};

export const productsApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/products${q ? `?${q}` : ''}`);
  },
  get: (id) => apiRequest(`/products/${id}`),
  create: (body) => apiRequest('/products', { method: 'POST', body }),
  update: (id, body) => apiRequest(`/products/${id}`, { method: 'PUT', body }),
  remove: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
};

export const mealsApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/meals${q ? `?${q}` : ''}`);
  },
  get: (id) => apiRequest(`/meals/${id}`),
  create: (body) => apiRequest('/meals', { method: 'POST', body }),
  update: (id, body) => apiRequest(`/meals/${id}`, { method: 'PUT', body }),
  remove: (id) => apiRequest(`/meals/${id}`, { method: 'DELETE' }),
};

export const analyticsApi = {
  daily: (date) =>
    apiRequest(`/analytics/daily${date ? `?date=${date}` : ''}`),
  weekly: (endDate) =>
    apiRequest(`/analytics/weekly${endDate ? `?endDate=${endDate}` : ''}`),
  monthly: (year, month) => {
    const params = new URLSearchParams();
    if (year != null) params.set('year', year);
    if (month != null) params.set('month', month);
    const q = params.toString();
    return apiRequest(`/analytics/monthly${q ? `?${q}` : ''}`);
  },
  chart: (days = 30) => apiRequest(`/analytics/chart?days=${days}`),
  mealsCategory: (days = 7) =>
    apiRequest(`/analytics/meals-category?days=${days}`),
  updateDaily: (body) => apiRequest('/analytics/daily', { method: 'PUT', body }),
};

export const aiApi = {
  recognizeProduct: (productName) =>
    apiRequest('/ai/recognize-product', { method: 'POST', body: { productName } }),
  createProduct: (productName) =>
    apiRequest('/ai/create-product', { method: 'POST', body: { productName } }),
  analyzeDaily: (date) =>
    apiRequest(`/ai/analyze-daily${date ? `?date=${date}` : ''}`),
  analyzeWeekly: (endDate) =>
    apiRequest(`/ai/analyze-weekly${endDate ? `?endDate=${endDate}` : ''}`),
  suggestions: () => apiRequest('/ai/suggestions'),
};
