# 4–6 Breath - Metrics & Calculations

This document explains exactly how the **4–6 Breath** game measures timing and computes the metrics you see on the results screen.

## Core Config

Defined in `src/games/breath/constants/index.ts`:

- `INHALE_DURATION_MS = 4000` → target inhale length (4 seconds)
- `EXHALE_DURATION_MS = 6000` → target exhale length (6 seconds)
- `FEEDBACK_TOLERANCE_MS = 1200` → how close you must be to be counted as "on rhythm"
- `TRANSITION_DELAY_MS = 1500` → soft pause between inhale ↔ exhale and between cycles
- `CYCLE_COUNT` is the default number of cycles, but the **actual** cycle count is chosen by the user per session (Beginner 4 / Balanced 8 / Deep 12) and passed into the logic hook as `cycleCount`.

## What Counts as a Phase

The hook `useBreathLogic(cycleCount)` in `src/games/breath/hooks/useBreathLogic.ts` manages state.

- A **phase** is either an `inhale` or `exhale`.
- For each phase:
  - A timer runs for the full target duration (4s or 6s).
  - The user is invited to **press and hold** the bar during that phase.
- We only record **one** measurement per phase:
  - On `onHoldStart` we mark that the user began holding.
  - On `onHoldEnd` we compute `duration = now - holdStartTime`.
  - A guard `hasRecordedPhaseRef` ensures that **only the first complete hold** in that phase is recorded, so multiple taps in one phase do not create extra entries.

Each recorded phase becomes a `BreathPhaseResult`:

- `phase`: `'inhale' | 'exhale'`
- `targetDuration`: 4000 or 6000 ms
- `actualDuration`: how long the user held (ms)
- `delta`: `actualDuration - targetDuration`
- `isOnRhythm`: `true` if `|delta| ≤ FEEDBACK_TOLERANCE_MS`

These results are stored in an array `results` in the hook.

## When a Session Ends

- The hook cycles through `inhale → exhale → inhale → ...` using `cycleCount` as the maximum number of cycles.
- Each time an **exhale** completes, `cycleIndex` is incremented.
- When `cycleIndex >= cycleCount`, the hook:
  - Enters a final transition,
  - Then sets `gameState = 'finished'`.

Even if the user keeps interacting, no further phases are started after this point.

## Metrics on the Results Screen

In `src/games/breath/screens/BreathScreen/index.tsx`, when `gameState === 'finished'`, we derive:

- `totalPhases` → `results.length`
- `exhaledPhases` → `results.filter(r => r.phase === 'exhale').length`
- `onRhythmCount` → `results.filter(r => r.isOnRhythm).length`
- `onRhythmPct`:
  - If `totalPhases > 0`: `Math.round(onRhythmCount / totalPhases * 100)`
  - Else: `0`
- `avgDelta` (average timing error, in ms):
  - If `totalPhases > 0`:
    - `sum = results.reduce((sum, r) => sum + Math.abs(r.delta), 0)`
    - `avgDelta = Math.round(sum / totalPhases)`
  - Else: `0`
- `cyclesCompleted`:
  - Computed as `Math.min(cycleCount, exhaledPhases)`
  - We use **exhale phases** as the marker that a full cycle (inhale + exhale) has been completed.
  - The `min` ensures the UI never shows more cycles completed than were scheduled.

### Summary Cards Shown

On the finished screen, you see:

1. **Cycles completed**: `cyclesCompleted / cycleCount`
2. **On‑rhythm phases**: `onRhythmCount / totalPhases` and `onRhythmPct%`
3. **Avg timing offset**: `avgDelta ms` (average absolute difference from the 4–6 rhythm)

With this reference, you can cross‑check the values at any time by inspecting the `results` array and recomputing the same formulas.


