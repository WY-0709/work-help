// Service Worker - 支持后台通知与 PWA 安装
const CACHE_NAME = "workbench-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

// 接收主线程消息，发送系统通知
self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "notify") {
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      icon: "assets/greet-banner.jpg",
      badge: "assets/greet-banner.jpg",
      tag: e.data.tag || "reminder",
      requireInteraction: true,
      renotify: true,
      silent: false,
    });
  }
});

// 点击通知时聚焦或打开页面
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});
