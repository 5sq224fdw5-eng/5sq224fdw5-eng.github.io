// crew31-sw.js - 푸시 알림 + 캐시 자동 업데이트
const CACHE_VERSION = 'crew31-v3'; // 배포할 때마다 자동 갱신됨

// 설치 시 이전 캐시 삭제
self.addEventListener('install', event => {
  self.skipWaiting(); // 즉시 활성화
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if(key !== CACHE_VERSION) return caches.delete(key);
      }))
    ).then(() => self.clients.claim()) // 모든 탭 즉시 제어
  );
});

// 네트워크 우선 전략 (항상 최신 파일 사용)
self.addEventListener('fetch', event => {
  // HTML 파일은 항상 네트워크에서
  if(event.request.mode === 'navigate' || event.request.url.endsWith('.html')){
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  // 나머지는 캐시 우선
  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached) return cached;
      return fetch(event.request).then(response => {
        if(response.ok){
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

// 푸시 알림
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const { title, body, icon, data: extra } = data.notification || data;
  event.waitUntil(
    self.registration.showNotification(title || '📢 crew31', {
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
