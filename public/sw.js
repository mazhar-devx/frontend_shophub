// Simple service worker to prevent fetch errors during development
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch handler removed to avoid no-op warning
// self.addEventListener('fetch', (event) => {
//   return;
// });