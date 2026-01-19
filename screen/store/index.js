import { createStore, combineReducers } from 'redux';
import teamsReducer from './teamsReducer';

const rootReducer = combineReducers({
    teams: teamsReducer
});

const store = createStore(rootReducer);

export default store;
