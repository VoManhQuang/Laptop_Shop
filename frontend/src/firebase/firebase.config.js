// src/firebase/firebase.config.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjCLiqVX6_XYjCwIi5VvNh88RFUi9GVEQ",
  authDomain: "laptopshop-9c8ec.firebaseapp.com",
  projectId: "laptopshop-9c8ec",
  storageBucket: "laptopshop-9c8ec.firebasestorage.app",
  messagingSenderId: "576558253756",
  appId: "1:576558253756:web:895e0bba65eb748e30f2b9",
  measurementId: "G-9LWL65M0R8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
