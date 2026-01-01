// src/games/sart/screens/SartScreen/views/FinishedView.tsx
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
    Target,
    Shield,
    Zap,
    Trophy,
} from 'lucide-react-native';
import { moderateScale } from '@/utils/responsive';
import { THEME, SART_CONFIG, TrialResult } from '@/games/sart/constants';
import { styles } from '../styles';
import { ResultCard } from '../components';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface FinishedViewProps {
    results: TrialResult[];
    onRetry: () => void;
    onBack: () => void;
    buttonAnimStyle: ViewStyle;
    onPressIn: () => void;
    onPressOut: () => void;
}

/**
 * Calculate performance metrics from trial results
 */
const calculateMetrics = (results: TrialResult[]) => {
    const totalGo = results.filter(r => r.digit !== SART_CONFIG.NO_GO_DIGIT).length;
    const correctGo = results.filter(r => r.digit !== SART_CONFIG.NO_GO_DIGIT && r.pressed).length;
    const totalNoGo = results.filter(r => r.digit === SART_CONFIG.NO_GO_DIGIT).length;
    const correctNoGo = results.filter(r => r.digit === SART_CONFIG.NO_GO_DIGIT && !r.pressed).length;

    const goAccuracy = Math.round((correctGo / totalGo) * 100) || 0;
    const noGoAccuracy = Math.round((correctNoGo / totalNoGo) * 100) || 0;

    const validRTs = results
        .filter(r => r.digit !== SART_CONFIG.NO_GO_DIGIT && r.pressed && r.responseTime !== null)
        .map(r => r.responseTime as number);
    const avgRT = validRTs.length > 0
        ? Math.round(validRTs.reduce((a, b) => a + b, 0) / validRTs.length)
        : 0;

    return { goAccuracy, noGoAccuracy, avgRT };
};

/**
 * Get performance level based on overall score
 */
const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: THEME.success };
    if (score >= 75) return { label: 'Good', color: THEME.accent };
    if (score >= 60) return { label: 'Average', color: THEME.warning };
    return { label: 'Keep Practicing', color: THEME.error };
};

export const FinishedView: React.FC<FinishedViewProps> = ({
    results,
    onRetry,
    onBack,
    buttonAnimStyle,
    onPressIn,
    onPressOut,
}) => {
    const { goAccuracy, noGoAccuracy, avgRT } = calculateMetrics(results);
    const overallScore = Math.round((goAccuracy + noGoAccuracy) / 2);
    const performance = getPerformanceLevel(overallScore);

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
                            label="Response Accuracy"
                            sublabel="Correct taps on Go trials"
                            value={`${goAccuracy}%`}
                            icon={<Target size={moderateScale(22)} color={THEME.success} />}
                            iconBg={THEME.success + '20'}
                        />
                    </Animated.View>

                    <Animated.View entering={SlideInRight.delay(350).duration(350).springify()}>
                        <ResultCard
                            label="Inhibition Control"
                            sublabel="Successfully withheld on 3"
                            value={`${noGoAccuracy}%`}
                            icon={<Shield size={moderateScale(22)} color={THEME.accent} />}
                            iconBg={THEME.accent + '20'}
                        />
                    </Animated.View>

                    <Animated.View entering={SlideInRight.delay(450).duration(350).springify()}>
                        <ResultCard
                            label="Reaction Speed"
                            sublabel="Average response time"
                            value={`${avgRT}ms`}
                            icon={<Zap size={moderateScale(22)} color={THEME.warning} />}
                            iconBg={THEME.warning + '20'}
                        />
                    </Animated.View>
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
