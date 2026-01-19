import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button } from 'react-native';

const WORDS = ["chat", "chien", "maison", "arbre", "voiture", "ordinateur", "téléphone", "montagne", "océan", "soleil", "banane", "orange", "étoile", "escargot"];

const WordSelectionScreen = ({ navigation, route }) => {
    const { gameCode, teamStatus } = route.params;
    const [customWord, setCustomWord] = useState('');
    const [randomWord, setRandomWord] = useState('');

   /* useEffect(() => {
        if (teamStatus !== 'drawing') {
            navigation.replace('Game', { gameCode: gameCode });
        }
    }, [teamStatus, navigation, gameCode]);*/

    const handleWordSelect = (word) => {
        navigation.replace('Game', { selectedWord: word, gameCode: gameCode });
    };

    const selectRandomWord = () => {
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        setRandomWord(word);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sélectionnez un mot à dessiner</Text>

            <TouchableOpacity style={styles.button} onPress={selectRandomWord}>
                <Text style={styles.buttonText}>Choisir un mot aléatoire</Text>
            </TouchableOpacity>

            {randomWord ? (
                <View style={{alignItems: 'center', marginVertical: 20}}>
                    <Text style={styles.suggestedWord}>Mot suggéré: {randomWord}</Text>
                    <TouchableOpacity style={styles.wordButton} onPress={() => handleWordSelect(randomWord)}>
                        <Text style={styles.wordText}>Dessiner "{randomWord}"</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            <TextInput
                style={styles.input}
                placeholder="Entrez votre propre mot"
                onChangeText={text => setCustomWord(text)}
                value={customWord}
            />

            {customWord ? (
                <TouchableOpacity style={styles.wordButton} onPress={() => handleWordSelect(customWord)}>
                    <Text style={styles.wordText}>Dessiner "{customWord}"</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF3E0',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#FF9F00',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    suggestedWord: {
        fontSize: 20,
        color: '#555',
        marginBottom: 15,
    },
    wordButton: {
        backgroundColor: '#1FAB89',
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        alignItems: 'center',
    },
    wordText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        fontSize: 16,
    },
});

export default WordSelectionScreen;
