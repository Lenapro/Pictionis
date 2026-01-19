import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScoreComponent = ({ score, seconds }) => {
    return (
        <View style={styles.scoreArea}>
            <Text style={styles.scoreText}>Score : {score}</Text>
            <Text style={styles.timerText}>Chronomètre : {Math.floor(seconds/60)}:{String(seconds%60).padStart(2, '0')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    scoreArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#008080',
        borderRadius: 15,
        padding: 12,
    },
    scoreText: {
        color: '#FFC107',
        fontSize: 16,
    },
    timerText: {
        color: '#8BC34A',
        fontSize: 16,
    }
});

export default ScoreComponent;
