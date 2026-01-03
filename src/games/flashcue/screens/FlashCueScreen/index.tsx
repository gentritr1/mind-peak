// src/games/flashcue/screens/FlashCueScreen/index.tsx
import * as React from 'react';
import { useFlashCueLogic, FlashCueMode } from '@/games/flashcue/hooks/useFlashCueLogic';
import { useButtonAnimation } from './hooks';
import { IdleView, PlayingView, FinishedView } from './views';

type Variant = 'flash' | 'noFlash';

interface FlashCueScreenBaseProps {
    onBack: () => void;
    variant: Variant;
}

const FlashCueScreenBase: React.FC<FlashCueScreenBaseProps> = ({ onBack, variant }) => {
    const mode: FlashCueMode = variant === 'flash' ? 'flash' : 'noFlash';

    const {
        gameState,
        trialIndex,
        cueSide,
        targetSide,
        isCueVisible,
        isTargetVisible,
        results,
        startGame,
        handlePress,
    } = useFlashCueLogic(mode);

    const { buttonAnimStyle, onPressIn, onPressOut } = useButtonAnimation();

    switch (gameState) {
        case 'idle':
            return (
                <IdleView
                    variant={variant}
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
                    variant={variant}
                    trialIndex={trialIndex}
                    cueSide={cueSide}
                    targetSide={targetSide}
                    isCueVisible={isCueVisible}
                    isTargetVisible={isTargetVisible}
                    onPress={handlePress}
                    onExit={onBack}
                />
            );

        case 'finished':
            return (
                <FinishedView
                    variant={variant}
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

interface FlashCueScreenProps {
    onBack: () => void;
}

export const FlashCueScreen: React.FC<FlashCueScreenProps> = ({ onBack }) => (
    <FlashCueScreenBase onBack={onBack} variant="flash" />
);

export const FlashCueNoFlashScreen: React.FC<FlashCueScreenProps> = ({ onBack }) => (
    <FlashCueScreenBase onBack={onBack} variant="noFlash" />
);

