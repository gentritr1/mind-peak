// src/games/flashcue/hooks/useFlashCueLogic.ts
import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { FLASH_CUE_CONFIG, FlashCueTrialResult } from '@/games/flashcue/constants';

type Side = 'left' | 'right';

export type FlashCueMode = 'flash' | 'noFlash';

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Generates a sequence of cue validity (valid vs invalid)
 * to ensure deterministic valid-cue frequency.
 * 1 = valid, 0 = invalid
 */
function generateTrialSequence(totalTrials: number, probability: number): number[] {
    const numValid = Math.max(1, Math.round(totalTrials * probability));
    const sequence = new Array(totalTrials).fill(0);

    // Fill first N spots with valid cues
    for (let i = 0; i < numValid; i++) {
        sequence[i] = 1;
    }

    return shuffleArray(sequence);
}

export const useFlashCueLogic = (mode: FlashCueMode = 'flash') => {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [trialIndex, setTrialIndex] = useState(0);
    const [trialSequence, setTrialSequence] = useState<number[]>([]);

    const [cueSide, setCueSide] = useState<Side | null>(null);
    const [targetSide, setTargetSide] = useState<Side | null>(null);
    const [isCueVisible, setIsCueVisible] = useState(false);
    const [isTargetVisible, setIsTargetVisible] = useState(false);
    const [results, setResults] = useState<FlashCueTrialResult[]>([]);

    const timersRef = useRef<NodeJS.Timeout[]>([]);
    const targetOnsetTimeRef = useRef<number | null>(null);
    const hasRespondedRef = useRef(false);
    const currentTrialRef = useRef<{
        cueSide: Side;
        targetSide: Side;
        isValidCue: boolean;
    } | null>(null);

    const clearTimers = () => {
        timersRef.current.forEach((t) => clearTimeout(t));
        timersRef.current = [];
    };

    const recordResult = useCallback(
        (responseTime: number | null) => {
            if (!currentTrialRef.current) return;

            const { cueSide: cSide, targetSide: tSide, isValidCue } = currentTrialRef.current;
            const responded = responseTime !== null;
            const isCorrect = responded; // In this task, any timely response to X counts as correct

            const result: FlashCueTrialResult = {
                cueSide: cSide,
                targetSide: tSide,
                isValidCue,
                responded,
                responseTime,
                isCorrect,
            };

            setResults((prev) => [...prev, result]);
        },
        [],
    );

    const startTrial = useCallback(() => {
        if (trialIndex >= FLASH_CUE_CONFIG.TOTAL_TRIALS) {
            setGameState('finished');
            clearTimers();
            return;
        }

        clearTimers();

        if (mode === 'flash') {
            const isValidCue = trialSequence[trialIndex] === 1;
            const trueTargetSide: Side = Math.random() < 0.5 ? 'left' : 'right';
            const cueSideLocal: Side = isValidCue
                ? trueTargetSide
                : trueTargetSide === 'left'
                    ? 'right'
                    : 'left';

            currentTrialRef.current = {
                cueSide: cueSideLocal,
                targetSide: trueTargetSide,
                isValidCue,
            };

            hasRespondedRef.current = false;
            targetOnsetTimeRef.current = null;

            setCueSide(cueSideLocal);
            setTargetSide(null);
            setIsCueVisible(true);
            setIsTargetVisible(false);

            // Hide cue after its duration
            const hideCueTimeout = setTimeout(() => {
                setIsCueVisible(false);
            }, FLASH_CUE_CONFIG.CUE_DURATION);

            // Show target after cue + SOA
            const showTargetTimeout = setTimeout(() => {
                setTargetSide(trueTargetSide);
                setIsTargetVisible(true);
                targetOnsetTimeRef.current = Date.now();
            }, FLASH_CUE_CONFIG.CUE_DURATION + FLASH_CUE_CONFIG.SOA);

            // End of trial: hide target, record miss if needed, advance to next trial
            const endTrialTimeout = setTimeout(() => {
                setIsTargetVisible(false);
                if (!hasRespondedRef.current) {
                    recordResult(null);
                }
                setTrialIndex((prev) => prev + 1);
            }, FLASH_CUE_CONFIG.CUE_DURATION + FLASH_CUE_CONFIG.SOA + FLASH_CUE_CONFIG.RESPONSE_WINDOW);

            timersRef.current.push(hideCueTimeout, showTargetTimeout, endTrialTimeout);
        } else {
            // No-flash baseline: no cue, only target appears after a short delay
            const trueTargetSide: Side = Math.random() < 0.5 ? 'left' : 'right';

            currentTrialRef.current = {
                cueSide: trueTargetSide, // stored for completeness; cue is never shown
                targetSide: trueTargetSide,
                isValidCue: true,
            };

            hasRespondedRef.current = false;
            targetOnsetTimeRef.current = null;

            setCueSide(null);
            setTargetSide(null);
            setIsCueVisible(false);
            setIsTargetVisible(false);

            // Show target after a short foreperiod (reuse SOA as the delay)
            const showTargetTimeout = setTimeout(() => {
                setTargetSide(trueTargetSide);
                setIsTargetVisible(true);
                targetOnsetTimeRef.current = Date.now();
            }, FLASH_CUE_CONFIG.SOA);

            // End of trial: hide target, record miss if needed, advance to next trial
            const endTrialTimeout = setTimeout(() => {
                setIsTargetVisible(false);
                if (!hasRespondedRef.current) {
                    recordResult(null);
                }
                setTrialIndex((prev) => prev + 1);
            }, FLASH_CUE_CONFIG.SOA + FLASH_CUE_CONFIG.RESPONSE_WINDOW);

            timersRef.current.push(showTargetTimeout, endTrialTimeout);
        }
    }, [mode, trialIndex, trialSequence, recordResult]);

    const handlePress = useCallback(() => {
        if (gameState !== 'playing' || hasRespondedRef.current || !targetOnsetTimeRef.current) return;

        const rt = Date.now() - targetOnsetTimeRef.current;
        hasRespondedRef.current = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        recordResult(rt);
    }, [gameState, recordResult]);

    useEffect(() => {
        if (gameState === 'playing' && trialSequence.length > 0) {
            startTrial();
        }

        return () => {
            clearTimers();
        };
    }, [gameState, trialIndex, startTrial, trialSequence]);

    const startGame = () => {
        clearTimers();
        setResults([]);
        setTrialIndex(0);
        setCueSide(null);
        setTargetSide(null);
        setIsCueVisible(false);
        setIsTargetVisible(false);
        if (mode === 'flash') {
            setTrialSequence(
                generateTrialSequence(
                    FLASH_CUE_CONFIG.TOTAL_TRIALS,
                    FLASH_CUE_CONFIG.VALID_CUE_PROBABILITY,
                ),
            );
        } else {
            // For no-flash mode we don't use cue validity, but keep a dummy sequence
            setTrialSequence(new Array(FLASH_CUE_CONFIG.TOTAL_TRIALS).fill(1));
        }
        setGameState('playing');
    };

    return {
        gameState,
        trialIndex,
        cueSide,
        targetSide,
        isCueVisible,
        isTargetVisible,
        results,
        startGame,
        handlePress,
    };
};


