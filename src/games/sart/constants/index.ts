// src/games/sart/constants/index.ts

/**
 * Official SART Protocol (Robertson et al., 1997)
 * Typically 225 trials, lasting approx 4.3 minutes.
 */
const OFFICIAL_CONFIG = {
    VISIBLE_DURATION: 250, // ms
    INTERVAL_DURATION: 1150, // total cycle duration in ms (250ms stim + 900ms mask)
    TARGET_PROBABILITY: 0.111, // ~1/9 chance
    TOTAL_TRIALS: 225,
    NO_GO_DIGIT: 3,
};

/**
 * Short config for rapid testing and development.
 */
const TEST_CONFIG = {
    VISIBLE_DURATION: 250,
    INTERVAL_DURATION: 1150,
    TARGET_PROBABILITY: 0.111,
    TOTAL_TRIALS: 20,
    NO_GO_DIGIT: 3,
};

// Toggle this to switch between test and official modes
export const SART_CONFIG = TEST_CONFIG;

export type TrialResult = {
    digit: number;
    pressed: boolean;
    responseTime: number | null; // null if no press
    isCorrect: boolean;
};

/**
 * Theme constants for consistent styling across the SART game
 */
export const THEME = {
    // Backgrounds
    bg: '#020617',
    surface: '#0f172a',
    surfaceLight: '#1e293b',
    surfaceGlow: '#0f172a99',

    // Accent colors
    accent: '#0ea5e9',
    accentLight: '#38bdf8',
    accentDark: '#0284c7',

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
    gradientAccent: ['#0ea5e9', '#6366f1'] as const,
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
