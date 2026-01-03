// src/games/breath/screens/BreathScreen/index.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ArrowLeft, Wind } from 'lucide-react-native';
import { moderateScale } from '@/utils/responsive';
import { useBreathLogic } from '@/games/breath/hooks/useBreathLogic';
import { styles } from './styles';
import { THEME } from '@/games/breath/constants';

interface BreathScreenProps {
    onBack: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const BreathScreen: React.FC<BreathScreenProps> = ({ onBack }) => {
    const [selectedCycles, setSelectedCycles] = React.useState(8);

    const {
        gameState,
        phase,
        cycleIndex,
        phaseElapsed,
        results,
        lastFeedback,
        startGame,
        onHoldStart,
        onHoldEnd,
        targetDurationForPhase,
        isTransition,
        cycleCount,
    } = useBreathLogic(selectedCycles);

    const circleScale = useSharedValue(1);
    const barProgress = useSharedValue(0);

    React.useEffect(() => {
        const target = targetDurationForPhase(phase);
        const progress = Math.min(1, phaseElapsed / target);
        const minScale = phase === 'inhale' ? 0.85 : 0.95;
        const maxScale = phase === 'inhale' ? 1.12 : 0.88;
        circleScale.value = withTiming(minScale + (maxScale - minScale) * progress, { duration: 120 });
        barProgress.value = withTiming(progress, { duration: 120 });
    }, [phaseElapsed, phase, targetDurationForPhase]);

    const circleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: circleScale.value }],
    }));

    const barFillStyle = useAnimatedStyle(() => ({
        width: `${barProgress.value * 100}%`,
    }));

    if (gameState === 'idle') {
        return (
            <View style={styles.container}>
                <View style={styles.headerWrapper}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <ArrowLeft size={moderateScale(18)} color={THEME.textMuted} />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.idleContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>4–6 Breath</Text>
                    <Text style={styles.subtitle}>4 seconds in, 6 seconds out</Text>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>How it works</Text>
                        <Text style={styles.cardText}>
                            Breathe in through your nose for 4 seconds, then breathe out gently through your
                            mouth for 6 seconds. Follow the expanding and contracting circle to stay on rhythm.
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Your part</Text>
                        <Text style={styles.cardText}>
                            Press and hold the bar while you inhale, then release and press again while you exhale.
                            We&apos;ll let you know when your breath is matching the 4–6 timing.
                        </Text>
                    </View>

                    <View style={styles.difficultyRow}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.difficultyChip,
                                selectedCycles === 4 && styles.difficultyChipActive,
                            ]}
                            onPress={() => setSelectedCycles(4)}
                        >
                            <Text style={styles.difficultyChipLabel}>Beginner</Text>
                            <Text style={styles.difficultyChipSub}>4 cycles</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.difficultyChip,
                                selectedCycles === 8 && styles.difficultyChipActive,
                            ]}
                            onPress={() => setSelectedCycles(8)}
                        >
                            <Text style={styles.difficultyChipLabel}>Balanced</Text>
                            <Text style={styles.difficultyChipSub}>8 cycles</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.difficultyChip,
                                selectedCycles === 12 && styles.difficultyChipActive,
                            ]}
                            onPress={() => setSelectedCycles(12)}
                        >
                            <Text style={styles.difficultyChipLabel}>Deep</Text>
                            <Text style={styles.difficultyChipSub}>12 cycles</Text>
                        </TouchableOpacity>
                    </View>

                    <AnimatedTouchable style={styles.startButton} onPress={startGame} activeOpacity={0.8}>
                        <Text style={styles.startButtonText}>Begin Breathing</Text>
                    </AnimatedTouchable>
                </ScrollView>
            </View>
        );
    }

    if (gameState === 'finished') {
        const totalPhases = results.length;
        const inhaledPhases = results.filter((r) => r.phase === 'inhale').length;
        const exhaledPhases = results.filter((r) => r.phase === 'exhale').length;
        const onRhythmCount = results.filter((r) => r.isOnRhythm).length;
        const onRhythmPct = totalPhases > 0 ? Math.round((onRhythmCount / totalPhases) * 100) : 0;
        const avgDelta =
            totalPhases > 0
                ? Math.round(
                      results.reduce((sum, r) => sum + Math.abs(r.delta), 0) / totalPhases,
                  )
                : 0;

        const cyclesCompleted = Math.min(cycleCount, exhaledPhases);

        return (
            <View style={styles.container}>
                <View style={styles.headerWrapper}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <ArrowLeft size={moderateScale(18)} color={THEME.textMuted} />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.finishedContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.finishedTitle}>Session Complete</Text>
                    <Text style={styles.finishedSubtitle}>Here&apos;s how your breath matched the timer</Text>

                    <View style={styles.card}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Cycles completed</Text>
                            <Text style={styles.summaryValue}>
                                {cyclesCompleted} / {cycleCount}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>On-rhythm phases</Text>
                            <Text style={styles.summaryValue}>
                                {onRhythmCount} / {totalPhases} ({onRhythmPct}%)
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Avg timing offset</Text>
                            <Text style={styles.summaryValue}>{avgDelta} ms</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.finishedButton} onPress={startGame} activeOpacity={0.8}>
                        <Text style={styles.finishedButtonText}>Breathe Again</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // playing
    const target = targetDurationForPhase(phase);
    const remainingMs = Math.max(0, target - phaseElapsed);
    const remainingSec = Math.ceil(remainingMs / 1000);

    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={moderateScale(18)} color={THEME.textMuted} />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.playingWrapper}>
                <Text style={styles.phaseLabel}>
                    Cycle {cycleIndex + 1} of {cycleCount}
                </Text>
                <Text style={styles.phaseTitle}>
                    {isTransition
                        ? phase === 'inhale'
                            ? 'Softly pause… get ready to exhale'
                            : 'Softly pause… get ready to inhale'
                        : phase === 'inhale'
                            ? 'Inhale for 4 seconds'
                            : 'Exhale for 6 seconds'}
                </Text>

                <Animated.View style={[styles.breathCircleOuter, circleStyle]}>
                    <View style={styles.breathCircleInner}>
                        <Wind size={moderateScale(28)} color={THEME.accent} />
                        <Text style={styles.timerText}>
                            {isTransition ? '· · ·' : remainingSec}
                        </Text>
                        <Text style={styles.timerSubText}>
                            {isTransition ? 'next phase' : 'seconds'}
                        </Text>
                    </View>
                </Animated.View>

                <Pressable
                    onPressIn={onHoldStart}
                    onPressOut={onHoldEnd}
                    style={({ pressed }) => [
                        styles.holdButton,
                        pressed && styles.holdButtonActive,
                    ]}
                >
                    <Animated.View style={[styles.holdButtonFill, barFillStyle]} />
                    <View style={styles.holdButtonContent}>
                        <Text style={styles.holdButtonText}>
                            {phase === 'inhale'
                                ? 'Press and hold while you inhale'
                                : 'Press and hold while you exhale'}
                        </Text>
                    </View>
                </Pressable>

                <Text style={styles.helperText}>
                    Try to match the length of your inhale and exhale to the on-screen timer.
                </Text>

                {lastFeedback && (
                    <View style={styles.feedbackBadge}>
                        <Text style={styles.feedbackText}>{lastFeedback}</Text>
                    </View>
                )}

                <Text style={styles.cycleText}>Release the bar between breaths whenever you need.</Text>
            </View>
        </View>
    );
};


