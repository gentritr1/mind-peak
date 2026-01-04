# Backend spec – Peak Mind (Meditation & Training Logs)

This document describes the **data structures** your Laravel backend should expect from the current React Native app.  
You can use it to design migrations, Eloquent models, and API resources. We can iterate and extend it as the app grows.

## 1. Core concepts

The app is built around **users** doing different **activities** (games / practices) and generating **sessions** with summary metrics and fine‑grained events.

Current activities:

- `sart` – Sustained Attention to Response Task (digits, go / no‑go).
- `flash_cue` – Covert attention task with valid/invalid cues.
- `flash_cue_noflash` – X detection baseline without cues.
- `breath_4_6` – 4s inhale / 6s exhale breathing session.
- `meditation_timer` – open‑ended meditation timer with distraction labels.

### 1.1 User

**Table: `users`**

- `id` (bigint, PK)
- `email` (string, unique, nullable if using anonymous accounts)
- `password` (hashed, nullable if social login)
- `name` (string, nullable)
- `avatar_url` (string, nullable)
- `timezone` (string, e.g. `Europe/Berlin`)
- `created_at`, `updated_at`

**Table: `user_preferences`**

Per‑user configurable defaults:

- `id` (bigint, PK)
- `user_id` (FK -> users)
- `default_breath_cycles` (int, e.g. 4 / 8 / 12)
- `default_meditation_minutes` (int, e.g. 10)
- `theme` (enum: `system`, `dark`, `light`)
- `notifications_enabled` (bool)
- `created_at`, `updated_at`

### 1.2 Activity Session (generic)

**Table: `activity_sessions`**

Common fields for all activities:

- `id` (bigint, PK)
- `user_id` (FK -> users)
- `activity_type` (enum: `sart`, `flash_cue`, `flash_cue_noflash`, `breath_4_6`, `meditation_timer`)
- `started_at` (datetime with timezone)
- `ended_at` (datetime with timezone)
- `duration_ms` (bigint)
- `client_version` (string, nullable)
- `device_info` (json, e.g. OS, model)
- `meta` (json, optional – for future flags/settings)
- `created_at`, `updated_at`

Each concrete activity stores its own summary in a dedicated table keyed by `activity_session_id`.

## 2. Activity‑specific payloads & tables

### 2.1 SART (`activity_type = "sart"`)

**Session summary (table: `sart_sessions`)**

- `id` (bigint, PK)
- `activity_session_id` (FK -> activity_sessions)
- `total_trials` (int)
- `go_trials` (int)
- `no_go_trials` (int)
- `go_correct` (int)
- `no_go_correct` (int)
- `avg_reaction_ms` (int) – across correct go trials
- `config` (json) – e.g. `{ "visible_duration_ms": 250, "interval_ms": 1150, "no_go_digit": 3, "target_probability": 0.111 }`

**Per‑trial (optional, table: `sart_trials`)**

- `id` (bigint, PK)
- `sart_session_id` (FK -> sart_sessions)
- `index` (int, 0‑based)
- `digit` (tinyint)
- `is_no_go` (bool)
- `pressed` (bool)
- `response_time_ms` (int, nullable)
- `is_correct` (bool)

**Example POST payload (frontend → backend)**

```json
{
  "activity_type": "sart",
  "started_at": "2025-01-05T20:10:00Z",
  "ended_at": "2025-01-05T20:14:20Z",
  "duration_ms": 260000,
  "summary": {
    "total_trials": 225,
    "go_trials": 200,
    "no_go_trials": 25,
    "go_correct": 180,
    "no_go_correct": 20,
    "avg_reaction_ms": 420,
    "config": {
      "visible_duration_ms": 250,
      "interval_ms": 1150,
      "no_go_digit": 3,
      "target_probability": 0.111
    }
  },
  "trials": [
    { "index": 0, "digit": 7, "is_no_go": false, "pressed": true, "response_time_ms": 390, "is_correct": true }
    // ...
  ]
}
```

### 2.2 Flash Cue & X Detection (`flash_cue`, `flash_cue_noflash`)

Logic is shared; `flash_cue_noflash` is simply the same code with `mode="noFlash"` (no cue shown).

**Session summary (table: `flash_cue_sessions`)**

- `id` (bigint, PK)
- `activity_session_id` (FK)
- `mode` (enum: `flash`, `noFlash`)
- `total_trials` (int)
- `hit_rate_pct` (int) – % of trials where user responded within window
- `valid_rt_ms` (int) – avg response time when cue correctly predicted target side (only in `flash` mode)
- `invalid_rt_ms` (int, nullable) – avg RT when cue misled
- `config` (json) – `{ "cue_duration_ms": 100, "soa_ms": 150, "response_window_ms": 900, "valid_prob": 0.8 }`

