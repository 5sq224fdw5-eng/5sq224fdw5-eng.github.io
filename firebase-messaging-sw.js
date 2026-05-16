// firebase-messaging-sw.js
// GitHub Pages 루트에 배포해야 합니다: /firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAKE1gsLlu46-ppKHmEorN8ock-NQcE-UM",
  authDomain: "gacha-31.firebaseapp.com",
  databaseURL: "https://gacha-31-default-rtdb.firebaseio.com",
  projectId: "gacha-31",
  storageBucket: "gacha-31.firebasestorage.app",
  messagingSenderId: "645061087845",
  appId: "1:645061087845:web:0999afd0efffdf9ca22c8c"
});

const messaging = firebase.messaging();

// 백그라운드 메시지 수신 (앱이 닫혀있거나 백그라운드일 때)
messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || '📢 crew31 알림', {
    body: body || '',
    icon: icon || '/favicon.ico',
    badge: '/favicon.ico',
    tag: payload.collapseKey || 'crew31',
    data: payload.data || {},
    vibrate: [200, 100, 200],
  });
});

// 알림 클릭 시 앱 포커스
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('crew31') && 'focus' in client) return client.focus();
      }
      return clients.openWindow('https://5sq224fdw5-eng.github.io/crew31/crew31.html');
    })
  );
});
