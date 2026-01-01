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

---
*Note: This app is intended for training and educational purposes, inspired by the neuropsychological research presented in Peak Mind.*
