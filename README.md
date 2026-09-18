# iZone — GPS Xavfsiz Zona Monitoring Tizimi

A frontend-only (no backend) GPS safety-monitoring demo dashboard, built for
a live presentation. GPS location is simulated manually from the map; the
Blynk Cloud connection is real, so this app can actually drive an
ESP32 + SIM800L setup to place a real phone call and send a real SMS when a
simulated device exits a safe zone (V0 = 1).

## Stack

React + TypeScript + Vite + Tailwind CSS v4 + React Leaflet + Lucide React.
No backend, no server. All state lives in `localStorage`.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build a production bundle:

```bash
npm run build
npm run preview
```

## Configure Blynk

1. Go to **Sozlamalar → Blynk**.
2. Enter your Blynk server (default `https://blynk.cloud`), Template ID (`TMPL4KVCqWp-b`), Template Name (`safetrack`), device auth token (`rM6RkddaE8V9CY-4Qe1zPv7iCvYnpcr4`), and virtual pin (`V0`).
3. Click **Ulanishni tekshirish** to verify the connection.

## Demo flow (under a minute)

1. Click **Prezentatsiya rejimi** (optional, hides the sidebar and enlarges the map).
2. Click **Qurilma joylashuvini belgilash**, then click on the map to place the simulated GPS-01 device (Default: Nukus IT Park).
3. Click **Xavfsiz zona**, then click two opposite corners on the map to draw a green safe perimeter rectangle.
4. Move the device (repeat step 2) outside the safe perimeter rectangle, or use the **Zonadan chiqishni test qilish** button.
5. Watch the danger alert appear, the `Blynk V0` value flip to `1` (sent to Blynk Cloud API), and the call/SMS trigger status update. Your ESP32 + SIM800L hardware receives `V0 = 1` and places the phone call + sends SMS.
6. Everything is logged in **Hodisalar / Wakiyalar** (event history).
