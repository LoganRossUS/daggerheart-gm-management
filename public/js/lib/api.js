import { getIdToken } from './auth.js';

const API_BASE = 'https://daggerheart-api.tristatehelpdesk812.workers.dev/api';

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

  scenes: {
    list: (campaignId) => apiCall(`/campaigns/${campaignId}/scenes`),
    get: (campaignId, sceneId) => apiCall(`/campaigns/${campaignId}/scenes/${sceneId}`),
    create: (campaignId, data) => apiCall(`/campaigns/${campaignId}/scenes`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (campaignId, sceneId, data) => apiCall(`/campaigns/${campaignId}/scenes/${sceneId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (campaignId, sceneId) => apiCall(`/campaigns/${campaignId}/scenes/${sceneId}`, { method: 'DELETE' }),
  },

  upload: {
    requestUrl: (metadata) => apiCall('/upload', {
      method: 'POST',
      body: JSON.stringify(metadata)
    }),
    // Upload file to R2 and return public URL
    uploadFile: async (file) => {
      const token = await getIdToken();

      // Step 1: Request upload URL
      const { fileId, uploadUrl } = await apiCall('/upload', {
        method: 'POST',
        body: JSON.stringify({
          filename: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });

      // Step 2: Upload file data
      const response = await fetch(`${API_BASE}${uploadUrl}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: file,
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.error || 'Upload failed');
        error.status = response.status;
        throw error;
      }

      return data;
    },
  },
};
