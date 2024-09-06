// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDL2Yp18iFkM-J79YL-aKR3wqV_c1yzRg",
  authDomain: "battle-leetcode.firebaseapp.com",
  projectId: "battle-leetcode",
  storageBucket: "battle-leetcode.appspot.com",
  messagingSenderId: "604374284782",
  appId: "1:604374284782:web:49793741427ffe0cda36ff",
  measurementId: "G-TGXDHSCSGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const database = getDatabase(app);
