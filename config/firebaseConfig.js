import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDvQhArUEKDibCjLt4tCYxyu4powl4527c",
  authDomain: "pictionary-d84b8-28783.firebaseapp.com",
  databaseURL: "https://pictionary-d84b8-28783-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pictionary-d84b8-28783",
  storageBucket: "pictionary-d84b8-28783.firebasestorage.app",
  messagingSenderId: "479035165864",
  appId: "1:479035165864:web:015a50b613104c9bbbc69d",
  measurementId: "G-WGY1QPYRTN"
};

const app = initializeApp(firebaseConfig);

// 🔥 AUTH : WEB vs NATIVE
let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: AsyncStorage,
  });
}

const database = getDatabase(app);
const firestore = getFirestore(app);

export { auth, database, firestore };
