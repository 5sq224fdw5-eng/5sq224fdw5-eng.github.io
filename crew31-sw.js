// crew31 service worker
// 목적: 홈 추가 앱(PWA)이 옛 버전을 캐시하지 않도록 HTML을 항상 네트워크에서 받아옴(network-first).
//      + 푸시 알림 기능 유지.
// 이 파일이 바뀌면 브라우저가 새 버전을 감지해 자동으로 갱신합니다.

const SW_VERSION = 'crew31-2026-06-01b';

// 설치 즉시 활성화 대기 없이 적용
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 활성화 시 오래된 캐시 정리 + 즉시 클라이언트 제어
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) {}
    await self.clients.claim();
  })());
});

// 앱에서 'skipWaiting' 메시지를 보내면 즉시 새 버전 적용
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting' || (event.data && event.data.type === 'skipWaiting')) {
    self.skipWaiting();
  }
});

// 페이지(HTML) 요청은 항상 네트워크 우선 → 업데이트가 바로 반영됨.
// 네트워크 실패(오프라인) 시에만 캐시 사용.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const accept = req.headers.get('accept') || '';
  const isNav = req.mode === 'navigate' || accept.includes('text/html');
  if (isNav) {
    event.respondWith((async () => {
      try {
        return await fetch(req, { cache: 'no-store' });
      } catch (err) {
        const cached = await caches.match(req);
        return cached || new Response('오프라인 상태입니다.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    })());
  }
  // 그 외 리소스는 기본 동작(브라우저 처리), 별도 캐시하지 않음
});

// ── 푸시 알림 ──
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    try { data = { title: '📋 인트라넷', body: event.data ? event.data.text() : '' }; }
    catch (e2) { data = {}; }
  }
  const title = data.title || '📋 인트라넷';
  const options = {
    body: data.body || '',
    icon: data.icon || 'https://res.cloudinary.com/dcmohbbyi/image/upload/q_auto/f_auto/v1779529932/IMG_2100_pgoqa5.png',
    badge: data.badge || undefined,
    data: data.data || {},
    tag: data.tag || undefined,
    renotify: !!data.tag
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = 'https://5sq224fdw5-eng.github.io/crew31/crew31.html';
  event.waitUntil((async () => {
    const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if (c.url.includes('crew31') && 'focus' in c) return c.focus();
    }
    if (clients.openWindow) return clients.openWindow(targetUrl);
  })());
});
