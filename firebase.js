// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXITxUrRAxm7A7OiJ5J8ZEuNmm-xDvBMg",
    authDomain: "notes-df73b.firebaseapp.com",
    projectId: "notes-df73b",
    storageBucket: "notes-df73b.appspot.com",
    messagingSenderId: "568101101870",
    appId: "1:568101101870:web:1c90dd89c0ec97fe9a1abf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);
export { app, database, storage }