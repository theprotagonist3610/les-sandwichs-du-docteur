// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
//cloudinary API

export const cloudinaryConfig = {
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  preset: import.meta.env.VITE_CLOUDINARY_PRESET,
  key: import.meta.env.VITE_CLOUDINARY_KEY,
  secret: import.meta.env.VITE_CLOUDINARY_SECRET,
  url: import.meta.env.VITE_CLOUDINARY_URL,
};
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
