// Check this for explanation on how push notifications work: https://web-push-book.gauntface.com/

function receivePushNotification(event) {
    console.log("[Service Worker] Push Received.");
  
    const { image, tag, url, title, text, actions } = event.data.json();
  
    const options = {
        data: url,
        body: text,
        icon: image,
        vibrate: [200, 100, 200],
        tag: tag,
        image: image,
        badge: "https://s3.us-east-2.amazonaws.com/reflow-crm/staticfiles/icons/favicon.ico",
        actions: [actions]
    };
    event.waitUntil(self.registration.showNotification(title, options));
}
  
function openPushNotification(event) {
    console.log("[Service Worker] Notification click Received.", event.notification.data);
    
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data));
}
  
self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);