**Per‑trial (optional, table: `flash_cue_trials`)**

- `id` (bigint, PK)
- `flash_cue_session_id` (FK)
- `index` (int)
- `cue_side` (enum: `left`, `right`, `none`)
- `target_side` (enum: `left`, `right`)
- `is_valid_cue` (bool, nullable for no‑flash mode)
- `responded` (bool)
- `response_time_ms` (int, nullable)

**Example summary payload**

```json
{
  "activity_type": "flash_cue",
  "started_at": "2025-01-05T21:00:00Z",
  "ended_at": "2025-01-05T21:04:00Z",
  "duration_ms": 240000,
  "summary": {
    "mode": "flash",
    "total_trials": 60,
    "hit_rate_pct": 82,
    "valid_rt_ms": 380,
    "invalid_rt_ms": 460,
    "config": {
      "cue_duration_ms": 100,
      "soa_ms": 150,
      "response_window_ms": 900,
      "valid_prob": 0.8
    }
  }
}
```

### 2.3 4–6 Breath (`breath_4_6`)

**Session summary (table: `breath_sessions`)**

- `id` (bigint, PK)
- `activity_session_id` (FK)
- `inhale_ms` (int, e.g. 4000)
- `exhale_ms` (int, e.g. 6000)
- `target_cycles` (int)
- `completed_cycles` (int) – based on completed exhale phases
- `on_rhythm_phases` (int)
- `total_phases` (int)
- `avg_offset_ms` (int) – avg absolute |actual − target|

**Per‑phase (optional, table: `breath_phases`)**

- `id` (bigint, PK)
- `breath_session_id` (FK)
- `index` (int)
- `phase` (enum: `inhale`, `exhale`)
- `target_duration_ms` (int)
- `actual_duration_ms` (int)
- `delta_ms` (int)
- `is_on_rhythm` (bool)

**Example summary payload**

```json
{
  "activity_type": "breath_4_6",
  "started_at": "2025-01-05T18:00:00Z",
  "ended_at": "2025-01-05T18:07:30Z",
  "duration_ms": 450000,
  "summary": {
    "inhale_ms": 4000,
    "exhale_ms": 6000,
    "target_cycles": 8,
    "completed_cycles": 7,
    "on_rhythm_phases": 10,
    "total_phases": 16,
    "avg_offset_ms": 900
  }
}
```

### 2.4 Meditation Timer (`meditation_timer`)

The meditation timer is an open‑ended countdown with **distraction labels**.

**Session summary (table: `meditation_sessions`)**

- `id` (bigint, PK)
- `activity_session_id` (FK)
- `target_duration_ms` (int)
- `completed_duration_ms` (int)
- `emotion_count` (int)
- `sensation_count` (int)
- `thought_count` (int)

**Distraction events (table: `meditation_distraction_events`)**

- `id` (bigint, PK)
- `meditation_session_id` (FK)
- `category` (enum: `emotion`, `sensation`, `thought`)
- `timestamp_ms` (int) – ms from session start when user labeled it
- `note` (text, nullable) – optional free‑text label user entered

**Example payload**

```json
{
  "activity_type": "meditation_timer",
  "started_at": "2025-01-05T19:30:00Z",
  "ended_at": "2025-01-05T19:42:10Z",
  "duration_ms": 730000,
  "summary": {
    "target_duration_ms": 600000,
    "completed_duration_ms": 730000,
    "emotion_count": 4,
    "sensation_count": 3,
    "thought_count": 6
  },
  "events": [
    {
      "category": "thought",
      "timestamp_ms": 45230,
      "note": "Thinking about email"
    },
    {
      "category": "sensation",
      "timestamp_ms": 128000,
      "note": "Tingling in left foot"
    }
  ]
}
```

## 3. API sketch (for Laravel)

For a first backend version you can expose:

- `POST /api/sessions` – create a new `activity_sessions` row and the specific sub‑record(s) based on `activity_type`.
- `GET /api/sessions?activity_type=&from=&to=` – list past sessions for a user.
- `GET /api/summary/weekly` – returns a computed summary across the last 7 days, e.g.:

```json
{
  "week_start": "2025-01-01",
  "week_end": "2025-01-07",
  "totals": {
    "meditation_minutes": 120,
    "breath_cycles": 64,
    "sart_sessions": 3,
    "flash_cue_sessions": 2
  },
  "distractions": {
    "emotion": 14,
    "sensation": 9,
    "thought": 21
  }
}
```

Later we can extend this spec (e.g. add streaks, more detailed stats, or recommendations). For now this README gives you enough structure to start defining Laravel migrations and Eloquent models, and the example payloads show exactly what the mobile app should `POST` when a session ends. Paste this back when you’re ready and we can turn it into concrete migrations, models, and controllers.


