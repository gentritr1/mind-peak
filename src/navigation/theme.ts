// src/navigation/theme.ts
import { Theme } from '@react-navigation/native';

/**
 * Navigation theme configuration matching the app's design system
 */
export const navigationTheme: Theme = {
    dark: true,
    colors: {
        primary: '#0ea5e9',
        background: '#020617',
        card: '#0f172a',
        text: '#f8fafc',
        border: '#1e293b',
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
