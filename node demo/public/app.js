let swRegistration = null;
let pushSubscription = null;


window.addEventListener('load', async () => {
    await registerServiceWorker();
    
    // Check if already subscribed
    const subscription = await swRegistration.pushManager.getSubscription();
    console.log(' load ', subscription);
    
    if (subscription) {
      pushSubscription = subscription;
      document.getElementById('subscribe').disabled = true;
      document.getElementById('unsubscribe').disabled = false;
    }
  });


async function registerServiceWorker() {
    try {
      swRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  
async function subscribeToPush() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }
  
      const response = await fetch('/vapid-public-key');
      const { publicKey } = await response.json();
  
      pushSubscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey
      });
  
      // Send subscription to server
      await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pushSubscription)
      });
  
      // Enable/disable buttons
      document.getElementById('subscribe').disabled = true;
      document.getElementById('unsubscribe').disabled = false;
      
    } catch (error) {
      console.error('Error:', error);
    }
}
  
  async function unsubscribeFromPush() {
    try {
      if (pushSubscription) {
        // Unsubscribe from push service
        await pushSubscription.unsubscribe();
        
        // Notify server
        await fetch('/unregister', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pushSubscription)
        });
  
        pushSubscription = null;
        
        // Enable/disable buttons
        document.getElementById('subscribe').disabled = false;
        document.getElementById('unsubscribe').disabled = true;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
// document.getElementById('subscribe').addEventListener('click', registerServiceWorker);

async function registerPing() {
    try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);

        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            throw new Error('Notification permission denied');
        }

        // Get VAPID public key from server
        const response = await fetch('/vapid-public-key');
        const { publicKey } = await response.json();

        // Subscribe to push service
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicKey
        });

        // Send subscription to server
        await fetch('/ping', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription)
        });

        console.log('Push notification subscription successful');
    } catch (error) {
        console.error('Error:', error);
    }
}