// src/games/flashcue/screens/FlashCueScreen/hooks/useButtonAnimation.ts
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

/**
 * Custom hook for button press animation
 * (duplicated from SART to keep this screen self-contained)
 */
export const useButtonAnimation = () => {
    const buttonScale = useSharedValue(1);

    const onPressIn = () => {
        buttonScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    };

    const onPressOut = () => {
        buttonScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    const buttonAnimStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    return {
        buttonAnimStyle,
        onPressIn,
        onPressOut,
    };
};


