// src/games/flashcue/constants/index.ts

/**
 * Config for the Flash Cue Task (covert spatial attention)
 */
const OFFICIAL_CONFIG = {
    // How long the cue flash is visible (ms)
    CUE_DURATION: 100,
    // Delay between cue offset and target onset (ms)
    SOA: 150,
    // How long the target is on screen and responses are accepted (ms)
    RESPONSE_WINDOW: 900,
    // Total number of trials in a full session
    TOTAL_TRIALS: 60,
    // Probability that the cue correctly predicts the target side
    VALID_CUE_PROBABILITY: 0.8,
};

/**
 * Short config for rapid testing and development.
 */
const TEST_CONFIG = {
    CUE_DURATION: 100,
    SOA: 150,
    RESPONSE_WINDOW: 900,
    TOTAL_TRIALS: 24,
    VALID_CUE_PROBABILITY: 0.8,
};

// Toggle this to switch between test and official modes
export const FLASH_CUE_CONFIG = TEST_CONFIG;

export type FlashCueTrialResult = {
    cueSide: 'left' | 'right';
    targetSide: 'left' | 'right';
    isValidCue: boolean;
    responded: boolean;
    responseTime: number | null; // null if no response
    isCorrect: boolean;
};

/**
 * Theme constants for consistent styling across the Flash Cue game
 * (kept visually in-family with SART, but with a distinct accent color)
 */
export const THEME = {
    // Backgrounds
    bg: '#020617',
    surface: '#0f172a',
    surfaceLight: '#1e293b',
    surfaceGlow: '#0f172a99',

    // Accent colors (purple/indigo feel)
    accent: '#8b5cf6',
    accentLight: '#a855f7',
    accentDark: '#7c3aed',

    // Text colors
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textDim: '#64748b',

    // Semantic colors
    error: '#f43f5e',
    errorLight: '#fb7185',
    success: '#10b981',
    successLight: '#34d399',
    warning: '#f59e0b',

    // Gradients (as array pairs for LinearGradient)
    gradientAccent: ['#8b5cf6', '#6366f1'] as const,
    gradientSuccess: ['#10b981', '#059669'] as const,
    gradientError: ['#f43f5e', '#e11d48'] as const,
};

/**
 * Animation timing constants
 */
export const ANIMATION = {
    fast: 150,
    normal: 250,
    slow: 400,
    spring: {
        damping: 15,
        stiffness: 120,
    },
};


