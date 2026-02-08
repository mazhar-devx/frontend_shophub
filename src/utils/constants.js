export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
export const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || 'http://127.0.0.1:5000/img/users/';
export const DEFAULT_AVATAR = 'default.jpg';

/** Product images from API are often relative (e.g. /uploads/xxx). Use this so they load from the backend. */
export function getProductImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = API_URL.replace(/\/$/, '');
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
}
