import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Modal from "react-native-modal";
import{ updateCurrentRound } from '../firebase/firebaseService';

const GuessComponent = ({ gameCode, userTeam, selectedWord, updateScore, currentRound }) => {
    const [isWordGuessedCorrectly, setIsWordGuessedCorrectly] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [guessInputText, setGuessInputText] = useState('');


    const submitAnswer = async (answer) => {
        try {
            const isCorrect = answer.trim().toLowerCase() === selectedWord.toLowerCase();

            if (isCorrect) {
                console.log('gameCode before calling updateScore:', gameCode);
                await updateScore(gameCode, userTeam, 1);
                setIsWordGuessedCorrectly(true);
                setModalTitle("Félicitations!");
                setModalMessage("Vous avez deviné le bon mot!");
                setModalVisible(true);
            } else {
                setIsWordGuessedCorrectly(false);
                setModalTitle("Failed!");
                setModalMessage(`Le mot n'est pas le bon. Le mot correct est: ${selectedWord}`);
                setModalVisible(true);
            }

            const newRound = currentRound + 1;
            await updateCurrentRound(gameCode, newRound);

        } catch (error) {
            console.error("Error submitting answer:", error);
        }
    };
    return (
        <View style={styles.answerArea}>
            <TextInput
                value={guessInputText}
                onChangeText={setGuessInputText}
                style={styles.inputText2}
                placeholder="Guess the word..."
                placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => submitAnswer(guessInputText)} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Guess</Text>
            </TouchableOpacity>

            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{modalTitle}</Text>
                    <Text style={styles.modalMessage}>{modalMessage}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>

    );
};

const colorPalette = {
    primary: '#4CBE99',  // Vert doux
    secondary: '#3E4A59', // Gris foncé
    tertiary: '#F6F8FA', // Gris clair (arrière-plan)
    darkText: '#2B353D',  // Texte foncé
    lightText: '#FFFFFF', // Texte clair
    error: '#FF6B6B',     // Rouge
    border: '#D4D9DE'     // Bordure
}

const styles = StyleSheet.create({
    answerArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        backgroundColor: colorPalette.tertiary,
        borderRadius: 12,
        margin: 10,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Ombre subtile
    },
    inputText2: {
        flex: 3,
        backgroundColor: colorPalette.lightText,
        borderColor: colorPalette.border,
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginRight: 10,
        color: colorPalette.darkText,
    },
    submitButton: {
        flex: 1,
        backgroundColor: colorPalette.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    submitButtonText: {
        color: colorPalette.lightText,
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        backgroundColor: colorPalette.lightText,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: colorPalette.darkText,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: colorPalette.secondary,
    },
    modalButton: {
        backgroundColor: colorPalette.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    modalButtonText: {
        color: colorPalette.lightText,
        fontSize: 16,
    },
});

export default GuessComponent;
