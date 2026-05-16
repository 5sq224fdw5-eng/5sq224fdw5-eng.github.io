// firebase-messaging-sw.js 대신 이걸 사용
// 파일명: crew31-sw.js
// GitHub 루트 저장소에 배포

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
