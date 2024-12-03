import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC62LdKgBzabWz7jHarV00gN69a23bidoY",
  authDomain: "todo-24af5.firebaseapp.com",
  projectId: "todo-24af5",
  storageBucket: "todo-24af5.firebasestorage.app",
  messagingSenderId: "275275511408",
  appId: "1:275275511408:web:003d15699777a1b20666b5",
  measurementId: "G-JPLYLBKRW6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);