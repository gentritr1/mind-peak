// src/games/flashcue/screens/FlashCueScreen/views/PlayingView.tsx
import * as React from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { X as CloseIcon } from 'lucide-react-native';
import { FLASH_CUE_CONFIG, THEME } from '@/games/flashcue/constants';
import { styles } from '../styles';
import { moderateScale } from '@/utils/responsive';

type Side = 'left' | 'right';
type Variant = 'flash' | 'noFlash';

interface PlayingViewProps {
    variant: Variant;
    trialIndex: number;
    cueSide: Side | null;
    targetSide: Side | null;
    isCueVisible: boolean;
    isTargetVisible: boolean;
    onPress: () => void;
    onExit?: () => void;
}

export const PlayingView: React.FC<PlayingViewProps> = ({
    variant,
    trialIndex,
    cueSide,
    targetSide,
    isCueVisible,
    isTargetVisible,
    onPress,
    onExit,
}) => {
    const progress = trialIndex / FLASH_CUE_CONFIG.TOTAL_TRIALS;

    const isCueOnSide = (side: Side) => isCueVisible && cueSide === side;
    const isTargetOnSide = (side: Side) => isTargetVisible && targetSide === side;

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
                        <CloseIcon size={moderateScale(20)} color="#475569" />
                    </TouchableOpacity>
                )}

                {/* Progress Bar in Header */}
                <View style={styles.headerProgressContainer}>
                    <View style={styles.progressTrack}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                { width: `${progress * 100}%` },
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {trialIndex} / {FLASH_CUE_CONFIG.TOTAL_TRIALS}
                    </Text>
                </View>
            </View>

            {/* Main Tap Area */}
            <Pressable
                onPressIn={onPress}
                style={styles.playingContainer}
            >
                <View style={styles.fixationRow}>
                    {/* Left peripheral area */}
                    <View
                        style={[
                            styles.peripheralBox,
                            isCueOnSide('left') && styles.peripheralCueActive,
                        ]}
                    >
                        {isTargetOnSide('left') && (
                            <Text style={styles.peripheralX}>X</Text>
                        )}
                    </View>

                    {/* Central fixation cross */}
                    <Text style={styles.fixationPlus}>+</Text>

                    {/* Right peripheral area */}
                    <View
                        style={[
                            styles.peripheralBox,
                            isCueOnSide('right') && styles.peripheralCueActive,
                        ]}
                    >
                        {isTargetOnSide('right') && (
                            <Text style={styles.peripheralX}>X</Text>
                        )}
                    </View>
                </View>

                <View style={styles.playingFooter}>
                    <View style={styles.footerPulse} />
                    <Text style={styles.footerText}>
                        Keep your eyes on the + and tap as soon as you see an X
                    </Text>
                    {variant === 'flash' ? (
                        <Text style={[styles.footerText, { color: THEME.textMuted, marginTop: 4 }]}>
                            Ignore the brief flash – it&apos;s just a cue.
                        </Text>
                    ) : (
                        <Text style={[styles.footerText, { color: THEME.textMuted, marginTop: 4 }]}>
                            There is no flash – just respond as soon as the X appears.
                        </Text>
                    )}
                </View>
            </Pressable>
        </View>
    );
};


