// src/games/sart/screens/SartScreen/index.tsx
import * as React from 'react';
import { useSartLogic } from '@/games/sart/hooks/useSartLogic';
import { useButtonAnimation } from './hooks';
import { IdleView, PlayingView, FinishedView } from './views';

interface SartScreenProps {
    onBack: () => void;
}

export const SartScreen: React.FC<SartScreenProps> = ({ onBack }) => {
    const {
        gameState,
        currentDigit,
        isDigitVisible,
        startGame,
        handlePress,
        results,
        trialCount
    } = useSartLogic();

    const { buttonAnimStyle, onPressIn, onPressOut } = useButtonAnimation();

    switch (gameState) {
        case 'idle':
            return (
                <IdleView
                    onBack={onBack}
                    onStart={startGame}
                    buttonAnimStyle={buttonAnimStyle}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                />
            );

        case 'playing':
            return (
                <PlayingView
                    trialCount={trialCount}
                    currentDigit={currentDigit}
                    isDigitVisible={isDigitVisible}
                    onPress={handlePress}
                    onExit={onBack}
                />
            );

        case 'finished':
            return (
                <FinishedView
                    results={results}
                    onRetry={startGame}
                    onBack={onBack}
                    buttonAnimStyle={buttonAnimStyle}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                />
            );

        default:
            return null;
    }
};
