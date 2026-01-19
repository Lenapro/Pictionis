const initialState = {
    teams: [
        { id: "team1", players: [] },
        { id: "team2", players: [] }
    ],
    hostEmail: null,
    gameState: null,
};

const teamsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TEAMS':
            return { ...state, teams: action.payload };
        case 'SET_HOST_EMAIL':
            return { ...state, hostEmail: action.payload };
        case 'SET_GAME_STATE':
            return { ...state, gameState: action.payload };
        default:
            return state;
    }
};

export default teamsReducer;
