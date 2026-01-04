# Peak Mind - Attention Training App

A minimalist, high-performance mobile application designed for attention training, based on the principles outlined in **"Peak Mind" by Dr. Amishi Jha**.

## 🧠 The Mission

This app aims to provide scientifically accurate tools to train the three primary subsystems of attention:
1.  **The Flashlight (Orienting)**: Directing attention to specific stimuli.
2.  **The Floodlight (Alerting)**: Maintaining a state of readiness.
3.  **The Juggler (Executive Control)**: Managing competing demands and inhibiting automatic responses.

## 🕹️ Available Games

### Sustained Attention to Response Task (SART)
The core training task featured in *Peak Mind*. 
- **The Protocol**: Digits 1-9 flicker on the screen. Press for every digit **except 3**.
- **The Science**: Tapping for everything else creates a "prepotent" (automatic) response habit. Withholding the tap for '3' requires intense executive control and continuous "floodlight" awareness.
- **Accurate Implementation**: Uses the classic Robertson (1997) timings (250ms stimulus / 900ms mask) and a deterministic "shuffled deck" to ensure fair trial distribution.

## 🛠️ Architecture & Extensibility

The project is designed with modularity in mind, making it easy to add new scientifically validated tasks (like the Stroop Task or Flanker Task).

- **`src/games/`**: Future home for modular game packages.
- **`src/utils/responsive.ts`**: custom scaling utility that ensures the UI is premium and readable on any device size.
- **`src/hooks/`**: Shared logic for timers, results, and haptics.

## 🚀 Technical Stack

- **Framework**: Expo / React Native (TypeScript)
- **Styling**: Standard `StyleSheet` with a custom Responsive UI engine.
- **Animations**: `react-native-reanimated` for 60fps flicker and transitions.
- **Feedback**: `expo-haptics` for tactile engagement.

## 🔐 Auth & Backend Setup

- **Backend URL**
  - For a **simulator** on the same machine as Laravel, you can use `http://127.0.0.1:8000`.
  - For a **physical device** (Expo Go / standalone build), use your Mac's LAN IP, e.g. `http://192.168.0.27:8000`.
  - On macOS you can get this with:

```bash
ipconfig getifaddr en0
```

- **Mobile app `.env`**
  - Create or edit `.env` in the app root:

```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.27:8000
```

  - Expo inlines any `EXPO_PUBLIC_...` vars, so you must **restart Expo** after changing this (`npx expo start`).

- **Laravel dev server**
  - Run the API so it listens on all interfaces:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

  - From your phone's browser you should be able to open `http://192.168.0.27:8000/api/register` and see a "GET not allowed, POST only" JSON/HTML page. That confirms connectivity.

- **Daily workflow**
  - **Step 1**: Start Laravel (`php artisan serve --host=0.0.0.0 --port=8000`).
  - **Step 2**: Start Expo (`npx expo start` in this repo).
  - **Step 3**: Open the app on your device (same Wi‑Fi as the backend).
  - As long as your LAN IP does not change, no additional configuration is required.

## ✅ Auth UX & Validation

- **Guest mode**
  - The app can be fully used as a guest; creating an account is optional.
  - The Home screen's "Account" card lets you sign in / register or sign out back to guest mode.

- **Auth screen**
  - Single `AuthScreen` with three tabs: **Log in**, **Register**, and **Reset** (forgot‑password flow).
  - Active tab title is reflected in the header (e.g. **Create your account**, **Forgot password**).
  - Tabs use a pill control with an animated accent highlight that slides between tabs for clear state feedback.
  - Password fields include an inline **eye / eye‑off** icon to toggle visibility, centered inside the input for a clean look.

- **Client‑side validation before API calls**
  - **Email**: basic format check (must look like `name@example.com`) is performed before hitting `register`, `login`, or `forgot-password`.
  - **Register password**: must be **at least 12 characters** before the app will send a request.
  - **Confirm password**: must match the password field or the request will not be sent.
  - These checks avoid obviously invalid requests and mirror the Laravel validation rules; the backend remains the source of truth and may still return `422` for deeper validation.

## 🎨 Theme & Colors

- **Centralized palette**
  - All core colors live in `src/theme/colors.ts` as a `COLORS` object (background, surfaces, accent, text, muted text, danger/success, banner backgrounds).
  - `navigationTheme`, `HomeScreen`, and `AuthScreen` all consume `COLORS`, so updating the palette in one place updates the whole app.
- **Consistency**
  - Error/success banners, tab background, and account cards share the same surface and border colors for a cohesive dark theme.
  - When tweaking the visual style, prefer changing `COLORS` rather than hard‑coding hex values in components.

---
*Note: This app is intended for training and educational purposes, inspired by the neuropsychological research presented in Peak Mind.*
