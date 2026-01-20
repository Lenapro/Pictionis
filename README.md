# Pictionary - Application Mobile

Une application mobile interactive de Pictionary construite avec React Native, Expo, et Firebase.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du projet](#structure-du-projet)
- [Scripts disponibles](#scripts-disponibles)
- [Utilisation](#utilisation)
- [Technologies utilisées](#technologies-utilisées)

## ✨ Fonctionnalités

- **Authentification Firebase** : Inscription et connexion sécurisées
- **Système de jeu en équipes** : Créez des équipes et jouez ensemble
- **Partie de Pictionary** : Dessinez et deviné des mots en temps réel
- **Chat en direct** : Communiquez avec les autres joueurs pendant la partie
- **Système de scoring** : Suivez les scores de chaque équipe
- **Règles du jeu** : Consultez les règles directement dans l'application
- **Gestion de lobbies** : Créez ou rejoignez des lobbies de jeu
- **Interface intuitive** : Navigation fluide et ergonomique

## 📦 Prérequis

Avant de commencer, assurez-vous que vous avez installé :

- **Node.js** (version 14.0 ou supérieure)
- **npm** ou **yarn**
- **Expo CLI** : `npm install -g expo-cli`
- **Git**

## 🚀 Installation

1. **Clonez le repository** (ou téléchargez le projet)

```bash
cd Pictionary
```

2. **Installez les dépendances**

```bash
npm install
```

ou

```bash
yarn install
```

3. **Vérifiez la configuration Firebase**

Assurez-vous que le fichier `config/firebaseConfig.js` contient vos identifiants Firebase valides.

## ⚙️ Configuration

### Firebase Configuration

Modifiez `config/firebaseConfig.js` avec vos paramètres Firebase :

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

## 📁 Structure du projet

```
Pictionary/
├── App.js                          # Point d'entrée de l'application
├── app.json                        # Configuration Expo
├── package.json                    # Dépendances du projet
├── babel.config.js                 # Configuration Babel
├── assets/
│   ├── mots.txt                   # Liste de mots pour le jeu
│   └── logo-pictionary.png        # Logo de l'application
├── config/
│   └── firebaseConfig.js          # Configuration Firebase
└── screen/
    ├── auth/                       # Écrans d'authentification
    │   ├── LoginScreen.js
    │   └── RegisterScreen.js
    ├── firebase/
    │   └── firebaseService.js      # Services Firebase
    ├── game/                       # Écrans de jeu
    │   ├── ChatComponent.js
    │   ├── GameArea.js
    │   ├── GameScreen.js
    │   ├── GuessComponent.js
    │   ├── ScoreComponent.js
    │   ├── ScoresScreen.js
    │   └── WordSelectionScreen.js
    ├── home/
    │   └── HomeScreen.js           # Écran d'accueil
    ├── lobby/                      # Écrans de lobby
    │   ├── GameActions.js
    │   ├── Header.js
    │   └── LobyScreen.js
    ├── rules/
    │   └── RulesScreen.js          # Écran des règles
    ├── team/
    │   ├── GameModal.js
    │   └── TeamsScreen.js
    └── store/                      # Gestion d'état Redux
        ├── index.js
        ├── teamsActions.js
        └── teamsReducer.js
```

## 📱 Scripts disponibles

### Démarrer en développement
```bash
npm start
```

### Lancer sur Android
```bash
npm run android
```

### Lancer sur iOS
```bash
npm run ios
```

### Lancer sur le web
```bash
npm run web
```

## 🎮 Utilisation

### 1. Inscription / Connexion
- Lancez l'application
- Créez un compte ou connectez-vous avec vos identifiants
- L'authentification est gérée par Firebase

### 2. Accueil
- Accédez au menu principal
- Consultez les règles du jeu
- Visualisez les meilleurs scores

### 3. Créer une partie
- Allez dans "Lobby"
- Créez une nouvelle partie ou rejoignez-en une existante
- Formez des équipes avec d'autres joueurs

### 4. Jouer
- Un joueur dessine pendant que les autres devinent
- Le chat en direct vous permet de communiquer
- Les scores sont mis à jour en temps réel

### 5. Résultats
- Consultez les scores finaux sur l'écran des scores
- Les équipes gagnantes sont mises en évidence

## 🛠️ Technologies utilisées

- **React Native** (0.81.5) - Framework mobile
- **Expo** (~54.0.31) - Plateforme de développement
- **Firebase** (10.4.0)
  - Authentication - Authentification des utilisateurs
  - Firestore - Base de données temps réel
- **React Navigation** (6.x) - Navigation dans l'application
- **Redux** (4.2.1) - Gestion d'état global
- **React Native Gesture Handler** - Gestion des gestes
- **Lottie** - Animations
- **Pixi.js** - Rendu du canvas pour le dessin

## 🔐 Sécurité

- Les mots de passe sont chiffrés par Firebase Authentication
- Les données sont stockées de manière sécurisée dans Firestore
- Les règles de sécurité Firestore sont configurées pour protéger les données des utilisateurs

## 🐛 Dépannage

### Erreur "Component auth has not been registered yet"
- Vérifiez que le `Provider` de Redux enveloppe correctement le `NavigationContainer`
- Vérifiez que tous les écrans sont correctement importés dans `App.js`

### Problèmes de connexion Firebase
- Vérifiez la configuration dans `config/firebaseConfig.js`
- Assurez-vous que votre projet Firebase est actif
- Vérifiez les règles de sécurité Firestore

### Erreurs d'installation des dépendances
```bash
# Supprimez node_modules et réinstallez
rm -rf node_modules
npm install
```
## 🎥 Vidéos de démonstration

https://drive.google.com/file/d/17oySv8gGb5UxTvn6ooyi6luwu2Z3Y449/view?usp=sharing
