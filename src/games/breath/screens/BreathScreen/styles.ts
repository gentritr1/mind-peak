// src/games/breath/screens/BreathScreen/styles.ts
import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from '@/utils/responsive';
import { THEME } from '@/games/breath/constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.bg,
    },
    headerWrapper: {
        paddingTop: verticalScale(48),
        paddingHorizontal: scale(24),
        paddingBottom: verticalScale(8),
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(24),
        gap: scale(6),
        alignSelf: 'flex-start',
        paddingVertical: verticalScale(4),
        paddingRight: scale(12),
    },
    backButtonText: {
        color: THEME.textMuted,
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
    idleContent: {
        paddingHorizontal: scale(24),
        paddingBottom: verticalScale(40),
    },
    title: {
        color: THEME.text,
        fontSize: moderateScale(32),
        fontWeight: '800',
        letterSpacing: -0.5,
        marginBottom: verticalScale(4),
    },
    subtitle: {
        color: THEME.textMuted,
        fontSize: moderateScale(14),
    },
    card: {
        backgroundColor: THEME.surface,
        borderRadius: moderateScale(20),
        padding: scale(20),
        borderWidth: 1,
        borderColor: THEME.surfaceLight,
        marginTop: verticalScale(24),
    },
    cardTitle: {
        color: THEME.text,
        fontSize: moderateScale(16),
        fontWeight: '700',
        marginBottom: verticalScale(4),
    },
    cardText: {
        color: THEME.textMuted,
        fontSize: moderateScale(14),
        lineHeight: moderateScale(22),
    },
    difficultyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: verticalScale(20),
        gap: scale(8),
    },
    difficultyChip: {
        flex: 1,
        borderRadius: moderateScale(16),
        borderWidth: 1,
        borderColor: THEME.surfaceLight,
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(10),
        backgroundColor: THEME.surface,
    },
    difficultyChipActive: {
        borderColor: THEME.accent,
        backgroundColor: THEME.accentSoft,
    },
    difficultyChipLabel: {
        color: THEME.text,
        fontSize: moderateScale(13),
        fontWeight: '700',
    },
    difficultyChipSub: {
        color: THEME.textMuted,
        fontSize: moderateScale(11),
        marginTop: verticalScale(2),
    },
    startButton: {
        marginTop: verticalScale(24),
        height: verticalScale(56),
        borderRadius: moderateScale(18),
        backgroundColor: THEME.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startButtonText: {
        color: THEME.text,
        fontSize: moderateScale(16),
        fontWeight: '700',
        letterSpacing: 0.4,
    },

    // Playing
    playingWrapper: {
        flex: 1,
        backgroundColor: THEME.bg,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(24),
    },
    phaseLabel: {
        color: THEME.textMuted,
        fontSize: moderateScale(14),
        textAlign: 'center',
        marginBottom: verticalScale(8),
    },
    phaseTitle: {
        color: THEME.text,
        fontSize: moderateScale(22),
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: verticalScale(20),
    },
    breathCircleOuter: {
        width: scale(220),
        height: scale(220),
        borderRadius: scale(110),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: THEME.accentSoft,
        shadowColor: THEME.accent,
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
        elevation: 18,
    },
    breathCircleInner: {
        width: scale(140),
        height: scale(140),
        borderRadius: scale(70),
        backgroundColor: THEME.surface,
        borderWidth: 1,
        borderColor: THEME.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        color: THEME.text,
        fontSize: moderateScale(32),
        fontWeight: '700',
    },
    timerSubText: {
        color: THEME.textMuted,
        fontSize: moderateScale(12),
        marginTop: verticalScale(4),
    },
    holdButton: {
        marginTop: verticalScale(32),
        width: '100%',
        height: verticalScale(56),
        borderRadius: moderateScale(999),
        borderWidth: 1,
        borderColor: THEME.accentSoft,
        backgroundColor: THEME.surface,
        overflow: 'hidden',
    },
    holdButtonFill: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: THEME.accentSoft,
    },
    holdButtonContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    holdButtonActive: {
        backgroundColor: THEME.accentSoft,
        borderColor: THEME.accentMuted,
    },
    holdButtonText: {
        color: THEME.text,
        fontSize: moderateScale(15),
        fontWeight: '600',
    },
    helperText: {
        marginTop: verticalScale(12),
        textAlign: 'center',
        color: THEME.textMuted,
        fontSize: moderateScale(12),
    },
    feedbackBadge: {
        marginTop: verticalScale(18),
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(6),
        borderRadius: moderateScale(999),
        backgroundColor: THEME.surfaceLight,
    },
    feedbackText: {
        color: THEME.textMuted,
        fontSize: moderateScale(12),
    },
    cycleText: {
        marginTop: verticalScale(12),
        color: THEME.textMuted,
        fontSize: moderateScale(12),
        textAlign: 'center',
    },

    // Finished
    finishedContent: {
        flex: 1,
        paddingHorizontal: scale(24),
        paddingBottom: verticalScale(32),
    },
    finishedTitle: {
        color: THEME.text,
        fontSize: moderateScale(24),
        fontWeight: '800',
        marginBottom: verticalScale(6),
    },
    finishedSubtitle: {
        color: THEME.textMuted,
        fontSize: moderateScale(14),
        marginBottom: verticalScale(20),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(8),
    },
    summaryLabel: {
        color: THEME.textMuted,
        fontSize: moderateScale(13),
    },
    summaryValue: {
        color: THEME.text,
        fontSize: moderateScale(13),
        fontWeight: '600',
    },
    finishedButton: {
        marginTop: verticalScale(24),
        height: verticalScale(52),
        borderRadius: moderateScale(18),
        backgroundColor: THEME.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    finishedButtonText: {
        color: THEME.text,
        fontSize: moderateScale(15),
        fontWeight: '600',
    },
});


