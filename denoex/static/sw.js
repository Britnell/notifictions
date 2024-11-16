
self.addEventListener('push', function(event) {
    const data = event.data.json();
    
    const options = {
        body: data.body,
        icon: '/icon.png',
        badge: '/icon.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', async (event)=>{
    console.log(' close clik');
    event.notification.close();
    event.waitUntil(()=>{    
        clients.openWindow('/');
    })
});

// const windowClients = await clients.matchAll({
//     type: 'window',
//     includeUncontrolled: true
// });
// if (windowClients.length > 0) windowClients[0].focus();