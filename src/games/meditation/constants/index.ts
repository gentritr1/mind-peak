// src/games/meditation/constants/index.ts

export const MEDITATION_CONFIG = {
    DEFAULT_DURATION_MINUTES: 10,
    MIN_DURATION_MINUTES: 3,
    MAX_DURATION_MINUTES: 60,
};

export type DistractionCategory = 'emotion' | 'sensation' | 'thought';

export type DistractionEvent = {
    id: string;
    category: DistractionCategory;
    timestampMs: number; // since session start
    note?: string;
};

export const THEME = {
    bg: '#020617',
    surface: '#020617',
    surfaceSoft: '#020617',
    accent: '#6366f1',
    accentSoft: '#6366f133',
    accentMuted: '#4f46e5',
    text: '#f9fafb',
    textMuted: '#9ca3af',
};


