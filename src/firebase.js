// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Ganti dengan konfigurasi dari Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyD-_mKHP7mV8OzVjau1edZ8j43vVa7zrQ0",
    authDomain: "peserta-cpns-disdik-4bb1d.firebaseapp.com",
    projectId: "peserta-cpns-disdik-4bb1d",
    storageBucket: "peserta-cpns-disdik-4bb1d.firebasestorage.app",
    messagingSenderId: "445511902833",
    appId: "1:445511902833:web:e369df9eb1dab482731dd0",
    measurementId: "G-FJYX1MPGLF"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore
const db = getFirestore(app);

// Ekspor agar bisa digunakan di file lain
export { db };
