const CACHE_VERSION = 'crew31-v2';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// HTML? ?덈? 罹먯떆 ????- ??긽 ?ㅽ듃?뚰겕?먯꽌
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // HTML ?뚯씪? ??긽 ?ㅽ듃?뚰겕 ?곗꽑, 罹먯떆 ???????  if(event.request.mode === 'navigate' || 
     url.pathname.endsWith('.html') ||
     event.request.headers.get('accept')?.includes('text/html')){
    event.respondWith(
      fetch(event.request, {cache: 'no-store'}).catch(() => {
        return new Response('?ㅽ봽?쇱씤 ?곹깭?낅땲?? ?명꽣???곌껐???뺤씤?댁＜?몄슂.', {
          headers: {'Content-Type': 'text/html; charset=utf-8'}
        });
      })
    );
    return;
  }
  // ?섎㉧吏 由ъ냼?ㅻ룄 罹먯떆 ????  event.respondWith(fetch(event.request, {cache: 'no-store'}));
});

// ?몄떆 ?뚮┝
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const { title, body, icon, data: extra } = data.notification || data;
  event.waitUntil(
    self.registration.showNotification(title || '?뱼 crew31', {
      body: body || '',
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      data: extra || {},
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('crew31') && 'focus' in c) return c.focus();
      }
      return clients.openWindow('https://5sq224fdw5-eng.github.io/crew31/crew31.html');
    })
  );
});
