import { getDatabase, ref, onValue, get, set, push } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { database } from '../../config/firebaseConfig';

export const onUserChange = (callback) => {
    const auth = getAuth();
    return onAuthStateChanged(auth, callback);
};

export const getGameRef = (gameCode) => {
    return ref(database, 'games/' + gameCode);
};

export const updateCurrentRound = async (gameCode, newRound) => {
    const gameRef = getGameRef(gameCode);
    return set(ref(gameRef, 'currentRound'), newRound);
};

export const listenToGame = (gameCode, callback) => {
    const gameRef = getGameRef(gameCode);
    return onValue(gameRef, callback);
};

export const listenToScores = (gameCode, callback) => {
    const scoresRef = ref(getDatabase(), `games/${gameCode}/teams`);
    return onValue(scoresRef, callback);
};

export const fetchGame = async (gameCode) => {
    const gameRef = getGameRef(gameCode);
    const snapshot = await get(gameRef);
    return snapshot.exists() ? snapshot.val() : null;
};

export const createNewGame = async (initialState) => {
    const gamesRef = ref(database, 'games');
    const newGameRef = push(gamesRef);
    await set(newGameRef, initialState);
    return newGameRef.key;
};

export const updateGameData = async (gameCode, dataToUpdate) => {
    const gameRef = getGameRef(gameCode);
    try {
        await update(gameRef, dataToUpdate);
        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des données du jeu:', error);
        return false;
    }
};