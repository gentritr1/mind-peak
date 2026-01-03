// src/games/flashcue/screens/FlashCueScreen/views/IdleView.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ViewStyle } from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import {
    Brain,
    Play,
    ArrowLeft,
    Sparkles,
    Eye,
    Zap,
    Timer,
} from 'lucide-react-native';
import { moderateScale } from '@/utils/responsive';
import { THEME } from '@/games/flashcue/constants';
import { styles } from '../styles';
import { InstructionStep } from '../components';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type Variant = 'flash' | 'noFlash';

interface IdleViewProps {
    variant: Variant;
    onBack: () => void;
    onStart: () => void;
    buttonAnimStyle: ViewStyle;
    onPressIn: () => void;
    onPressOut: () => void;
}

export const IdleView: React.FC<IdleViewProps> = ({
    variant,
    onBack,
    onStart,
    buttonAnimStyle,
    onPressIn,
    onPressOut,
}) => {
    return (
        <View style={styles.idleContainer}>
            {/* Static Back Header pinned to top */}
            <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.screenHeader}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={moderateScale(18)} color={THEME.textMuted} />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </Animated.View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.idleContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Animated.View
                    entering={FadeInDown.delay(150).duration(400).springify()}
                    style={styles.header}
                >
                    <View style={styles.iconContainer}>
                        <View style={styles.iconGlow} />
                        <Brain size={moderateScale(36)} color={THEME.accent} />
                    </View>
                    <Text style={styles.title}>
                        {variant === 'flash' ? 'Flash Cue Task' : 'X Detection Task'}
                    </Text>
                    <View style={styles.subtitleBadge}>
                        <Sparkles size={moderateScale(12)} color={THEME.accent} />
                        <Text style={styles.subtitle}>
                            {variant === 'flash' ? 'Covert Attention' : 'Baseline (No Flash)'}
                        </Text>
                    </View>
                </Animated.View>

                {/* Quote Card */}
                <Animated.View
                    entering={FadeInDown.delay(250).duration(400).springify()}
                    style={styles.quoteCard}
                >
                    <View style={styles.quoteIconContainer}>
                        <Text style={styles.quoteIcon}>"</Text>
                    </View>
                    {variant === 'flash' ? (
                        <Text style={styles.quoteText}>
                            Keep your eyes softly resting on the plus sign in the center of the screen,
                            while your attention jumps to the left and right. Your only job is to respond
                            as soon as a big <Text style={styles.highlight}>X</Text> appears—no matter
                            where it shows up.
                        </Text>
                    ) : (
                        <Text style={styles.quoteText}>
                            Keep your eyes on the plus sign in the center of the screen. There&apos;s no
                            warning flash—just respond as soon as a big{' '}
                            <Text style={styles.highlight}>X</Text> appears on either side.
                        </Text>
                    )}
                    <View style={styles.quoteAuthorContainer}>
                        <View style={styles.authorDivider} />
                        <Text style={styles.quoteAuthor}>Inspired by Peak Mind, Amishi P. Jha</Text>
                    </View>
                </Animated.View>

                {/* Instructions */}
                <Animated.View
                    entering={FadeInDown.delay(350).duration(400).springify()}
                    style={styles.instructions}
                >
                    <InstructionStep
                        color={THEME.accent}
                        delay={400}
                        icon={<Eye size={moderateScale(14)} color="white" />}
                    >
                        <Text style={styles.instructionText}>
                            Keep your gaze on the{' '}
                            <Text style={styles.highlightAccent}>center plus sign (+)</Text> the
                            entire time.
                        </Text>
                    </InstructionStep>

                    {variant === 'flash' ? (
                        <>
                            <InstructionStep
                                color={THEME.success}
                                delay={450}
                                icon={<Zap size={moderateScale(14)} color="white" />}
                            >
                                <Text style={styles.instructionText}>
                                    Sometimes a brief flash will appear on the left or right.{' '}
                                    <Text style={styles.highlight}>Ignore it</Text>—it&apos;s just a cue.
                                </Text>
                            </InstructionStep>

                            <InstructionStep
                                color={THEME.warning}
                                delay={500}
                                icon={<Timer size={moderateScale(14)} color="white" />}
                            >
                                <Text style={styles.instructionText}>
                                    <Text style={styles.highlightAccent}>Tap anywhere</Text> as soon as you
                                    see a big <Text style={styles.highlight}>X</Text> on either side. The
                                    faster and more consistent your responses, the better.
                                </Text>
                            </InstructionStep>
                        </>
                    ) : (
                        <InstructionStep
                            color={THEME.warning}
                            delay={450}
                            icon={<Timer size={moderateScale(14)} color="white" />}
                        >
                            <Text style={styles.instructionText}>
                                There is <Text style={styles.highlightAccent}>no warning flash</Text>. Just{' '}
                                <Text style={styles.highlightAccent}>tap anywhere</Text> as soon as you see
                                a big <Text style={styles.highlight}>X</Text> on either side.
                            </Text>
                        </InstructionStep>
                    )}
                </Animated.View>

                {/* Start Button */}
                <Animated.View entering={FadeInUp.delay(550).duration(400).springify()}>
                    <AnimatedTouchable
                        onPress={onStart}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        style={[styles.startButton, buttonAnimStyle]}
                        activeOpacity={1}
                    >
                        <View style={styles.startButtonInner}>
                            <Play size={moderateScale(22)} color="white" fill="white" />
                            <Text style={styles.startButtonText}>Begin Session</Text>
                        </View>
                    </AnimatedTouchable>
                </Animated.View>
            </ScrollView>
        </View>
    );
};


