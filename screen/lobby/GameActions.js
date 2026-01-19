import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const GameActions = ({ gameCode, setGameCode, createGame, joinGame }) => {
    return (
        <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.button} onPress={createGame} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Créer une nouvelle partie</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>OU</Text>

            <TextInput
                style={styles.input}
                placeholder="Entrez le code de la partie"
                value={gameCode}
                onChangeText={setGameCode}
            />

            <TouchableOpacity style={styles.button} onPress={joinGame} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Rejoindre une partie</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFACD',
        padding: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2E294E',
        fontFamily: 'Georgia',
    },
    logo: {
        width: 130,
        height: 130,
        marginBottom: 30,
        alignSelf: 'center'
    },
    button: {
        backgroundColor: '#1FAB89',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
        width: 260,
        alignItems: 'center',
        marginVertical: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    orText: {
        fontSize: 18,
        color: '#555555',
        marginVertical: 20,
        textAlign: "center"
    },
    input: {
        borderWidth: 2,
        borderColor: '#1FAB89',
        padding: 12,
        width: '85%',
        borderRadius: 12,
        marginBottom: 15,
        paddingLeft: 60,
        fontSize: 16,
        textAlign: "center",
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2.5,
    },
    teamChoiceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    teamButton: {
        backgroundColor: '#D3D3D3',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
        width: 120,
        alignItems: 'center',
        marginVertical: 12,
    },
});

export default GameActions;
