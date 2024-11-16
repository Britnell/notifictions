const express = require("express");
const webpush = require("web-push");
const path = require("path");

const PORT = process.env.PORT || 3000;

const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  "mailto:email@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

//  Express

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/app", (req: any, res: any) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/vapid-public-key", (req: any, res: any) => {
  res.json({ publicKey: vapidKeys.publicKey });
});

const subscriptions = new Set();

app.post("/register", (req: any, res: any) => {
  const subscription = req.body;
  subscriptions.add(subscription);
  res.status(201).json({ message: "Registered successfully" });
});

app.post("/unregister", (req: any, res: any) => {
  const subscription = req.body;
  subscriptions.delete(subscription);
  res.status(200).json({ message: "Unregistered successfully" });
});

const errorCodes = [410, 404];
setInterval(() => {
  const notification = JSON.stringify({
    title: "Ping",
    body: `Server ping at ${new Date().toLocaleTimeString()}`,
  });
  console.log(" PING ", notification, " to ", subscriptions.size);

  subscriptions.forEach((subscription) => {
    webpush.sendNotification(subscription, notification).catch((error: any) => {
      console.error("Error sending notification ", error.statusCode);
      if (errorCodes.includes(error.statusCode)) {
        subscriptions.delete(subscription);
      }
    });
  });
}, 10000);

app.post("/ping", (req: any, res: any) => {
  const subscription = req.body;
  res.status(201).json({});

  setTimeout(() => {
    webpush
      .sendNotification(
        subscription,
        JSON.stringify({
          title: "Test Notification",
          body: "This is a test push notification",
        })
      )
      .catch((err: any) => console.error("Error sending notification:", err));
  }, 3000);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
