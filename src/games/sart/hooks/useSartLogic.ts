import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { SART_CONFIG, TrialResult } from '@/games/sart/constants';

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
 * Generates a sequence of trial types (Go vs No-Go)
 * to ensure deterministic target frequency.
 * 0 = Go, 1 = No-Go
 */
function generateTrialSequence(totalTrials: number, probability: number): number[] {
    const numNoGo = Math.max(1, Math.round(totalTrials * probability));
    const sequence = new Array(totalTrials).fill(0);

    // Fill first N spots with No-Go
    for (let i = 0; i < numNoGo; i++) {
        sequence[i] = 1;
    }

    return shuffleArray(sequence);
}

export const useSartLogic = () => {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [currentDigit, setCurrentDigit] = useState<number | null>(null);
    const [trialCount, setTrialCount] = useState(0);
    const [results, setResults] = useState<TrialResult[]>([]);
    const [isDigitVisible, setIsDigitVisible] = useState(false);
    const [trialSequence, setTrialSequence] = useState<number[]>([]);

    const trialStartTimeRef = useRef<number | null>(null);
    const hasPressedInCurrentTrialRef = useRef(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTrial = useCallback(() => {
        if (trialCount >= SART_CONFIG.TOTAL_TRIALS) {
            setGameState('finished');
            return;
        }

        // Determine if this is a No-Go trial from our pre-shuffled sequence
        const isNoGoTrial = trialSequence[trialCount] === 1;

        let digit;
        if (isNoGoTrial) {
            digit = SART_CONFIG.NO_GO_DIGIT;
        } else {
            const others = [1, 2, 4, 5, 6, 7, 8, 9];
            digit = others[Math.floor(Math.random() * others.length)];
        }

        setCurrentDigit(digit);
        setIsDigitVisible(true);
        hasPressedInCurrentTrialRef.current = false;
        trialStartTimeRef.current = Date.now();

        // Set timeout to hide digit after 500ms
        setTimeout(() => {
            setIsDigitVisible(false);
        }, SART_CONFIG.VISIBLE_DURATION);

        // Set timeout for next trial after 1000ms
        timerRef.current = setTimeout(() => {
            // Record result if not pressed
            if (!hasPressedInCurrentTrialRef.current) {
                recordResult(null);
            }
            setTrialCount(prev => prev + 1);
        }, SART_CONFIG.INTERVAL_DURATION);
    }, [trialCount, trialSequence]);

    const recordResult = useCallback((responseTime: number | null) => {
        if (!currentDigit) return;

        const pressed = responseTime !== null;
        const isNoGo = currentDigit === SART_CONFIG.NO_GO_DIGIT;

        let isCorrect = false;
        if (isNoGo) {
            isCorrect = !pressed; // Correct if didn't press on 3
        } else {
            isCorrect = pressed; // Correct if pressed on non-3
        }

        const result: TrialResult = {
            digit: currentDigit,
            pressed,
            responseTime,
            isCorrect,
        };

        setResults(prev => [...prev, result]);
    }, [currentDigit]);

    const handlePress = useCallback(() => {
        if (gameState !== 'playing' || hasPressedInCurrentTrialRef.current || !trialStartTimeRef.current) return;

        const rt = Date.now() - trialStartTimeRef.current;
        hasPressedInCurrentTrialRef.current = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        recordResult(rt);
    }, [gameState, recordResult]);

    useEffect(() => {
        if (gameState === 'playing' && trialSequence.length > 0) {
            startTrial();
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [gameState, trialCount, startTrial, trialSequence]);

    const startGame = () => {
        setResults([]);
        setTrialCount(0);
        // Generate a fresh sequence for the new game
        setTrialSequence(generateTrialSequence(SART_CONFIG.TOTAL_TRIALS, SART_CONFIG.TARGET_PROBABILITY));
        setGameState('playing');
    };

    return {
        gameState,
        currentDigit,
        isDigitVisible,
        startGame,
        handlePress,
        results,
        trialCount,
    };
};
