// src/games/sart/screens/SartScreen/views/IdleView.tsx
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
    CheckCircle2,
    Shield,
    Timer,
} from 'lucide-react-native';
import { moderateScale } from '@/utils/responsive';
import { THEME } from '@/games/sart/constants';
import { styles } from '../styles';
import { InstructionStep } from '../components';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface IdleViewProps {
    onBack: () => void;
    onStart: () => void;
    buttonAnimStyle: ViewStyle;
    onPressIn: () => void;
    onPressOut: () => void;
}

export const IdleView: React.FC<IdleViewProps> = ({
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
                <Text style={styles.title}>SART Task</Text>
                <View style={styles.subtitleBadge}>
                    <Sparkles size={moderateScale(12)} color={THEME.accent} />
                    <Text style={styles.subtitle}>Sustained Attention</Text>
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
                <Text style={styles.quoteText}>
                    Press the space bar every time a number appears—unless the number is 3. Then, don't press. This test engages all three of your attentional subsystems.
                </Text>
                <View style={styles.quoteAuthorContainer}>
                    <View style={styles.authorDivider} />
                    <Text style={styles.quoteAuthor}>Peak Mind, Amishi P. Jha</Text>
                </View>
            </Animated.View>

            {/* Instructions */}
            <Animated.View
                entering={FadeInDown.delay(350).duration(400).springify()}
                style={styles.instructions}
            >
                <InstructionStep
                    number={1}
                    color={THEME.accent}
                    delay={400}
                    icon={<Timer size={moderateScale(14)} color="white" />}
                >
                    <Text style={styles.instructionText}>
                        Numbers will flash for <Text style={styles.highlight}>0.25 seconds</Text>.
                    </Text>
                </InstructionStep>

                <InstructionStep
                    number={2}
                    color={THEME.success}
                    delay={450}
                    icon={<CheckCircle2 size={moderateScale(14)} color="white" />}
                >
                    <Text style={styles.instructionText}>
                        <Text style={styles.highlightAccent}>TAP ANYWHERE</Text> for any number except{' '}
                        <Text style={styles.highlightError}>3</Text>.
                    </Text>
                </InstructionStep>

                <InstructionStep
                    number={3}
                    color={THEME.error}
                    delay={500}
                    icon={<Shield size={moderateScale(14)} color="white" />}
                >
                    <Text style={styles.instructionText}>
                        When you see <Text style={styles.highlightError}>3</Text>,{' '}
                        <Text style={styles.underline}>DO NOT TAP</Text>.
                    </Text>
                </InstructionStep>
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
