
# Web Notifications API

I wanted to try out notifications, as basic as possible.
also wanted a lil hourly chimer on my laptop / notifications for a pomodoro timer - perfect!

## Node demo

first i made a basic test w express server and vanilla js

## Deno-ex

stacks

- deno 
- oak web server
I'd like the webserver part to be something i can easily run in bg on my laptop, so i thought of deno which lets you compile a .exe really easily. Plus a good excuse to use deno.

- npm : web-push
On the frontend I wanted to use native api for notifications, but on backend I was happy to use a package. 
`web-push` is an exceedlingly simple pckg for web based push notifications for desktop browsers. need to see if this can do ios too

- client : push notifications
this is combined use of a service worker to receive notifications while page is closed, and notification api for the notifications themselves. also a pwa 

- ui : alpine.js
For UI I love alpine + i was too lazy to setup anything. I still want this to be as vanilla as possible

