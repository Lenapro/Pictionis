export const setTeams = teams => ({
    type: 'SET_TEAMS',
    payload: teams,
});

export const setHostEmail = email => ({
    type: 'SET_HOST_EMAIL',
    payload: email,
});

export const setGameState = state => ({
    type: 'SET_GAME_STATE',
    payload: state,
});
