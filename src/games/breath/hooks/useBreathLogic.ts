// src/games/breath/hooks/useBreathLogic.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { BREATH_CONFIG, BreathPhase, BreathPhaseResult } from '@/games/breath/constants';

type GameState = 'idle' | 'playing' | 'finished';

export const useBreathLogic = (cycleCount: number = BREATH_CONFIG.CYCLE_COUNT) => {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [phase, setPhase] = useState<BreathPhase>('inhale');
    const [cycleIndex, setCycleIndex] = useState(0);
    const [phaseElapsed, setPhaseElapsed] = useState(0);
    const [results, setResults] = useState<BreathPhaseResult[]>([]);
    const [lastFeedback, setLastFeedback] = useState<string | null>(null);
    const [isTransition, setIsTransition] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const phaseStartTimeRef = useRef<number | null>(null);
    const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isHoldingRef = useRef(false);
    const holdStartRef = useRef<number | null>(null);
    const hasRecordedPhaseRef = useRef(false);

    const clearIntervalTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const clearTransitionTimeout = () => {
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
            transitionTimeoutRef.current = null;
        }
    };

    const clearAllTimers = () => {
        clearIntervalTimer();
        clearTransitionTimeout();
    };

    const targetDurationForPhase = (p: BreathPhase) =>
        p === 'inhale' ? BREATH_CONFIG.INHALE_DURATION_MS : BREATH_CONFIG.EXHALE_DURATION_MS;

    const startPhase = useCallback(
        (nextPhase: BreathPhase, nextCycleIndex: number) => {
            setIsTransition(false);
            setPhase(nextPhase);
            setCycleIndex(nextCycleIndex);
            setPhaseElapsed(0);
            phaseStartTimeRef.current = Date.now();
            hasRecordedPhaseRef.current = false;

            clearIntervalTimer();
            timerRef.current = setInterval(() => {
                if (!phaseStartTimeRef.current) return;
                const elapsed = Date.now() - phaseStartTimeRef.current;
                const targetDuration = targetDurationForPhase(nextPhase);

                if (elapsed >= targetDuration) {
                    // Cap elapsed at target so countdown hits zero and then softly pauses
                    setPhaseElapsed(targetDuration);
                    clearIntervalTimer();

                    if (nextPhase === 'inhale') {
                        // Soft transition from inhale to exhale
                        setIsTransition(true);
                        transitionTimeoutRef.current = setTimeout(() => {
                            startPhase('exhale', nextCycleIndex);
                        }, BREATH_CONFIG.TRANSITION_DELAY_MS);
                    } else {
                        // Finished an exhale
                        const nextCycle = nextCycleIndex + 1;
                        if (nextCycle >= cycleCount) {
                            setIsTransition(true);
                            transitionTimeoutRef.current = setTimeout(() => {
                                setIsTransition(false);
                                setGameState('finished');
                            }, BREATH_CONFIG.TRANSITION_DELAY_MS);
                        } else {
                            setIsTransition(true);
                            transitionTimeoutRef.current = setTimeout(() => {
                                startPhase('inhale', nextCycle);
                            }, BREATH_CONFIG.TRANSITION_DELAY_MS);
                        }
                    }
                } else {
                    setPhaseElapsed(elapsed);
                }
            }, 50);
        },
        [cycleCount],
    );

    const recordHold = useCallback(
        (phaseCompleted: BreathPhase, duration: number) => {
            const target = targetDurationForPhase(phaseCompleted);
            const delta = duration - target;
            const isOnRhythm = Math.abs(delta) <= BREATH_CONFIG.FEEDBACK_TOLERANCE_MS;

            const result: BreathPhaseResult = {
                phase: phaseCompleted,
                targetDuration: target,
                actualDuration: duration,
                delta,
                isOnRhythm,
            };

            setResults((prev) => [...prev, result]);

            if (isOnRhythm) {
                setLastFeedback(
                    phaseCompleted === 'inhale'
                        ? 'Smooth inhale – right on rhythm.'
                        : 'Steady exhale – right on rhythm.',
                );
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else if (delta < 0) {
                setLastFeedback('A little short – try slowing your breath down.');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            } else {
                setLastFeedback('A little long – try keeping a gentler, lighter breath.');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
        },
        [],
    );

    const startGame = () => {
        clearAllTimers();
        setResults([]);
        setLastFeedback(null);
        setIsTransition(false);
        setGameState('playing');
        startPhase('inhale', 0);
    };

    const stopGame = () => {
        clearAllTimers();
        setGameState('finished');
    };

    const onHoldStart = () => {
        if (gameState !== 'playing' || isHoldingRef.current) return;
        isHoldingRef.current = true;
        holdStartRef.current = Date.now();
    };

    const onHoldEnd = () => {
        if (!isHoldingRef.current || !holdStartRef.current) return;
        const now = Date.now();
        const duration = now - holdStartRef.current;
        isHoldingRef.current = false;
        holdStartRef.current = null;
        if (hasRecordedPhaseRef.current) return;
        hasRecordedPhaseRef.current = true;
        recordHold(phase, duration);
    };

    useEffect(() => {
        return () => {
            clearAllTimers();
        };
    }, []);

    return {
        gameState,
        phase,
        cycleIndex,
        phaseElapsed,
        results,
        lastFeedback,
        isTransition,
        cycleCount,
        startGame,
        stopGame,
        onHoldStart,
        onHoldEnd,
        targetDurationForPhase,
    };
};
