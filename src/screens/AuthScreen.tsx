import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from '@/utils/responsive';
import { useAuth } from '@/hooks/useAuth';
import { apiForgotPassword } from '@/utils/api';
import { COLORS } from '@/theme/colors';

const THEME = COLORS;

type Mode = 'login' | 'register' | 'forgot';

interface AuthScreenProps {
    onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBack }) => {
    const { login, register, isLoading } = useAuth();

    const [mode, setMode] = React.useState<Mode>('login');
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        React.useState(false);

    const [error, setError] = React.useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = React.useState<
        Record<string, string[]> | undefined
    >(undefined);
    const [infoMessage, setInfoMessage] = React.useState<string | null>(null);
    const [isSubmittingForgot, setIsSubmittingForgot] = React.useState(false);
    const [tabWidth, setTabWidth] = React.useState(0);

    const tabIndexForMode = (m: Mode) =>
        m === 'login' ? 0 : m === 'register' ? 1 : 2;
    const tabAnim = React.useRef(
        new Animated.Value(tabIndexForMode('login')),
    ).current;
    const errorAnim = React.useRef(new Animated.Value(0)).current;

    const resetMessages = () => {
        setError(null);
        setFieldErrors(undefined);
        setInfoMessage(null);
    };

    const handleSwitchMode = (next: Mode) => {
        setMode(next);
        resetMessages();
        setPassword('');
        setPasswordConfirmation('');

        Animated.timing(tabAnim, {
            toValue: tabIndexForMode(next),
            duration: 220,
            useNativeDriver: true,
        }).start();
    };

    const handleSubmit = async () => {
        resetMessages();

        const trimmedEmail = email.trim();
        const isValidEmail =
            trimmedEmail.length > 0 &&
            /\S+@\S+\.\S+/.test(trimmedEmail.toLowerCase());

        if (!isValidEmail) {
            setError('Please enter a valid email address.');
            return;
        }

        if (mode === 'login') {
            if (!password) {
                setError('Please enter your password.');
                return;
            }

            const result = await login({ email: trimmedEmail, password });
            if (!result.success) {
                setError(result.error ?? 'Unable to log in.');
                setFieldErrors(result.fieldErrors);
                return;
            }
            onBack();
            return;
        }

        if (mode === 'register') {
            if (!name.trim()) {
                setError('Please enter your name.');
                return;
            }

            if (password.length < 12) {
                setError('Password must be at least 12 characters long.');
                return;
            }

            if (password !== passwordConfirmation) {
                setError('Passwords do not match.');
                return;
            }

            const result = await register({
                name: name.trim(),
                email: trimmedEmail,
                password,
                password_confirmation: passwordConfirmation,
            });
            if (!result.success) {
                setError(result.error ?? 'Unable to register.');
                setFieldErrors(result.fieldErrors);
                return;
            }
            onBack();
        }
    };

    const handleForgotPassword = async () => {
        resetMessages();
        const trimmedEmail = email.trim();
        const isValidEmail =
            trimmedEmail.length > 0 &&
            /\S+@\S+\.\S+/.test(trimmedEmail.toLowerCase());

        if (!isValidEmail) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsSubmittingForgot(true);
        try {
            const result = await apiForgotPassword({ email: trimmedEmail });
            if (result.status === 429) {
                setError(
                    'Too many reset attempts. Please wait a minute and try again.',
                );
                return;
            }
            if (result.error || !result.data) {
                setError(
                    result.error?.message ??
                        "We couldn't send a reset link. Please try again.",
                );
                return;
            }
            // Backend always returns a generic success message, so mirror that.
            setInfoMessage(
                'If that email address is registered, we have emailed a password reset link.',
            );
        } catch {
            setError(
                'Unexpected error while requesting a reset link. Please try again.',
            );
        } finally {
            setIsSubmittingForgot(false);
        }
    };

    const activeLabel =
        mode === 'login'
            ? 'Log in'
            : mode === 'register'
              ? 'Create account'
              : 'Send reset email';

    React.useEffect(() => {
        if (!error && !infoMessage) {
            return;
        }
        errorAnim.setValue(0);
        Animated.sequence([
            Animated.timing(errorAnim, {
                toValue: 1,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.timing(errorAnim, {
                toValue: -1,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.timing(errorAnim, {
                toValue: 0,
                duration: 80,
                useNativeDriver: true,
            }),
        ]).start();
    }, [error, infoMessage, errorAnim]);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={verticalScale(20)}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.appName}>Peak Mind</Text>
                </View>

                <Text style={styles.title}>
                    {mode === 'login'
                        ? 'Welcome back'
                        : mode === 'register'
                          ? 'Create your account'
                          : 'Forgot password'}
                </Text>
                <Text style={styles.subtitle}>
                    You can always use the app as a guest. Creating an account
                    lets you sync meditation and training history to the cloud.
                </Text>

                <View
                    style={styles.modeRow}
                    onLayout={(event) => {
                        const width = event.nativeEvent.layout.width;
                        setTabWidth(width / 3);
                    }}
                >
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.modeHighlight,
                            {
                                transform: [
                                    {
                                        translateX: tabAnim.interpolate({
                                            inputRange: [0, 1, 2],
                                            outputRange: [
                                                0,
                                                tabWidth,
                                                tabWidth * 2,
                                            ],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                    <TouchableOpacity
                        style={[
                            styles.modeChip,
                            mode === 'login' && styles.modeChipActive,
                        ]}
                        onPress={() => handleSwitchMode('login')}
                    >
                        <Text
                            style={[
                                styles.modeChipText,
                                mode === 'login' && styles.modeChipTextActive,
                            ]}
                        >
                            Log in
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.modeChip,
                            mode === 'register' && styles.modeChipActive,
                        ]}
                        onPress={() => handleSwitchMode('register')}
                    >
                        <Text
                            style={[
                                styles.modeChipText,
                                mode === 'register' &&
                                    styles.modeChipTextActive,
                            ]}
                        >
                            Register
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.modeChip,
                            mode === 'forgot' && styles.modeChipActive,
                        ]}
                        onPress={() => handleSwitchMode('forgot')}
                    >
                        <Text
                            style={[
                                styles.modeChipText,
                                mode === 'forgot' && styles.modeChipTextActive,
                            ]}
                        >
                            Reset
                        </Text>
                    </TouchableOpacity>
                </View>

                {mode === 'register' && (
                    <View style={styles.field}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Jane Doe"
                            placeholderTextColor={THEME.textMuted}
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                        {fieldErrors?.name && (
                            <Text style={styles.errorText}>
                                {fieldErrors.name.join(' ')}
                            </Text>
                        )}
                    </View>
                )}

                <View style={styles.field}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="you@example.com"
                        placeholderTextColor={THEME.textMuted}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    {fieldErrors?.email && (
                        <Text style={styles.errorText}>
                            {fieldErrors.email.join(' ')}
                        </Text>
                    )}
                </View>

                {mode !== 'forgot' && (
                    <>
                        <View style={styles.field}>
                            <Text style={styles.label}>
                                Password (min 12 characters)
                            </Text>
                            <View style={styles.passwordRow}>
                                <TextInput
                                    style={[styles.input, styles.passwordInput]}
                                    placeholder="••••••••"
                                    placeholderTextColor={THEME.textMuted}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    style={styles.passwordToggle}
                                    activeOpacity={0.7}
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={moderateScale(16)}
                                            color={THEME.textMuted}
                                        />
                                    ) : (
                                        <Eye
                                            size={moderateScale(16)}
                                            color={THEME.textMuted}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {fieldErrors?.password && (
                                <Text style={styles.errorText}>
                                    {fieldErrors.password.join(' ')}
                                </Text>
                            )}
                        </View>

                        {mode === 'register' && (
                            <View style={styles.field}>
                                <Text style={styles.label}>
                                    Confirm password
                                </Text>
                                <View style={styles.passwordRow}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            styles.passwordInput,
                                        ]}
                                        placeholder="Repeat password"
                                        placeholderTextColor={
                                            THEME.textMuted
                                        }
                                        value={passwordConfirmation}
                                        onChangeText={
                                            setPasswordConfirmation
                                        }
                                        secureTextEntry={
                                            !showPasswordConfirmation
                                        }
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            setShowPasswordConfirmation(
                                                (prev) => !prev,
                                            )
                                        }
                                        style={styles.passwordToggle}
                                        activeOpacity={0.7}
                                    >
                                        {showPasswordConfirmation ? (
                                            <EyeOff
                                                size={moderateScale(16)}
                                                color={THEME.textMuted}
                                            />
                                        ) : (
                                            <Eye
                                                size={moderateScale(16)}
                                                color={THEME.textMuted}
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </>
                )}

                {error && (
                    <Animated.View
                        style={[
                            styles.errorBanner,
                            {
                                transform: [
                                    {
                                        translateX: errorAnim.interpolate({
                                            inputRange: [-1, 0, 1],
                                            outputRange: [-6, 0, 6],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <Text style={styles.errorBannerText}>{error}</Text>
                    </Animated.View>
                )}
                {infoMessage && (
                    <Animated.View
                        style={[
                            styles.infoBanner,
                            {
                                opacity: errorAnim.interpolate({
                                    inputRange: [-1, 0, 1],
                                    outputRange: [0.9, 1, 0.9],
                                }),
                            },
                        ]}
                    >
                        <Text style={styles.infoBannerText}>
                            {infoMessage}
                        </Text>
                    </Animated.View>
                )}

                {mode === 'forgot' ? (
                    <TouchableOpacity
                        style={styles.primaryButton}
                        activeOpacity={0.8}
                        onPress={handleForgotPassword}
                        disabled={isSubmittingForgot}
                    >
                        {isSubmittingForgot ? (
                            <ActivityIndicator color={THEME.text} />
                        ) : (
                            <Text style={styles.primaryButtonText}>
                                Send reset link
                            </Text>
                        )}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.primaryButton}
                        activeOpacity={0.8}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={THEME.text} />
                        ) : (
                            <Text style={styles.primaryButtonText}>
                                {activeLabel}
                            </Text>
                        )}
                    </TouchableOpacity>
                )}

                    <Text style={styles.footerText}>
                        You can always go back and continue as a guest without
                        signing in. Your data will stay on this device unless
                        you choose to sync it.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: THEME.bg,
    },
    content: {
        padding: scale(24),
        paddingTop: verticalScale(24),
        paddingBottom: verticalScale(32),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(24),
    },
    backButton: {
        paddingVertical: verticalScale(6),
        paddingHorizontal: scale(12),
        borderRadius: moderateScale(999),
        backgroundColor: THEME.surfaceLight,
    },
    backButtonText: {
        color: THEME.textMuted,
        fontSize: moderateScale(12),
        fontWeight: '600',
    },
    appName: {
        color: THEME.text,
        fontSize: moderateScale(18),
        fontWeight: '700',
    },
    title: {
        color: THEME.text,
        fontSize: moderateScale(24),
        fontWeight: '700',
        marginBottom: verticalScale(8),
    },
    subtitle: {
        color: THEME.textMuted,
        fontSize: moderateScale(13),
        lineHeight: moderateScale(18),
        marginBottom: verticalScale(24),
    },
    modeRow: {
        flexDirection: 'row',
        marginBottom: verticalScale(20),
        position: 'relative',
        borderRadius: moderateScale(999),
        backgroundColor: THEME.surface,
        borderWidth: 1,
        borderColor: THEME.surfaceLight,
        padding: 2,
    },
    modeHighlight: {
        position: 'absolute',
        top: 2,
        bottom: 2,
        left: 2,
        width: '33.3333%',
        borderRadius: moderateScale(999),
        backgroundColor: THEME.accent,
        opacity: 0.22,
    },
    modeChip: {
        flex: 1,
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(8),
        borderRadius: moderateScale(999),
        alignItems: 'center',
        justifyContent: 'center',
    },
    modeChipActive: {
        // text color handled separately
    },
    modeChipText: {
        color: THEME.textMuted,
        fontSize: moderateScale(13),
        fontWeight: '600',
    },
    modeChipTextActive: {
        color: THEME.text,
        fontWeight: '700',
    },
    field: {
        marginBottom: verticalScale(16),
    },
    label: {
        color: THEME.textDim,
        fontSize: moderateScale(12),
        marginBottom: verticalScale(4),
    },
    input: {
        backgroundColor: THEME.surface,
        borderRadius: moderateScale(12),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(10),
        color: THEME.text,
        fontSize: moderateScale(14),
        borderWidth: 1,
        borderColor: THEME.surfaceLight,
    },
    passwordRow: {
        position: 'relative',
        justifyContent: 'center',
    },
    passwordInput: {
        flex: 1,
        paddingRight: scale(40),
    },
    passwordToggle: {
        position: 'absolute',
        right: scale(10),
        top: '50%',
        transform: [{ translateY: -scale(14) }],
        width: scale(28),
        height: scale(28),
        borderRadius: moderateScale(999),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: THEME.surfaceLight,
    },
    passwordToggleText: {
        color: THEME.textMuted,
        fontSize: moderateScale(11),
        fontWeight: '600',
    },
    errorText: {
        color: THEME.danger,
        fontSize: moderateScale(11),
        marginTop: verticalScale(4),
    },
    errorBanner: {
        backgroundColor: COLORS.dangerBannerBg,
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8),
        borderRadius: moderateScale(12),
        fontSize: moderateScale(12),
        marginBottom: verticalScale(12),
    },
    infoBanner: {
        backgroundColor: COLORS.successBannerBg,
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8),
        borderRadius: moderateScale(12),
        fontSize: moderateScale(12),
        marginBottom: verticalScale(12),
    },
    errorBannerText: {
        color: THEME.text,
        fontSize: moderateScale(12),
    },
    infoBannerText: {
        color: THEME.text,
        fontSize: moderateScale(12),
    },
    primaryButton: {
        backgroundColor: THEME.accent,
        borderRadius: moderateScale(999),
        paddingVertical: verticalScale(12),
        alignItems: 'center',
        marginTop: verticalScale(4),
    },
    primaryButtonText: {
        color: THEME.text,
        fontSize: moderateScale(14),
        fontWeight: '700',
    },
    footerText: {
        marginTop: verticalScale(16),
        color: THEME.textMuted,
        fontSize: moderateScale(12),
        lineHeight: moderateScale(18),
    },
});


