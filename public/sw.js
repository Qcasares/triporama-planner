const CACHE_NAME = 'triporama-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/placeholder.svg',
  '/og-image.png'
];

const API_CACHE_NAME = 'triporama-api-cache-v1';
const MAP_TILE_CACHE_NAME = 'triporama-map-tiles-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name !== CACHE_NAME &&
              name !== API_CACHE_NAME &&
              name !== MAP_TILE_CACHE_NAME
            );
          })
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Helper function to determine if a request is for a map tile
const isMapTileRequest = (url) => {
  return url.includes('tile.openstreetmap.org');
};

// Helper function to determine if a request is for the Places API
const isPlacesApiRequest = (url) => {
  return url.includes('maps.googleapis.com/maps/api/place');
};

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle map tile requests
  if (isMapTileRequest(url.href)) {
    event.respondWith(
      caches.open(MAP_TILE_CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
    return;
  }

  // Handle Places API requests
  if (isPlacesApiRequest(url.href)) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            // Cache for 1 hour
            const responseToCache = networkResponse.clone();
            const headers = new Headers(responseToCache.headers);
            headers.append('sw-fetched-on', new Date().toISOString());
            const cachedResponse = new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers,
            });
            cache.put(request, cachedResponse);
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
    return;
  }

  // Handle other requests
  event.respondWith(
    caches.match(request).then((response) => {
      return (
        response ||
        fetch(request).then((networkResponse) => {
          // Cache successful GET requests
          if (request.method === 'GET') {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        })
      );
    })
  );
});

// Handle offline fallback
self.addEventListener('fetch', (event) => {
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(request).then((response) => {
        return (
          response ||
          new Response('Offline Mode: This content is not available offline.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          })
        );
      })
    );
  }
});
