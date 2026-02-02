// src/api.js

// In production (Nginx reverse proxy), API is served from same origin at /api
// In development, you can set VITE_API_URL=http://localhost:5000
const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const errorMessage = body.error || body.message || 'Request failed';
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function fetchEntries() {
  const response = await fetch(`${API_BASE_URL}/api/entries`);
  return handleResponse(response);
}

export async function createEntry(content) {
  const response = await fetch(`${API_BASE_URL}/api/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return handleResponse(response);
}

export function getApiBaseUrl() {
  return `${API_BASE_URL}/api`;
}

