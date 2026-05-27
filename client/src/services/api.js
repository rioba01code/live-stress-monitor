const BASE_URL = 'http://localhost:5001';

const handleResponse = async (response) => {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    window.location.reload(); 
    throw new Error('Cryptographic token expired or invalid.');
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP Network error: ${response.status}`);
  }
  return response.json();
};

export const api = {
  getTelemetry: async (userId, token) => {
    return fetch(`${BASE_URL}/api/stress?userId=${userId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(handleResponse);
  },

  login: async (email, password) => {
    return fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(handleResponse);
  },

  signup: async (payload) => {
    return fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, country: 'Kenya' })
    }).then(handleResponse);
  },

  updateSlot: async (payload, token) => {
    return fetch(`${BASE_URL}/api/slots/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }).then(handleResponse);
  }
};