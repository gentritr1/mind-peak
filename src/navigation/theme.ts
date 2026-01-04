// src/navigation/theme.ts
import { Theme } from '@react-navigation/native';
import { COLORS } from '@/theme/colors';

/**
 * Navigation theme configuration matching the app's design system
 */
export const navigationTheme: Theme = {
    dark: true,
    colors: {
        primary: COLORS.accent,
        background: COLORS.bg,
        card: COLORS.surface,
        text: COLORS.text,
        border: COLORS.surfaceLight,
        notification: '#f43f5e',
    },
    fonts: {
        regular: {
            fontFamily: 'System',
            fontWeight: '400',
        },
        medium: {
            fontFamily: 'System',
            fontWeight: '500',
        },
        bold: {
            fontFamily: 'System',
            fontWeight: '700',
        },
        heavy: {
            fontFamily: 'System',
            fontWeight: '900',
        },
    },
};
