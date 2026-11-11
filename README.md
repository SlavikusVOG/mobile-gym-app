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

## Use on a phone without Android Studio

On the same Wi-Fi as your computer:

```bash
npx ng serve --host 0.0.0.0 --port 8100
```

Open `http://YOUR_PC_IP:8100` in the phone browser. In Chrome you can **Add to Home screen**. This is a web shortcut, not a full native install (haptics and similar native features are limited).

## Project layout

- `src/app/data/` — fixed exercise catalog
- `src/app/services/workout.service.ts` — sets, persistence, streak
- `src/app/pages/today/` — today's 400-rep progress
- `src/app/pages/workout/` — set-of-10 logging
- `src/app/pages/history/` — streak and completed days
- `android/` — Capacitor Android project
