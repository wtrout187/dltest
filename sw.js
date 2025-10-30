// Service Worker for PWA functionality
const CACHE_NAME = 'dltest-v1.0.0';
const STATIC_CACHE = 'dltest-static-v1.0.0';
const DYNAMIC_CAdltest-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/state.js',
  '/js/storage.js',
  '/js/questions.js',
  '/js/game.js',
  '/js/progress.js',
  '/js/email.js',
  '/js/ui.js',
  '/data/questions.json',
  '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate'ent) => {
  console.log('🚀 Service Worker activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached files or fetch from network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }

        // Fetch from network and cache dynamic content
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache if not a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response
            const responseToCache = networkResponse.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // Return offline fallback for HTML requests
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);

  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgressData());
  }

  if (event.tag === 'sync-email') {
    event.waitUntil(syncEmailNotifications());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received:', event);

  const options = {
    body: event.data ? event.data.text() : 'New notification from DL Test Prep',
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/images/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/icons/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('DL Test Prep', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event);

  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          for (let client of clientList) {
            if (client.url === '/' && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('💬 Message received in SW:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_QUESTIONS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return cache.put('/data/questions.json', new Response(JSON.stringify(event.data.questions)));
        })
    );
  }
});

// Sync progress data when back online
async function syncProgressData() {
  try {
    console.log('🔄 Syncing progress data...');

    // Get stored progress data
    const cache = await caches.open(DYNAMIC_CACHE);
    const progressData = await cache.match('/api/progress');

    if (progressData) {
      // Send to server when online
      const response = await fetch('/api/sync-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: await progressData.text()
      });

      if (response.ok) {
        console.log('✅ Progress data synced successfully');
        // Remove from cache after successful sync
        await cache.delete('/api/progress');
      }
    }
  } catch (error) {
    console.error('❌ Failed to sync progress data:', error);
  }
}

// Sync email notifications when back online
async function syncEmailNotifications() {
  try {
    console.log('📧 Syncing email notifications...');

    // Get pending email notifications
    const cache = await caches.open(DYNAMIC_CACHE);
    const emailData = await cache.match('/api/pending-emails');

    if (emailData) {
      const emails = await emailData.json();

      for (const email of emails) {
        try {
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(email)
          });

          if (response.ok) {
            console.log('✅ Email notification sent:', email.type);
          }
        } catch (error) {
          console.error('❌ Failed to send email:', error);
        }
      }

      // Clear pending emails after processing
      await cache.delete('/api/pending-emails');
    }
  } catch (error) {
    console.error('❌ Failed to sync email notifications:', error);
  }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('⏰ Periodic sync triggered:', event.tag);

  if (event.tag === 'daily-reminder') {
    event.waitUntil(sendDailyReminder());
  }
});

// Send daily study reminder
async function sendDailyReminder() {
  try {
    const lastStudyDate = await getLastStudyDate();
    const today = new Date().toDateString();

    if (lastStudyDate !== today) {
      // Show reminder notification
      await self.registration.showNotification('Study Reminder', {
        body: 'Don\'t forget to practice for your driver\'s license test today!',
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/icon-72x72.png',
        tag: 'daily-reminder',
        requireInteraction: false,
        actions: [
          {
            action: 'study',
            title: 'Start Studying'
          },
          {
            action: 'later',
            title: 'Remind Later'
          }
        ]
      });
    }
  } catch (error) {
    console.error('❌ Failed to send daily reminder:', error);
  }
}

// Helper function to get last study date
async function getLastStudyDate() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const userData = await cache.match('/api/user-data');

    if (userData) {
      const data = await userData.json();
      return data.lastStudyDate;
    }
  } catch (error) {
    console.error('❌ Failed to get last study date:', error);
  }

  return null;
}

// Handle app updates
self.addEventListener('beforeinstallprompt', (event) => {
  console.log('📱 App install prompt available');

  // Store the event for later use
  self.deferredPrompt = event;

  // Notify the main thread
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'INSTALL_PROMPT_AVAILABLE'
      });
    });
  });
});

// Log service worker errors
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker unhandled rejection:', event.reason);
});

console.log('🔧 Service Worker script loaded');
