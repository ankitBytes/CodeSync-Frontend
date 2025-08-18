export const API_BASE_URL = (import.meta?.env?.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export function apiUrl(path = '') {
  const normalizedPath = String(path || '').startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}


