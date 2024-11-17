// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCSaV172eht5nwdkvw3oMYU2bnLFcKp2lY",
    authDomain: "moody-f079c.firebaseapp.com",
    projectId: "moody-f079c",
    storageBucket: "moody-f079c.firebasestorage.app",
    messagingSenderId: "981886508143",
    appId: "1:981886508143:web:92012b2600f50cb47bc19a",
    measurementId: "G-TV7WYTP571"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
