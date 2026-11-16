# Daily 100

A phone-first gym app for one daily workout:

- 100 squats
- 100 push-ups
- 100 side knee raises
- 100 cross-knee raises

Each exercise is **10 sets of 10**. Tap **Set done** after each set of 10; **Undo last set** reverses a tap. Progress is stored on the device (no account). Completing all 400 reps marks the day done and counts toward a streak.

Built with Ionic Angular and Capacitor. App ID: `com.mobilegym.app`.

## Prerequisites

- Node.js 22+
- npm

For a native Android install:

- [Android Studio](https://developer.android.com/studio)
- A phone with **Developer options** and **USB debugging** enabled (tap **Build number** 7 times under **Settings → About phone**)

iOS builds need a Mac and Xcode. This repo currently includes the Android project only.

## Run in the browser

```bash
npm install
npx ng serve --host 127.0.0.1 --port 8100
```

Open [http://127.0.0.1:8100/](http://127.0.0.1:8100/).

## Install on Android

1. Connect the phone with USB and accept the debugging prompt.
2. From the project folder:

```bash
npm install
npx ng build
npx cap sync android
npx cap open android
```

3. In Android Studio, select your phone and click **Run**.

That installs **Daily 100** on the device. After code changes, run `npx ng build` and `npx cap sync android` again, then Run.

If the phone does not appear, try another cable or check `adb devices`.

## Install as a PWA (Chrome)

Chrome’s **Install** button on Android asks Google to mint a real APK (WebAPK). That only works from a **stable public HTTPS site**. A LAN IP or a `*.trycloudflare.com` tunnel almost always shows **This app cannot be installed**.

**What works from a tunnel or LAN right now**

1. Open Daily 100 in Chrome.
2. Wait a couple of seconds, then **reload** the tab (the service worker must control the page).
3. Chrome menu → **Install and create shortcut** → **Create shortcut**.

That puts Daily 100 on the home screen. It still opens through Chrome.

A true standalone **Install** needs the app hosted on a public domain (Vercel, Netlify, Firebase, etc.), or a native Android build with Android Studio (see above).

## Project layout

- `src/app/data/` — fixed exercise catalog
- `src/app/services/workout.service.ts` — sets, persistence, streak
- `src/app/pages/today/` — today's 400-rep progress
- `src/app/pages/workout/` — set-of-10 logging
- `src/app/pages/history/` — streak and completed days
- `android/` — Capacitor Android project
