// src/games/meditation/screens/MeditationScreen/index.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { ArrowLeft, Sparkles, PauseCircle, PlayCircle } from 'lucide-react-native';
import { moderateScale } from '@/utils/responsive';
import { DistractionCategory, MEDITATION_CONFIG, THEME } from '@/games/meditation/constants';
// Audio playback for meditation background optionally uses expo-av.
// To enable audio, install expo-av in your app:
//   npx expo install expo-av
// This file lazily requires it to avoid hard build-time dependency.
let AudioModule: any | null = null;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    AudioModule = require('expo-av');
} catch {
    AudioModule = null;
}

import { MEDITATION_TRACKS, MeditationTrack } from '@/../assets/songs';
import { useMeditationTimer } from '@/games/meditation/hooks/useMeditationTimer';
import { styles } from './styles';

interface MeditationScreenProps {
    onBack: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const MeditationScreen: React.FC<MeditationScreenProps> = ({ onBack }) => {
    const [presetMinutes, setPresetMinutes] = React.useState<number>(MEDITATION_CONFIG.DEFAULT_DURATION_MINUTES);
    const [customMinutes, setCustomMinutes] = React.useState<string>('');
    const [lastHint, setLastHint] = React.useState<string | null>(null);
    const [noteCategory, setNoteCategory] = React.useState<DistractionCategory | null>(null);
    const [noteText, setNoteText] = React.useState<string>('');
    const [selectedTrackId, setSelectedTrackId] = React.useState<string>('silence');
    const [isMusicOn, setIsMusicOn] = React.useState<boolean>(true);

    const {
        state,
        targetDurationMs,
        elapsedMs,
        events,
        start,
        pause,
        resume,
        reset,
        labelDistraction,
    } = useMeditationTimer();

    const orbScale = useSharedValue(1);
    const glowScale = useSharedValue(1);
    const sheenTranslate = useSharedValue(-40);
    const pulseIndexRef = React.useRef(0);
    const soundRef = React.useRef<any | null>(null);

    React.useEffect(() => {
        const animateOnce = () => {
            const track = MEDITATION_TRACKS.find((t: MeditationTrack) => t.id === selectedTrackId);
            let basePulse = track?.pulseDurationMs ?? 5000;

            if (track?.pulsesMs && track.pulsesMs.length > 0) {
                const idx = pulseIndexRef.current % track.pulsesMs.length;
                basePulse = track.pulsesMs[idx];
                pulseIndexRef.current += 1;
            }

            const nextOrb = 0.98 + Math.random() * 0.08; // ~0.98–1.06
            const nextGlow = 1.0 + Math.random() * 0.18; // ~1.0–1.18
            const nextSheen = -50 + Math.random() * 100; // sweep across

            const orbDuration = basePulse + (Math.random() - 0.5) * 0.25 * basePulse;
            const glowDuration = basePulse * 1.2 + (Math.random() - 0.5) * 0.3 * basePulse;
            const sheenDuration = basePulse * 1.4 + (Math.random() - 0.5) * 0.35 * basePulse;

            orbScale.value = withTiming(nextOrb, { duration: Math.max(2800, orbDuration) });
            glowScale.value = withTiming(nextGlow, { duration: Math.max(3800, glowDuration) });
            sheenTranslate.value = withTiming(nextSheen, { duration: Math.max(4500, sheenDuration) });
        };

        animateOnce();
        const interval = setInterval(animateOnce, 4500);
        return () => clearInterval(interval);
    }, [selectedTrackId]);

    const orbStyle = useAnimatedStyle(() => ({
        transform: [{ scale: orbScale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        transform: [{ scale: glowScale.value }],
        opacity: 0.7,
    }));

    const sheenStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: sheenTranslate.value,
            },
            {
                rotate: '-35deg',
            },
        ],
        opacity: 0.9,
    }));

    const totalMs = targetDurationMs || (presetMinutes * 60_000);
    const remainingMs = Math.max(0, totalMs - elapsedMs);
    const remainingSecTotal = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(remainingSecTotal / 60);
    const seconds = remainingSecTotal % 60;
    const timerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const effectiveMinutes = customMinutes
        ? Math.min(
            MEDITATION_CONFIG.MAX_DURATION_MINUTES,
            Math.max(MEDITATION_CONFIG.MIN_DURATION_MINUTES, parseInt(customMinutes || '0', 10) || presetMinutes),
        )
        : presetMinutes;

    const handleStart = () => {
        const durationMs = effectiveMinutes * 60_000;
        start(durationMs);
    };

    const handleLabelPress = (type: DistractionCategory) => {
        setNoteCategory(type);
        setNoteText('');
        pause();
    };

    const applyHintForCategory = (type: DistractionCategory) => {
        if (type === 'emotion') {
            setLastHint('Emotion: moods, storylines, judgments (e.g. anxiety, excitement, frustration).');
        } else if (type === 'sensation') {
            setLastHint('Sensation: body or sense experiences (e.g. itch, sound, warmth, tightness).');
        } else {
            setLastHint('Thought: images, plans, memories, commentary (e.g. to-do lists, replaying events).');
        }
    };

    const handleNoteCancel = () => {
        setNoteCategory(null);
        setNoteText('');
        resume();
    };

    const handleNoteSave = () => {
        if (!noteCategory) return;
        const trimmed = noteText.trim();
        labelDistraction(noteCategory, trimmed || undefined);
        applyHintForCategory(noteCategory);
        setNoteCategory(null);
        setNoteText('');
        resume();
    };

    const startAudioForTrack = async () => {
        const track = MEDITATION_TRACKS.find((t: MeditationTrack) => t.id === selectedTrackId && t.source);
        if (!track || !track.source) {
            console.log('[MeditationAudio] No playable track selected (id:', selectedTrackId, ')');
            return;
        }
        if (!AudioModule) {
            console.log('[MeditationAudio] expo-av is not installed. Run `npx expo install expo-av` to enable audio.');
            return;
        }
        try {
            console.log('[MeditationAudio] Starting track:', track.id);
            await AudioModule.Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
            });
            const { sound } = await AudioModule.Audio.Sound.createAsync(track.source, {
                isLooping: true,
                volume: 0.5,
            });
            soundRef.current = sound;
            await sound.playAsync();
            console.log('[MeditationAudio] Track is playing.');
        } catch (e) {
            console.log('[MeditationAudio] Failed to start audio:', e);
        }
    };

    const stopAudio = async () => {
        if (!soundRef.current) return;
        try {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
        } catch {
            // ignore
        } finally {
            soundRef.current = null;
        }
    };

    React.useEffect(() => {
        if (state === 'running' && isMusicOn && selectedTrackId !== 'silence') {
            // start or restart audio when session begins / track or toggle changes
            void stopAudio().then(() => startAudioForTrack());
        } else if (state !== 'running' || !isMusicOn || selectedTrackId === 'silence') {
            void stopAudio();
        }
        return () => {
            // ensure cleanup on unmount
            void stopAudio();
        };
    }, [state, isMusicOn, selectedTrackId]);

    const toggleMusic = () => {
        setIsMusicOn((prev) => !prev);
    };

    const currentTrack = MEDITATION_TRACKS.find((t: MeditationTrack) => t.id === selectedTrackId);

    if (state === 'idle') {
        return (
            <View style={styles.container}>
                <Animated.View entering={FadeIn.delay(80).duration(300)} style={styles.headerWrapper}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <ArrowLeft size={moderateScale(18)} color={THEME.textMuted} />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                </Animated.View>
                <ScrollView contentContainerStyle={styles.idleContent} showsVerticalScrollIndicator={false}>
                    <Animated.View
                        entering={FadeInDown.delay(140).duration(400).springify()}
                    >
                        <Text style={styles.title}>Meditation Timer</Text>
                        <Text style={styles.subtitle}>Sit, notice, and gently label distractions.</Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(220).duration(400).springify()}
                        style={styles.card}
                    >
                        <Text style={styles.cardTitle}>How it works</Text>
                        <Text style={styles.cardText}>
                            Choose how long you&apos;d like to meditate. As you sit, your mind will wander.
                            When you notice it, gently tap the type of distraction—emotion, sensation, or thought—
                            then return to the breath or body.
                        </Text>

                        <View style={styles.durationRow}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.durationChip,
                                    presetMinutes === 5 && !customMinutes && styles.durationChipActive,
                                ]}
                                onPress={() => {
                                    setPresetMinutes(5);
                                    setCustomMinutes('');
                                }}
                            >
                                <Text style={styles.durationChipLabel}>Short</Text>
                                <Text style={styles.durationChipSub}>5 minutes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.durationChip,
                                    presetMinutes === 10 && !customMinutes && styles.durationChipActive,
                                ]}
                                onPress={() => {
                                    setPresetMinutes(10);
                                    setCustomMinutes('');
                                }}
                            >
                                <Text style={styles.durationChipLabel}>Standard</Text>
                                <Text style={styles.durationChipSub}>10 minutes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.durationChip,
                                    presetMinutes === 20 && !customMinutes && styles.durationChipActive,
                                ]}
                                onPress={() => {
                                    setPresetMinutes(20);
                                    setCustomMinutes('');
                                }}
                            >
                                <Text style={styles.durationChipLabel}>Deep</Text>
                                <Text style={styles.durationChipSub}>20 minutes</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.customInputRow}>
                            <Text style={styles.customLabel}>Or custom minutes</Text>
                            <TextInput
                                style={styles.customInput}
                                keyboardType="number-pad"
                                placeholder={`${presetMinutes}`}
                                placeholderTextColor={THEME.textMuted}
                                value={customMinutes}
                                onChangeText={setCustomMinutes}
                            />
                        </View>

                        {MEDITATION_TRACKS.length > 0 && (
                            <>
                                <Text
                                    style={[
                                        styles.customLabel,
                                        { marginTop: 12 },
                                    ]}
                                >
                                    Background audio
                                </Text>
                                <View style={styles.durationRow}>
                                    {MEDITATION_TRACKS.map((track: MeditationTrack) => (
                                        <TouchableOpacity
                                            key={track.id}
                                            activeOpacity={0.8}
                                            style={[
                                                styles.durationChip,
                                                selectedTrackId === track.id && styles.durationChipActive,
                                            ]}
                                            onPress={() => setSelectedTrackId(track.id)}
                                        >
                                            <Text style={styles.durationChipLabel}>{track.label}</Text>
                                            <Text style={styles.durationChipSub}>{track.description}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}
                    </Animated.View>

                    <Animated.View
                        entering={FadeInUp.delay(320).duration(400).springify()}
                    >
                        <AnimatedTouchable style={styles.startButton} onPress={handleStart} activeOpacity={0.8}>
                            <Text style={styles.startButtonText}>Start Session</Text>
                        </AnimatedTouchable>
                    </Animated.View>
                </ScrollView>
            </View>
        );
    }

    if (state === 'finished') {
        const totalMinutes = Math.round((elapsedMs || totalMs) / 60_000);
        const emotions = events.filter((e) => e.category === 'emotion').length;
        const sensations = events.filter((e) => e.category === 'sensation').length;
        const thoughts = events.filter((e) => e.category === 'thought').length;

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
                    <Text style={styles.finishedSubtitle}>
                        You spent {totalMinutes} mindful minutes with your attention.
                    </Text>

                    <View style={styles.card}>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Total duration</Text>
                            <Text style={styles.statValue}>{totalMinutes} min</Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Emotion labels</Text>
                            <Text style={styles.statValue}>{emotions}</Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Sensation labels</Text>
                            <Text style={styles.statValue}>{sensations}</Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Thought labels</Text>
                            <Text style={styles.statValue}>{thoughts}</Text>
                        </View>
                    </View>

                    <View style={styles.finishedButtonRow}>
                        <TouchableOpacity
                            style={styles.finishedButtonSecondary}
                            activeOpacity={0.8}
                            onPress={onBack}
                        >
                            <Text style={styles.finishedButtonTextSecondary}>Back to Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.finishedButtonPrimary}
                            activeOpacity={0.8}
                            onPress={reset}
                        >
                            <Text style={styles.finishedButtonTextPrimary}>Sit Again</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // running or paused
    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={moderateScale(18)} color={THEME.textMuted} />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.playingWrapper}>
                <View style={styles.timerSection}>
                    <Text style={styles.timerLabel}>Remaining</Text>
                    <Text style={styles.timerText}>{timerText}</Text>
                </View>

                <View style={styles.orbWrapper}>
                    <Animated.View style={[styles.orbOuter, orbStyle]}>
                        <Animated.View style={[styles.orbGlow, glowStyle]} />
                        <View style={styles.orbInner}>
                            <Animated.View style={[styles.orbSheen, sheenStyle]} />
                            <Sparkles size={moderateScale(28)} color={THEME.accent} />
                        </View>
                    </Animated.View>
                    <Text style={styles.orbHint}>
                        Let the breath be natural. Each time you&apos;re pulled away, notice it and gently label it.
                    </Text>
                    <View style={styles.musicRow}>
                        <TouchableOpacity
                            style={styles.musicButton}
                            activeOpacity={0.8}
                            onPress={toggleMusic}
                        >
                            {isMusicOn && currentTrack && currentTrack.id !== 'silence' ? (
                                <PauseCircle size={moderateScale(18)} color={THEME.accent} />
                            ) : (
                                <PlayCircle size={moderateScale(18)} color={THEME.accent} />
                            )}
                            <View>
                                <Text style={styles.musicButtonText}>
                                    {isMusicOn && currentTrack && currentTrack.id !== 'silence'
                                        ? 'Pause music'
                                        : 'Play music'}
                                </Text>
                                <Text style={styles.musicButtonSub}>
                                    {currentTrack?.label ?? 'Silence'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View>
                    <View style={styles.distractionHeader}>
                        <Text style={styles.distractionTitle}>Label distractions</Text>
                        <Text style={styles.distractionSubtitle}>
                            When you notice the mind has wandered, tap the type and return to the breath.
                        </Text>
                    </View>

                    <View style={styles.distractionRow}>
                        <TouchableOpacity
                            style={styles.distractionChip}
                            activeOpacity={0.8}
                            onPress={() => handleLabelPress('emotion')}
                        >
                            <Text style={styles.distractionLabel}>Emotion</Text>
                            <Text style={styles.distractionHint}>Feelings, moods, storylines</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.distractionChip}
                            activeOpacity={0.8}
                            onPress={() => handleLabelPress('sensation')}
                        >
                            <Text style={styles.distractionLabel}>Sensation</Text>
                            <Text style={styles.distractionHint}>Body, sounds, touch</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.distractionChip}
                            activeOpacity={0.8}
                            onPress={() => handleLabelPress('thought')}
                        >
                            <Text style={styles.distractionLabel}>Thought</Text>
                            <Text style={styles.distractionHint}>Images, plans, commentary</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.footerHint}>
                        {lastHint ??
                            'There is no right number of labels—each one is a moment of awareness.'}
                    </Text>
                </View>
            </View>

            {noteCategory && (
                <Animated.View entering={FadeIn.duration(250)} style={styles.noteOverlay}>
                    <Animated.View
                        entering={FadeInUp.delay(40).duration(300).springify()}
                        style={styles.noteCard}
                    >
                        <Text style={styles.noteTitle}>
                            {noteCategory === 'emotion'
                                ? 'Label this emotion'
                                : noteCategory === 'sensation'
                                    ? 'Label this sensation'
                                    : 'Label this thought'}
                        </Text>
                        <Text style={styles.noteSubtitle}>
                            Add a few words so you can remember what pulled your attention away.
                        </Text>
                        <TextInput
                            style={styles.noteInput}
                            multiline
                            placeholder="e.g. worry about work, warmth in chest, planning tomorrow..."
                            placeholderTextColor={THEME.textMuted}
                            value={noteText}
                            onChangeText={setNoteText}
                        />
                        <View style={styles.noteButtonsRow}>
                            <TouchableOpacity
                                style={styles.noteButtonSecondary}
                                activeOpacity={0.8}
                                onPress={handleNoteCancel}
                            >
                                <Text style={styles.noteButtonTextSecondary}>Skip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.noteButtonPrimary}
                                activeOpacity={0.8}
                                onPress={handleNoteSave}
                            >
                                <Text style={styles.noteButtonTextPrimary}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Animated.View>
            )}
        </View>
    );
};


