// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Ganti dengan konfigurasi dari Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDq9BhFVqHaylTTJ2rURvYTZ7q5pUdE_Rw",
    authDomain: "peserta-cpns-disdik.firebaseapp.com",
    projectId: "peserta-cpns-disdik",
    storageBucket: "peserta-cpns-disdik.firebasestorage.app",
    messagingSenderId: "1046540445455",
    appId: "1:1046540445455:web:44ea0964addf7fd163807a",
    measurementId: "G-3RSWD9NFZG"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore
const db = getFirestore(app);

// Ekspor agar bisa digunakan di file lain
export { db };
