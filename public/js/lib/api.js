import { getIdToken } from './auth.js';

const API_BASE = '/api';

async function apiCall(path, options = {}) {
  const token = await getIdToken();

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'API Error');
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  auth: {
    verify: () => apiCall('/auth/verify', { method: 'POST' }),
  },

  campaigns: {
    list: () => apiCall('/campaigns'),
    get: (id) => apiCall(`/campaigns/${id}`),
    create: (data) => apiCall('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => apiCall(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiCall(`/campaigns/${id}`, { method: 'DELETE' }),
  },

  upload: {
    requestUrl: (metadata) => apiCall('/upload', {
      method: 'POST',
      body: JSON.stringify(metadata)
    }),
  },
};
