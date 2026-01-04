// src/navigation/RootNavigator.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/screens/HomeScreen';
import { SartScreen } from '@/games/sart/screens/SartScreen';
import { FlashCueScreen, FlashCueNoFlashScreen } from '@/games/flashcue/screens/FlashCueScreen';
import { BreathScreen } from '@/games/breath/screens/BreathScreen';
import { MeditationScreen } from '@/games/meditation/screens/MeditationScreen';
import { RootStackParamList } from './types';
import { navigationTheme } from './theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root navigation container with all app screens
 */
export const RootNavigator: React.FC = () => {
    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    contentStyle: { backgroundColor: '#020617' },
                }}
            >
                <Stack.Screen name="Home">
                    {({ navigation }) => (
                        <HomeScreen
                            onSelectGame={(game) => {
                                if (game === 'sart') {
                                    navigation.navigate('Sart');
                                } else if (game === 'flashcue') {
                                    navigation.navigate('FlashCue');
                                } else if (game === 'flashcue_noflash') {
                                    navigation.navigate('FlashCueNoFlash');
                                } else if (game === 'breath') {
                                    navigation.navigate('Breath');
                                } else if (game === 'meditation') {
                                    navigation.navigate('Meditation');
                                }
                                // Add future games here
                            }}
                        />
                    )}
                </Stack.Screen>

                <Stack.Screen name="Sart">
                    {({ navigation }) => (
                        <SartScreen onBack={() => navigation.goBack()} />
                    )}
                </Stack.Screen>

                <Stack.Screen name="FlashCue">
                    {({ navigation }) => (
                        <FlashCueScreen onBack={() => navigation.goBack()} />
                    )}
                </Stack.Screen>

                <Stack.Screen name="FlashCueNoFlash">
                    {({ navigation }) => (
                        <FlashCueNoFlashScreen onBack={() => navigation.goBack()} />
                    )}
                </Stack.Screen>

                <Stack.Screen name="Breath">
                    {({ navigation }) => (
                        <BreathScreen onBack={() => navigation.goBack()} />
                    )}
                </Stack.Screen>

                <Stack.Screen name="Meditation">
                    {({ navigation }) => (
                        <MeditationScreen onBack={() => navigation.goBack()} />
                    )}
                </Stack.Screen>

                {/* Add future game screens here:
                <Stack.Screen name="Stroop">
                    {({ navigation }) => (
                        <StroopScreen onBack={() => navigation.goBack()} />
                    )}
                </Stack.Screen>
                */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
