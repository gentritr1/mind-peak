// src/games/flashcue/screens/FlashCueScreen/components/ResultCard.tsx
import * as React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

interface ResultCardProps {
    label: string;
    sublabel: string;
    value: string;
    icon: React.ReactNode;
    iconBg: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
    label,
    sublabel,
    value,
    icon,
    iconBg,
}) => (
    <View style={styles.resultCard}>
        <View style={styles.resultInfo}>
            <Text style={styles.resultLabel}>{label}</Text>
            <Text style={styles.resultSublabel}>{sublabel}</Text>
            <Text style={styles.resultValue}>{value}</Text>
        </View>
        <View style={[styles.resultIcon, { backgroundColor: iconBg }]}>
            {icon}
        </View>
    </View>
);


