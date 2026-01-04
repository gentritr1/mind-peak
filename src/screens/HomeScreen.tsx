import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Brain, Info, Target, Zap, ChevronRight, Wind, Sparkles } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

const THEME = {
    bg: '#020617',
    surface: '#0f172a',
    surfaceLight: '#1e293b',
    accent: '#0ea5e9',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textDim: '#64748b',
};

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

export const HomeScreen = ({ onSelectGame }: { onSelectGame: (game: string) => void }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Train Your</Text>
                    <Text style={styles.appName}>Peak Mind</Text>
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
});
