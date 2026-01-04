// src/games/meditation/hooks/useMeditationTimer.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { DistractionCategory, DistractionEvent } from '@/games/meditation/constants';

type TimerState = 'idle' | 'running' | 'paused' | 'finished';

export const useMeditationTimer = () => {
    const [state, setState] = useState<TimerState>('idle');
    const [targetDurationMs, setTargetDurationMs] = useState(0);
    const [elapsedMs, setElapsedMs] = useState(0);
    const [events, setEvents] = useState<DistractionEvent[]>([]);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const clearTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const beginInterval = useCallback(
        (durationMs: number) => {
            clearTimer();
            const startedAt = Date.now() - elapsedMs;
            startTimeRef.current = startedAt;
            timerRef.current = setInterval(() => {
                if (!startTimeRef.current) return;
                const elapsed = Date.now() - startTimeRef.current;
                setElapsedMs(elapsed);
                if (elapsed >= durationMs) {
                    clearTimer();
                    setState('finished');
                }
            }, 250);
        },
        [elapsedMs],
    );

    const start = useCallback(
        (durationMs: number) => {
            clearTimer();
            setTargetDurationMs(durationMs);
            setElapsedMs(0);
            setEvents([]);
            setState('running');
            beginInterval(durationMs);
        },
        [beginInterval],
    );

    const pause = () => {
        if (state !== 'running') return;
        clearTimer();
        setState('paused');
    };

    const resume = () => {
        if (state !== 'paused' || !targetDurationMs) return;
        setState('running');
        beginInterval(targetDurationMs);
    };

    const stop = () => {
        clearTimer();
        setState('finished');
    };

    const reset = () => {
        clearTimer();
        setState('idle');
        setElapsedMs(0);
        setEvents([]);
        setTargetDurationMs(0);
    };

    const labelDistraction = (category: DistractionCategory, note?: string) => {
        if ((state !== 'running' && state !== 'paused')) return;
        const timestampMs = elapsedMs;
        const event: DistractionEvent = {
            id: `${Date.now()}-${category}-${events.length}`,
            category,
            timestampMs,
            note,
        };
        setEvents((prev) => [...prev, event]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    useEffect(() => {
        return () => {
            clearTimer();
        };
    }, []);

    return {
        state,
        targetDurationMs,
        elapsedMs,
        events,
        start,
        pause,
        resume,
        stop,
        reset,
        labelDistraction,
    };
};


