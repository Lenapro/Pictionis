import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameActions from "./GameActions";
import Header from "./Header";
import { ref,get,set,getDatabase } from 'firebase/database';
import { database } from '../../config/firebaseConfig';

import * as firebaseService from '../firebase/firebaseService';
const LobyScreen = ({ navigation }) => {
    const [gameCode, setGameCode] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [score, setScore] = useState({ team1: 0, team2: 0 });
    const [gameData, setGameData] = useState(null);
    const [gameState, setGameState] = useState(null);

    const saveGameData = async (gameData) => {
        try {
            await AsyncStorage.setItem('@gameData', JSON.stringify(gameData));
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de gameData:", error);
        }
    };

    useEffect(() => {
        saveGameData(gameData);
    }, [gameData]);

    const saveGameState = async (gameState) => {
        try {
            await AsyncStorage.setItem('@gameState', JSON.stringify(gameState));
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du gameState:", error);
        }
    };

    useEffect(() => {
        saveGameState({ gameCode, currentUser, score, gameData, gameState });
    }, [gameCode, currentUser, score, gameData, gameState]);


    const saveGameCode = useCallback(async (code) => {
        try {
            await AsyncStorage.setItem('gameCode', code);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de gameCode:", error);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = firebaseService.onUserChange(user => {
            setCurrentUser(user || null);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!gameCode) return;

        const unsubscribeScores = firebaseService.listenToScores(gameCode, (snapshot) => {
            if (snapshot.exists()) {
                const teamsData = snapshot.val();
                setScore({
                    team1: teamsData.find(team => team.id === "team1").score,
                    team2: teamsData.find(team => team.id === "team2").score,
                });
            }
        });

        const unsubscribeGame = firebaseService.listenToGame(gameCode, (snapshot) => {
            if (snapshot.exists()) {
                setGameData(snapshot.val());
            }
        });

        return () => {
            unsubscribeScores();
            unsubscribeGame();
        };
    }, [gameCode]);

    useEffect(() => {
        if (gameData && gameData.currentRound > gameData.totalRounds) {
            alert("Le jeu est terminé !");
            navigation.navigate('EndGameScreen', { score });
        }
    }, [gameData, navigation, score]);


    useEffect(() => {
        const updateGameDataAsync = async () => {
            if (!gameData) return;
            if (gameData.currentRound > gameData.totalRounds) {
                setGameState("ended");
                await firebaseService.updateGameData(gameCode, {
                    state: "ended",
                    teams: {
                        team1: { ...gameData.teams.team1, teamStatus: "ended" },
                        team2: { ...gameData.teams.team2, teamStatus: "ended" }
                    }
                });
            } else if (gameData.currentRound % 2 === 0 && gameData.currentDrawer !== "team2") {
                await firebaseService.updateGameData(gameCode, {
                    currentDrawer: "team2",
                    currentGuessers: ["team1"],
                    state: "drawing",
                    teams: {
                        team1: { ...gameData.teams.team1, teamStatus: "guessing" },
                        team2: { ...gameData.teams.team2, teamStatus: "drawing" }
                    }
                });
            } else if (gameData.currentRound % 2 !== 0 && gameData.currentDrawer !== "team1") {
                await firebaseService.updateGameData(gameCode, {
                    currentDrawer: "team1",
                    currentGuessers: ["team2"],
                    state: "guessing",
                    teams: {
                        team1: { ...gameData.teams.team1, teamStatus: "drawing" },
                        team2: { ...gameData.teams.team2, teamStatus: "guessing" }
                    }
                });
            }
        };

        updateGameDataAsync();

    }, [gameData, gameCode]);

    const createGame = async () => {
        try {
            const initialState = {
                gameCode: gameCode,
                state: "waiting",
                host: currentUser.email,
                currentRound: 1,
                totalRounds: 5,
                currentDrawer: "team1",
                currentGuessers: ["team2"],
                drawingData: null,
                guess: '',
                timer: 120,
                teams: [
                    { id: "team1", players: [currentUser.email], score: 0, teamStatus: "drawing" },
                    { id: "team2", players: [], score: 0, teamStatus: "guessing" }
                ]
            };

            const newGameCode = await firebaseService.createNewGame(initialState);
            saveGameCode(newGameCode)
            setGameCode(newGameCode);
            navigation.navigate('Teams', { gameCode: newGameCode, userId: currentUser.uid, userEmail: currentUser.email });
        } catch (error) {
            alert("Une erreur est survenue lors de la création de la partie. Veuillez réessayer.");
            console.error("Error creating game:", error);
        }
    };
    const joinGame = async () => {
        const gameStatusRef = ref(database, `games/${gameCode}/state`);
        const snapshot = await get(gameStatusRef);
        if (snapshot.val() === "ended" || gameState === "ended") {
            alert("La partie est déjà terminée!");
            return;
        }

        if (!gameCode) {
            alert("Veuillez fournir un code de partie.");
            return;
        }

        try {
            const gameData = await firebaseService.fetchGame(gameCode);

            if (!gameData) {
                alert("La partie avec le code donné n'existe pas. Veuillez vérifier et réessayer.");
                return;
            }

            navigation.navigate('Teams', { gameCode, userId: currentUser.uid, userEmail: currentUser.email });
        } catch (error) {
            alert("Une erreur est survenue lors de la tentative de rejoindre la partie. Veuillez réessayer.");
            console.error("Error joining game:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <GameActions
                gameCode={gameCode}
                setGameCode={setGameCode}
                createGame={createGame}
                joinGame={joinGame}
            />
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
    },
    input: {
        borderWidth: 2,
        borderColor: '#1FAB89',
        padding: 12,
        width: '85%',
        borderRadius: 12,
        marginBottom: 15,
        fontSize: 16,
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

export default LobyScreen;