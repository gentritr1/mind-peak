// src/games/sart/components/NumberDisplay.tsx
import * as React from 'react';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming,
    useSharedValue,
} from 'react-native-reanimated';
import { moderateScale, verticalScale, scale } from '@/utils/responsive';
import { THEME } from '@/games/sart/constants';

interface NumberDisplayProps {
    digit: number | null;
    isVisible: boolean;
}

// Animation constants
const SPRING_CONFIG = {
    damping: 15,
    stiffness: 120,
};

/**
 * NumberDisplay component for SART task
 * 
 * IMPORTANT: Per the original SART protocol (Robertson et al., 1997),
 * ALL digits must appear identically. The "3" (no-go target) should NOT
 * be visually distinguished - the challenge is remembering to withhold,
 * not reacting to a visual cue.
 */
export const NumberDisplay: React.FC<NumberDisplayProps> = ({ digit, isVisible }) => {
    const opacity = useSharedValue(0);
    const scaleValue = useSharedValue(0.85);
    const glowOpacity = useSharedValue(0);

    useEffect(() => {
        if (isVisible) {
            opacity.value = withTiming(1, { duration: 60 });
            scaleValue.value = withSpring(1, SPRING_CONFIG);
            glowOpacity.value = withTiming(0.15, { duration: 100 });
        } else {
            opacity.value = withTiming(0, { duration: 80 });
            scaleValue.value = withTiming(0.85, { duration: 100 });
            glowOpacity.value = withTiming(0, { duration: 80 });
        }
    }, [isVisible]);

    const containerAnimStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scaleValue.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    return (
        <View style={styles.container}>
            {/* Subtle background glow - same for ALL digits */}
            <Animated.View
                style={[styles.glowCircle, glowStyle]}
            />

            {/* Main digit display - identical appearance for all digits */}
            <Animated.View style={containerAnimStyle}>
                <Animated.Text style={styles.digitText}>
                    {digit ?? ''}
                </Animated.Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: verticalScale(280),
        position: 'relative',
    },
    glowCircle: {
        position: 'absolute',
        width: scale(200),
        height: scale(200),
        borderRadius: scale(100),
        backgroundColor: THEME.accent, // Same color for ALL digits
    },
    digitText: {
        color: THEME.text, // Same color for ALL digits - no red for "3"
        fontSize: moderateScale(140),
        fontWeight: '200',
        fontFamily: 'System',
        textAlign: 'center',
        includeFontPadding: false,
        lineHeight: moderateScale(160),
    },
});
