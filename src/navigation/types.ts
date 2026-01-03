// src/navigation/types.ts

/**
 * Navigation type definitions for type-safe routing
 */
export type RootStackParamList = {
    Home: undefined;
    Sart: undefined;
    FlashCue: undefined;
    FlashCueNoFlash: undefined;
    Breath: undefined;
    // Add future game screens here:
    // Stroop: undefined;
    // Flanker: undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
