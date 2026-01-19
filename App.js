import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './config/firebaseConfig';
import { Provider } from 'react-redux';
import store from './screen/store';
import { onAuthStateChanged } from "firebase/auth";

// Importez vos écrans ici
import RegisterScreen from './screen/auth/RegisterScreen';
import LoginScreen from './screen/auth/LoginScreen';
import HomeScreen from './screen/home/HomeScreen';
import RulesScreen from './screen/rules/RulesScreen';
import ScoresScreen from './screen/game/ScoresScreen';
import LobyScreen from './screen/lobby/LobyScreen';
import GameScreen from './screen/game/GameScreen';  
import TeamsScreen from './screen/team/TeamsScreen';
import GameArea from './screen/game/GameArea';
import WordSelectionScreen from "./screen/game/WordSelectionScreen";

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

const AuthNavigator = () => (
    <AuthStack.Navigator initialRouteName="Connexion">
        <AuthStack.Screen name="Inscription" component={RegisterScreen} />
        <AuthStack.Screen name="Connexion" component={LoginScreen} />
    </AuthStack.Navigator>
);

const AppNavigator = () => (
    <AppStack.Navigator initialRouteName="Menu">
        <AppStack.Screen name="Menu" component={HomeScreen} />
        <AppStack.Screen name="Règles" component={RulesScreen} />
        <AppStack.Screen name="Scores" component={ScoresScreen} />
        <AppStack.Screen name="Lobby" component={LobyScreen} />
        <AppStack.Screen name="Teams" component={TeamsScreen} />
        <AppStack.Screen name="Game" component={GameScreen} />
        <AppStack.Screen name="GameArea" component={GameArea} />
        <AppStack.Screen name="WordSelection" component={WordSelectionScreen} />
    </AppStack.Navigator>
);

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            if (initializing) setInitializing(false);
        });

        return () => unsubscribe();
    }, [initializing]);

    if (initializing) return null;

    return (
        <Provider store={store}>
            <NavigationContainer>
                {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
            </NavigationContainer>
        </Provider>
    );
};

export default App;