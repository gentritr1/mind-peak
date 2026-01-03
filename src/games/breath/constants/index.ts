// src/games/breath/constants/index.ts

export const BREATH_CONFIG = {
    INHALE_DURATION_MS: 4000,
    EXHALE_DURATION_MS: 6000,
    CYCLE_COUNT: 8,
    FEEDBACK_TOLERANCE_MS: 1200,
    TRANSITION_DELAY_MS: 1500,
};

export type BreathPhase = 'inhale' | 'exhale';

export type BreathPhaseResult = {
    phase: BreathPhase;
    targetDuration: number;
    actualDuration: number;
    delta: number;
    isOnRhythm: boolean;
};

export const THEME = {
    bg: '#020617',
    surface: '#020617',
    surfaceLight: '#1e293b',
    accent: '#22c55e',
    accentSoft: '#22c55e33',
    accentMuted: '#16a34a',
    text: '#f8fafc',
    textMuted: '#94a3b8',
};


