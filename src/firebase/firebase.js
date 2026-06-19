import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCM6oVmDvzGVofFZHlU6KBrOcs569ZE4RQ",
  authDomain: "shophub-a72cd.firebaseapp.com",
  projectId: "shophub-a72cd",
  storageBucket: "shophub-a72cd.firebasestorage.app",
  messagingSenderId: "840072569689",
  appId: "1:840072569689:web:400546d8d82ca7e1d02248",
  measurementId: "G-EF84TLYQ9T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
