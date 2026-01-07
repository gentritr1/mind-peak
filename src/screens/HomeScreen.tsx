import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brain, Info, Target, Zap, ChevronRight, Wind, Sparkles } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from '../utils/responsive';
import { COLORS } from '@/theme/colors';

const THEME = COLORS;

interface GameOptionProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    onPress: () => void;
    available?: boolean;
}

const GameOption: React.FC<GameOptionProps> = ({ title, subtitle, icon, color, onPress, available = true }) => (
    <TouchableOpacity
        style={[styles.card, !available && styles.cardDisabled]}
        onPress={onPress}
        disabled={!available}
        activeOpacity={0.7}
    >
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            {icon}
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        {available ? (
            <ChevronRight size={20} color={THEME.textDim} />
        ) : (
            <View style={styles.badge}>
                <Text style={styles.badgeText}>Soon</Text>
            </View>
        )}
    </TouchableOpacity>
);

interface HomeScreenProps {
    onSelectGame: (game: string) => void;
    isLoggedIn: boolean;
    userEmail?: string | null;
    onPressAccount: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectGame, isLoggedIn, userEmail, onPressAccount }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Train Your</Text>
                    <Text style={styles.appName}>Peak Mind</Text>
                </View>

                <View style={[styles.section, styles.accountSection]}>
                    <View style={styles.accountCard}>
                        <Text style={styles.sectionTitle}>Account</Text>
                        <Text style={styles.accountText}>
                            {isLoggedIn
                                ? `Signed in as ${userEmail ?? 'your account'}.`
                                : 'You can use Peak Mind fully as a guest, or create an account to sync your training history.'}
                        </Text>
                        <TouchableOpacity
                            onPress={onPressAccount}
                            style={styles.accountButton}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.accountButtonText}>
                                {isLoggedIn ? 'Sign out (use as guest)' : 'Sign in / Register'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Available Games</Text>
                    <GameOption
                        title="SART Task"
                        subtitle="Sustained Attention to Response Task"
                        icon={<Brain size={24} color={THEME.accent} />}
                        color={THEME.accent}
                        onPress={() => onSelectGame('sart')}
                    />
                    <GameOption
                        title="Flash Cue Task"
                        subtitle="Covert Spatial Attention"
                        icon={<Target size={24} color="#8b5cf6" />}
                        color="#8b5cf6"
                        onPress={() => onSelectGame('flashcue')}
                    />
                    <GameOption
                        title="X Detection Task"
                        subtitle="Baseline without Flash Cue"
                        icon={<Target size={24} color="#22c55e" />}
                        color="#22c55e"
                        onPress={() => onSelectGame('flashcue_noflash')}
                    />
                    <GameOption
                        title="4–6 Breath"
                        subtitle="Guided breathing timer"
                        icon={<Wind size={24} color="#22c55e" />}
                        color="#22c55e"
                        onPress={() => onSelectGame('breath')}
                    />
                    <GameOption
                        title="Meditation Timer"
                        subtitle="Label your distractions"
                        icon={<Sparkles size={24} color="#6366f1" />}
                        color="#6366f1"
                        onPress={() => onSelectGame('meditation')}
                    />
                </View>

                <View style={[styles.section, { marginTop: verticalScale(16) }]}>
                    <Text style={styles.sectionTitle}>Coming Soon</Text>
                    <GameOption
                        title="Stroop Task"
                        subtitle="Executive Control & Inhibition"
                        icon={<Target size={24} color="#f43f5e" />}
                        color="#f43f5e"
                        onPress={() => { }}
                        available={false}
                    />
                    <GameOption
                        title="Flanker Task"
                        subtitle="Visual Information Processing"
                        icon={<Zap size={24} color="#10b981" />}
                        color="#10b981"
                        onPress={() => { }}
                        available={false}
                    />
                </View>

                <View style={styles.infoCard}>
                    <Info size={16} color={THEME.accent} />
                    <Text style={styles.infoText}>
                        These tasks are based on real cognitive studies featured in Dr. Amishi Jha's "Peak Mind".
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.bg,
    },
    content: {
        padding: scale(24),
        paddingTop: verticalScale(32),
    },
    header: {
        marginBottom: verticalScale(40),
    },
    greeting: {
        color: THEME.textMuted,
        fontSize: moderateScale(16),
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    appName: {
        color: THEME.text,
        fontSize: moderateScale(36),
        fontWeight: 'bold',
    },
    section: {
        gap: verticalScale(12),
    },
    sectionTitle: {
        color: THEME.textDim,
        fontSize: moderateScale(14),
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: verticalScale(4),
    },
    card: {
        backgroundColor: THEME.surface,
        borderRadius: moderateScale(20),
        padding: scale(20),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: THEME.surfaceLight,
    },
    cardDisabled: {
        opacity: 0.6,
    },
    iconContainer: {
        width: scale(52),
        height: scale(52),
        borderRadius: moderateScale(16),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(16),
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        color: THEME.text,
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        marginBottom: verticalScale(2),
    },
    cardSubtitle: {
        color: THEME.textMuted,
        fontSize: moderateScale(13),
    },
    badge: {
        backgroundColor: THEME.surfaceLight,
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: moderateScale(10),
    },
    badgeText: {
        color: THEME.textMuted,
        fontSize: moderateScale(10),
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: THEME.surfaceLight + '40',
        padding: scale(16),
        borderRadius: moderateScale(16),
        marginTop: verticalScale(40),
        gap: scale(12),
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        color: THEME.textMuted,
        fontSize: moderateScale(12),
        lineHeight: moderateScale(18),
    },
    accountSection: {
        marginBottom: verticalScale(32),
    },
    accountCard: {
        backgroundColor: THEME.surface,
        borderRadius: moderateScale(20),
        padding: scale(20),
        borderWidth: 1,
        borderColor: THEME.surfaceLight,
        gap: verticalScale(8),
    },
    accountText: {
        color: THEME.textMuted,
        fontSize: moderateScale(12),
        lineHeight: moderateScale(18),
        marginBottom: verticalScale(8),
    },
    accountButton: {
        alignSelf: 'flex-start',
        backgroundColor: THEME.accent,
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(8),
        borderRadius: moderateScale(999),
    },
    accountButtonText: {
        color: THEME.text,
        fontSize: moderateScale(12),
        fontWeight: '600',
    },
});
