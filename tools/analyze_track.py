#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

import librosa
import numpy as np


def analyze_track(path: Path, track_id: str, label: str, description: str):
    # Load mono, 22.05kHz to keep it light
    y, sr = librosa.load(path.as_posix(), sr=22050, mono=True)

    # Estimate tempo and beat frames
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr, trim=True)
    beat_times = librosa.frames_to_time(beat_frames, sr=sr)  # seconds

    # Durations between beats (seconds)
    if len(beat_times) >= 2:
        intervals = np.diff(beat_times)
        median_interval = float(np.median(intervals))
        pulses = [float(d) for d in intervals]
    else:
        median_interval = 1.0
        pulses = []

    # Convert to ms for our config
    pulse_duration_ms = int(median_interval * 1000)

    return {
        "id": track_id,
        "label": label,
        "description": description,
        "file": path.name,
        "bpm": float(tempo),
        "pulseDurationMs": pulse_duration_ms,
        "pulsesMs": [int(p * 1000) for p in pulses[:256]],  # cap for size
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("audio_path", type=str)
    parser.add_argument("--id", required=True)
    parser.add_argument("--label", required=True)
    parser.add_argument("--description", default="")
    parser.add_argument("--out", type=str, required=True)
    args = parser.parse_args()

    audio_path = Path(args.audio_path)
    out_path = Path(args.out)

    meta = analyze_track(audio_path, args.id, args.label, args.description)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w") as f:
        json.dump(meta, f, indent=2)

    print(f"Wrote metadata to {out_path}")
    print(json.dumps(meta, indent=2))


if __name__ == "__main__":
    main()