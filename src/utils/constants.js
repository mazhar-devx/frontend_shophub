const PROD_BACKEND = 'https://backend-shophub.onrender.com';
export const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:5000' : PROD_BACKEND);
export const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:5000/img/users/' : `${PROD_BACKEND}/img/users/`);
export const DEFAULT_AVATAR = 'default.jpg';

/** Product images from API are often relative (e.g. /uploads/xxx). Use this so they load from the backend. */
export function getProductImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = API_URL.replace(/\/$/, '');
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
}
