// Simple service worker to prevent fetch errors during development
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch events but bypass them in development
self.addEventListener('fetch', (event) => {
  // In development, we don't want to cache anything
  // Just let the request go through normally
  return;
});