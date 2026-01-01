// src/games/sart/screens/SartScreen/views/PlayingView.tsx
import * as React from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { NumberDisplay } from '@/games/sart/components/NumberDisplay';
import { SART_CONFIG } from '@/games/sart/constants';
import { styles } from '../styles';
import { moderateScale } from '@/utils/responsive';

interface PlayingViewProps {
    trialCount: number;
    currentDigit: number | null;
    isDigitVisible: boolean;
    onPress: () => void;
    onExit?: () => void;
}

export const PlayingView: React.FC<PlayingViewProps> = ({
    trialCount,
    currentDigit,
    isDigitVisible,
    onPress,
    onExit,
}) => {
    const progress = trialCount / SART_CONFIG.TOTAL_TRIALS;

    return (
        <View style={styles.playingWrapper}>
            {/* Static Header */}
            <View style={styles.playingHeader}>
                {onExit && (
                    <TouchableOpacity
                        onPress={onExit}
                        style={styles.exitButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <X size={moderateScale(20)} color="#475569" />
                    </TouchableOpacity>
                )}

                {/* Progress Bar in Header */}
                <View style={styles.headerProgressContainer}>
                    <View style={styles.progressTrack}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                { width: `${progress * 100}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {trialCount} / {SART_CONFIG.TOTAL_TRIALS}
                    </Text>
                </View>
            </View>

            {/* Main Tap Area */}
            <Pressable
                onPressIn={onPress}
                style={styles.playingContainer}
            >
                <NumberDisplay digit={currentDigit} isVisible={isDigitVisible} />

                <View style={styles.playingFooter}>
                    <View style={styles.footerPulse} />
                    <Text style={styles.footerText}>
                        Tap for any number except 3
                    </Text>
                </View>
            </Pressable>
        </View>
    );
};
