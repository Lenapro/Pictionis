import React, {useState, useEffect, useCallback, useRef} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { get, ref, set, onValue, off, push } from 'firebase/database';
import { collection, addDoc, query, orderBy, limit, onSnapshot, doc, getDoc, where } from "firebase/firestore";
import { firestore, auth, database } from '../../config/firebaseConfig';
import { TouchableWithoutFeedback, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScoreComponent from './ScoreComponent';
import ChatComponent from './ChatComponent';
import GuessComponent from './GuessComponent';
import GameArea from './GameArea';

const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const GameScreen = ({ route }) => {

    const selectedWord = route.params?.selectedWord || 'Mot inconnu';
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userTeam, setUserTeam] = useState('');
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [seconds, setSeconds] = useState(120);
    const [intervalId, setIntervalId] = useState(null);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [isWordGuessedCorrectly, setIsWordGuessedCorrectly] = useState(false);
    const [gameCode, setGameCode] = useState(null);
    const [teamStatus, setTeamStatus] = useState('');
    const [gameEnded, setGameEnded] = useState(false);
    const [localGameState, setLocalGameState] = useState(null);
    const [gameData, setGameData] = useState(null);

    const toggleModalVisibility = () => {
        setModalVisible(!modalVisible);
    };
    const [userTeamId, setUserTeamId] = useState(null);

    useEffect(() => {
        const getGameDataFromAsyncStorage = async () => {
            try {
                const storedGameData = await AsyncStorage.getItem('@gameData');
                if (storedGameData) {
                    const parsedGameData = JSON.parse(storedGameData);
                    setGameData(parsedGameData);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de gameData depuis AsyncStorage:", error);
            }
        };

        getGameDataFromAsyncStorage();
    }, []);

    //useEffect(() => {
    //    if (gameCode) {
    //        const currentRound = ref(database, `games/${gameCode}/currentRound`);
    //        const roundListener = onValue(currentRound, snapshot => {
    //            if (snapshot.exists()) {
    //                setRound(snapshot.val() || 1);
    //            } else {
    //                console.error("Le champ 'currentRound' n'existe pas pour le jeu en cours.");
    //            }
    //        });
//
    //        return () => off(currentRound, roundListener);
    //    }
    //}, [gameCode]);

    useEffect(() => {
        if (auth.currentUser) {
            setUserEmail(auth.currentUser.email);
            const userDoc = doc(firestore, 'users', auth.currentUser.email);
            getDoc(userDoc).then((docSnap) => {
                if (docSnap.exists()) {
                    setUserTeam(docSnap.data().team || '');
                }
            });
        }
    }, [auth]);

    useEffect(() => {
        //if (userTeam) {
            const q = query(
                collection(firestore, 'messages'),
                where("team", "==", userTeam),
                orderBy('timestamp', 'desc'),
                limit(20)
           );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedMessages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMessages(fetchedMessages);
            });

            return () => unsubscribe();
       // }
    });


    useEffect(() => {
        if (gameData && auth.currentUser) {
            // Convertissez l'objet des équipes en un tableau des valeurs de l'équipe
            const teamsArray = Object.values(gameData.teams);

            // Ensuite, vous pouvez rechercher dans le tableau
            const team = teamsArray.find(team => team.players && team.players.includes(auth.currentUser.email));

            if (team) {
                setUserTeamId(team.id);
            }
        }
    }, [gameData, auth.currentUser]);



    useEffect(() => {
        const fetchAndSetState = async () => {
            const gameStateFromAsyncStorage = await fetchGameState();
            if (gameStateFromAsyncStorage) {
                setLocalGameState(gameStateFromAsyncStorage);
            }
        };
        fetchAndSetState();
    }, []);

    useEffect(() => {
        if (isWordGuessedCorrectly || seconds === 0) {
            setModalVisible(true);
            nextRound();
        }
    }, [isWordGuessedCorrectly, seconds]);


    useEffect(() => {
        async function getGameCode() {
            const storedGameCode = await AsyncStorage.getItem('gameCode');
            console.log('Fetched gameCode from AsyncStorage:', storedGameCode);
            if (storedGameCode) {
                setGameCode(storedGameCode);
            } else {
                console.log('No game code found in AsyncStorage');
            }
        }
        getGameCode();
    }, []);

    useEffect(() => {
        if (userTeam) {
            const teamStatusRef = ref(database, `games/${gameCode}/teams/${userTeam}/teamStatus`);
            const statusListener = onValue(teamStatusRef, snapshot => {
                setTeamStatus(snapshot.val() || '');
            });

            return () => off(teamStatusRef, statusListener);
        }
    }, [userTeam, gameCode]);

    useEffect(() => {
        if (selectedWord) {
            const id = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);

            setIntervalId(id);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [selectedWord, round]);

    const prevTeamStatusRef = useRef();
    useEffect(() => {
        prevTeamStatusRef.current = teamStatus;
    }, [teamStatus]);

    useEffect(() => {
        if (seconds === 0) {
            clearInterval(intervalId);
        }
    }, [seconds]);

    useEffect(() => {
        if (auth.currentUser) {
            const userEmailAssaini = assainirEmail(auth.currentUser.email);
            setUserEmail(auth.currentUser.email);

            const userRef = ref(database, 'users/' + userEmailAssaini);

            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setUserTeam(data.team || '');
                }
            });
        }
    }, [auth]);


    useEffect(() => {
        if (userTeam) {
            const fetchScore = async () => {
                try {
                    const scoreRef = ref(database, 'scores/' + userTeam);
                    const snapshot = await get(scoreRef);

                    if (snapshot.exists()) {
                        setScore(snapshot.val().score || 0);
                    } else {
                        console.error("Le document n'existe pas.");
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération du score :", error);
                }
            };

            fetchScore();
        }
    }, [userTeam]);

    useEffect(() => {
        if (teamStatus === 'someStatus') {
            const id = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);

            setIntervalId(id);
        }
    }, [teamStatus]);
    useEffect(() => {
        const prevTeamStatus = prevTeamStatusRef.current;

        if (prevTeamStatus !== teamStatus) {
            if (teamStatus === 'guessing') {
                const id = setInterval(() => {
                    setSeconds(prevSeconds => prevSeconds - 1);
                }, 1000);

                setIntervalId(id);
            } else if (teamStatus === 'drawing') {
                clearInterval(intervalId);
                setSeconds(ROUND_DURATION);
                setRound(prevRound => prevRound + 1);
            }
        }
    }, [teamStatus]);

    function assainirEmail(email) {
        return email.replace(/\./g, ',');
    }

    function desassainirEmail(emailAssaini) {
        return emailAssaini.replace(/,/g, '.');
    }

    const fetchGameState = async () => {
        try {
            const savedState = await AsyncStorage.getItem('@gameState');
            if (savedState !== null) {
                return JSON.parse(savedState);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du gameState:", error);
        }
        return null;
    };
    const nextRound = () => {
        if (round >= 5) {
            setGameEnded(true);
            setModalVisible(true);
            setModalTitle("Game Over");
            setModalMessage(`The winning team is: ${userTeamId}`);
            return;
        }

        setRound(prevRound => prevRound + 1);
        setSeconds(ROUND_DURATION);
        setIsWordGuessedCorrectly(false);

        if (gameEnded) {
            const gameStatusRef = ref(database, `games/${gameCode}/state`);
            set(gameStatusRef, "ended");
        }

    };
    const ROUND_DURATION = 120;
    const updateScore = async (gameCode, teamId, pointsToAdd) => {
        if(typeof gameCode !== 'string' || gameCode === "") {
            console.error("gameCode is not valid:", gameCode);
            return;
        }
        try {
            const teamRef = ref(database, `games/${gameCode}/teams/${teamId}/score`);
            const snapshot = await get(teamRef);

            if (snapshot.exists()) {
                const currentScore = snapshot.val();
                const newScore = currentScore + pointsToAdd;

                await set(teamRef, newScore);
            } else {
                console.error("Team does not exist.");
            }
        } catch (error) {
            console.error("Error updating team score: ", error);
        }
    };

    const sendMessage = async () => {
        if (inputText.trim().length > 0) {
            try {
                await addDoc(collection(firestore, 'messages'), {
                    text: inputText,
                    userEmail: userEmail,
                    team: userTeam,
                    timestamp: new Date(),
                });
                setInputText('');
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.roundText}>Round: {round}</Text>
                {teamStatus === 'drawing' && <Text style={styles.selectedWordText}>Mot à dessiner: {selectedWord}</Text>}
                <ScoreComponent score={score} seconds={seconds} />
                <TouchableWithoutFeedback onLongPress={() => teamStatus === 'drawing' ? navigation.navigate('GameArea') : null}>
                    <View style={styles.drawingArea}>
                        <GameArea />
                    </View>
                </TouchableWithoutFeedback>

                {teamStatus !== 'drawing' && (
                    <GuessComponent
                        gameCode={gameCode}
                        userTeam={userTeamId}
                        selectedWord={selectedWord}
                        updateScore={updateScore}
                        currentRound={gameData ? gameData.currentRound : null}

                    />
                )}

            <ChatComponent
                gameCode={gameCode}
                messages={messages}
                inputText={inputText}
                setInputText={setInputText}
                sendMessage={sendMessage}
            />

                <FontAwesome
                    name="plus-circle"
                    size={30}
                    color="#900"
                    onPress={toggleModalVisibility}
                />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Voulez-vous continuer ou quitter?</Text>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>Continuer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quitButton}
                            onPress={() => {
                                navigation.goBack();
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>Quitter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: 'white',
        padding: 10,
    },
    chatArea: {
        flex: 3,
        backgroundColor: '#20B2AA',
        borderRadius: 15,
        marginVertical: 10,
        padding: 32,
    },
    messages: {
        flex: 6,
        backgroundColor: '#E0FFFF',
        borderRadius: 15,
        margin: 1,
        padding: 17,
    },
    messageContainer: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    emailText: {
        fontSize: 13,
        color: '#20B2AA',
        marginBottom: 5,
    },
    messageText: {
        fontSize: 15,
        color: '#000000',
        borderRadius: 8,
        padding: 8,
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderRadius: 30,
        marginVertical: 5,
        paddingHorizontal: 20,
        height: 50,
    },
    inputText: {
        flex: 1,
        backgroundColor: '#008080',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 40,
        color: '#FAFAFA',
    },
    sendButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#1FAB89',
        borderRadius: 25,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
    },
    answerArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#e8e8e8',
        borderRadius: 12,
        margin: 10,
    },
    drawingArea: {
        flex: 8,
        backgroundColor: '#E0FFFF',
        borderRadius: 15,
        marginVertical: 10,
        borderColor: '#008B8B',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    selectedWordText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        backgroundColor: '#007575',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#005555',
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
        marginBottom: 20,
        overflow: 'hidden',
    },
    roundText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 1,
        color: '#4a4a4a',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    continueButton: {
        backgroundColor: "#2196F3",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 5
    },
    quitButton: {
        backgroundColor: "red",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
});

export default GameScreen;
