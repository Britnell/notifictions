import { Application, Router } from "jsr:@oak/oak";
import webpush from "npm:web-push";

const router = new Router();
const app = new Application();

const vapidKeys = webpush.generateVAPIDKeys();
const email = Deno.env.get("VAPID_EMAIL");

webpush.setVapidDetails(
  `mailto:${email}`,
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

router.get("/vapid", (ctx) => {
  ctx.response.body = JSON.stringify({ publicKey: vapidKeys.publicKey });
  ctx.response.headers.set("Content-Type", "application/json");
});

const subscriptions = new Set();

router.post("/chime/reg", async (ctx) => {
  const subscription = await ctx.request.body.json();
  subscriptions.add(subscription);
  ctx.response.body = "welcome";
  ctx.response.status = 201;
});

router.post("/chime/unreg", async (ctx) => {
  const subscription = await ctx.request.body.json();
  subscriptions.delete(subscription);
  ctx.response.body = "bye";
  ctx.response.status = 201;
});

app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/static`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

// Chimes

const errorCodes = [410, 404];

setInterval(() => {
  const ping = JSON.stringify({
    title: "Chime",
    body: `Server ping at ${new Date().toLocaleTimeString()}`,
  });
  console.log(ping);
  subscriptions.forEach((subscription) => {
    console.log(" sub : ", subscription);

    webpush.sendNotification(subscription, ping).catch((error: any) => {
      console.error("Error sending notification ", error.statusCode);
      if (errorCodes.includes(error.statusCode)) {
        subscriptions.delete(subscription);
      }
    });
  });
}, 60 * 1000);

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:3000");
app.listen({ port: 3000 });
