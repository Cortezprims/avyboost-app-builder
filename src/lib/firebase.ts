import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBywZ0rsZhWB19AgesVRZD3oShnWBrCl3g",
  authDomain: "avyboost.firebaseapp.com",
  projectId: "avyboost",
  storageBucket: "avyboost.firebasestorage.app",
  messagingSenderId: "866515357384",
  appId: "1:866515357384:web:5a5db48f3e2d176f565ffd",
  measurementId: "G-QR82NDP4CM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
