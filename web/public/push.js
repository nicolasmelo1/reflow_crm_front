// Check this for explanation on how push notifications work: https://web-push-book.gauntface.com/

function receivePushNotification(event) {
    console.log("[Service Worker] Push Received.");
    
    // url is not actually the url, it is just a placeholder we define what to open inside of here.
    const { image, tag, url, title, text, actions } = event.data.json();
    
    const imageUrl = image ? image : self.location.origin+'/pwa/images/icons/icon-512x512.png'
    console.log('imageUrl')
    console.log(imageUrl)
    const options = {
        data: url,
        body: text,
        icon: imageUrl,
        vibrate: [200, 100, 200],
        tag: tag,
        image: imageUrl,
        badge: self.location.origin + '/favicon.ico',
        actions: [actions]
    };
    event.waitUntil(self.registration.showNotification(title, options));
}
  
function openPushNotification(event) {
    console.log("[Service Worker] Notification click Received.", event.notification.data);

    // if we recieve a full url we open the window the backend wants us to open
    if (event.notification.data.includes('https://') || event.notification.data.includes('http://')) {
        event.waitUntil(clients.openWindow(event.notification.data))
    } else {
        // handles the open of the url for different types
        // The backend doesn't need to be aware of any url of the front end, this needs to be handled here.
        if (event.notification.data.toString() === 'notification') {
            event.waitUntil(clients.openWindow(self.location.origin + '/notifications'));
        }
    }
    event.notification.close();
}
  
self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);
