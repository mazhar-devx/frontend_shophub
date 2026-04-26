const PROD_BACKEND = 'https://backendshophub-production.up.railway.app';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_URL = isLocal
  ? (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5005')
  : PROD_BACKEND;

export const IMAGE_URL = isLocal
  ? (import.meta.env.VITE_IMAGE_URL || 'http://127.0.0.1:5005/img/users/')
  : `${PROD_BACKEND}/img/users/`;

// Local SVG fallback avatar — avoids 404 for missing default.jpg on backend
export const DEFAULT_AVATAR_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23374151'/%3E%3Ccircle cx='20' cy='15' r='7' fill='%239CA3AF'/%3E%3Cellipse cx='20' cy='34' rx='12' ry='8' fill='%239CA3AF'/%3E%3C/svg%3E";

export const DEFAULT_AVATAR = 'default.jpg';

/** Product images from API are often relative (e.g. /uploads/xxx). Use this so they load from the backend. */
export function getProductImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
  if (path === 'default.jpg') return DEFAULT_AVATAR_FALLBACK;
  const base = API_URL.replace(/\/$/, '');
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
}
