import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyApSOdy5izghDJtiBH1gqNI52M6VCKFWNY",
  authDomain: "niya-coach.firebaseapp.com",
  projectId: "niya-coach",
  storageBucket: "niya-coach.firebasestorage.app",
  messagingSenderId: "535848352139",
  appId: "1:535848352139:web:083c2cb69fef97c8bf578e",
  measurementId: "G-95S5WHMQ9N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
