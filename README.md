# SafeTrack — GPS xavfsizlik monitoring tizimi

A frontend-only (no backend) GPS safety-monitoring demo dashboard, built for
a live presentation. GPS location is simulated manually from the map; the
Blynk Cloud connection is real, so this app can actually drive an
ESP32 + SIM800L setup to place a real phone call and send a real SMS when a
simulated device enters a danger zone.

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

1. Go to **Sozlamalar / Sazlamalar → Blynk**.
2. Enter your Blynk server (default `https://blynk.cloud`), your device
   auth token, and the virtual pin your ESP32 listens on (default `V0`).
3. Click **Ulanishni tekshirish** to verify the connection.

The token is stored in the browser's `localStorage` only, for demo purposes.
See the in-app warning on the Settings page — a real production system
should keep the token on a backend, not in browser-visible code.

## Demo flow (under a minute)

1. Click **Prezentatsiya rejimi** (optional, hides the sidebar and enlarges
   the map for a presentation).
2. Click **Qurilma joylashuvini belgilash**, then click anywhere on the map
   to place the simulated GPS-01 device.
3. Click **Xavfli zona**, then click two opposite corners on the map to draw
   a red rectangle danger zone, and name it.
4. Move the device (repeat step 2) into the rectangle, or use the
   **Xavfni test qilish** button in the Demo Control panel.
5. Watch the danger alert appear, the `Blynk V0` value flip to `1` (sent
   to the real Blynk Cloud API), and the call/SMS trigger status update.
   Your ESP32 + SIM800L hardware receives the `V0 = 1` event and performs
   the real phone call and SMS.
6. Everything is logged in **Hodisalar / Wakiyalar** (event history).

## Notes

- GPS is entirely simulated/manual — there is no real GPS hardware
  connection in this build.
- The rectangle geofence only fires once per entry (edge-triggered), not
  repeatedly while the device stays inside a zone.
- Two languages are supported throughout the UI: O'zbekcha (UZ) and
  Qoraqalpoqsha (QQ), switchable from the header and stored in
  `localStorage`.
# safetrack
