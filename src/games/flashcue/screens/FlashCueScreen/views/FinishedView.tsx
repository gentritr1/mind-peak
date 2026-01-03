// src/games/flashcue/screens/FlashCueScreen/views/FinishedView.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ViewStyle } from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    SlideInRight,
} from 'react-native-reanimated';
import {
    RotateCcw,
    ArrowLeft,
    Zap,
    Eye,
    Trophy,
} from 'lucide-react-native';
import { moderateScale } from '@/utils/responsive';
import { THEME, FLASH_CUE_CONFIG, FlashCueTrialResult } from '@/games/flashcue/constants';
import { styles } from '../styles';
import { ResultCard } from '../components';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type Variant = 'flash' | 'noFlash';

interface FinishedViewProps {
    variant: Variant;
    results: FlashCueTrialResult[];
    onRetry: () => void;
    onBack: () => void;
    buttonAnimStyle: ViewStyle;
    onPressIn: () => void;
    onPressOut: () => void;
}

/**
 * Calculate performance metrics from trial results
 */
const calculateMetrics = (results: FlashCueTrialResult[]) => {
    const totalTrials = results.length || FLASH_CUE_CONFIG.TOTAL_TRIALS;
    const hits = results.filter((r) => r.responded && r.responseTime !== null).length;
    const hitRate = Math.round((hits / totalTrials) * 100) || 0;

    const validTrials = results.filter((r) => r.isValidCue && r.responseTime !== null && r.responded);
    const invalidTrials = results.filter(
        (r) => !r.isValidCue && r.responseTime !== null && r.responded,
    );

    const avg = (arr: number[]) =>
        arr.length > 0
            ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
            : 0;

    const validRT = avg(validTrials.map((r) => r.responseTime as number));
    const invalidRT = avg(invalidTrials.map((r) => r.responseTime as number));

    const allRT = avg(
        results
            .filter((r) => r.responded && r.responseTime !== null)
            .map((r) => r.responseTime as number),
    );

    return { hitRate, validRT, invalidRT, allRT };
};

/**
 * Get performance level based on hit rate
 */
const getPerformanceLevel = (hitRate: number) => {
    if (hitRate >= 90) return { label: 'Sharply Tuned', color: THEME.success };
    if (hitRate >= 75) return { label: 'Well Focused', color: THEME.accent };
    if (hitRate >= 60) return { label: 'Warming Up', color: THEME.warning };
    return { label: 'Keep Training', color: THEME.error };
};

export const FinishedView: React.FC<FinishedViewProps> = ({
    variant,
    results,
    onRetry,
    onBack,
    buttonAnimStyle,
    onPressIn,
    onPressOut,
}) => {
    const { hitRate, validRT, invalidRT, allRT } = calculateMetrics(results);
    const performance = getPerformanceLevel(hitRate);

    return (
        <View style={styles.finishedContainer}>
            {/* Static Back Header pinned to top */}
            <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.screenHeader}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={moderateScale(18)} color={THEME.textMuted} />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </Animated.View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.finishedContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header with Trophy */}
                <Animated.View
                    entering={FadeInDown.delay(150).duration(400).springify()}
                    style={styles.finishedHeader}
                >
                    <View style={[styles.trophyContainer, { borderColor: performance.color + '40' }]}>
                        <Trophy size={moderateScale(32)} color={performance.color} />
                    </View>
                    <Text style={styles.finishedSubtitle}>Session Complete</Text>
                    <Text style={styles.finishedTitle}>Your Results</Text>
                    <View style={[styles.performanceBadge, { backgroundColor: performance.color + '20' }]}>
                        <Text style={[styles.performanceText, { color: performance.color }]}>
                            {performance.label}
                        </Text>
                    </View>
                </Animated.View>

                {/* Results Cards */}
                <View style={styles.resultsList}>
                    <Animated.View entering={SlideInRight.delay(250).duration(350).springify()}>
                        <ResultCard
                            label="Hit Rate"
                            sublabel="Responses to X on either side"
                            value={`${hitRate}%`}
                            icon={<Eye size={moderateScale(22)} color={THEME.success} />}
                            iconBg={THEME.success + '20'}
                        />
                    </Animated.View>

                    {variant === 'flash' ? (
                        <>
                            <Animated.View entering={SlideInRight.delay(350).duration(350).springify()}>
                                <ResultCard
                                    label="Valid Cue Speed"
                                    sublabel="Average RT when the flash predicted the X"
                                    value={`${validRT}ms`}
                                    icon={<Zap size={moderateScale(22)} color={THEME.accent} />}
                                    iconBg={THEME.accent + '20'}
                                />
                            </Animated.View>

                            <Animated.View entering={SlideInRight.delay(450).duration(350).springify()}>
                                <ResultCard
                                    label="Invalid Cue Speed"
                                    sublabel="Average RT when the flash misled you"
                                    value={`${invalidRT}ms`}
                                    icon={<Zap size={moderateScale(22)} color={THEME.warning} />}
                                    iconBg={THEME.warning + '20'}
                                />
                            </Animated.View>
                        </>
                    ) : (
                        <Animated.View entering={SlideInRight.delay(350).duration(350).springify()}>
                            <ResultCard
                                label="Reaction Speed"
                                sublabel="Average RT across all X targets"
                                value={`${allRT}ms`}
                                icon={<Zap size={moderateScale(22)} color={THEME.accent} />}
                                iconBg={THEME.accent + '20'}
                            />
                        </Animated.View>
                    )}
                </View>

                {/* Action Buttons */}
                <Animated.View
                    entering={FadeInUp.delay(550).duration(400).springify()}
                    style={styles.actionButtons}
                >
                    <AnimatedTouchable
                        onPress={onRetry}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        style={[styles.retryButton, buttonAnimStyle]}
                        activeOpacity={1}
                    >
                        <RotateCcw size={moderateScale(20)} color={THEME.bg} />
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </AnimatedTouchable>

                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.homeButton}
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={moderateScale(18)} color={THEME.textMuted} />
                        <Text style={styles.homeButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </View>
    );
};


