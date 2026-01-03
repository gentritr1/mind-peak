// src/games/flashcue/screens/FlashCueScreen/components/InstructionStep.tsx
import * as React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from '../styles';

interface InstructionStepProps {
    color: string;
    delay: number;
    icon: React.ReactNode;
    children: React.ReactNode;
}

export const InstructionStep: React.FC<InstructionStepProps> = ({
    color,
    delay,
    icon,
    children,
}) => (
    <Animated.View
        entering={FadeInDown.delay(delay).duration(300).springify()}
        style={styles.instructionRow}
    >
        <View style={[styles.stepNumber, { backgroundColor: color }]}>
            {icon}
        </View>
        <View style={styles.instructionContent}>
            {children}
        </View>
    </Animated.View>
);


