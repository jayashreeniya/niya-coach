import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "copyofniyaburnoutrecove-mfy28w.firebaseapp.com",
  projectId: "copyofniyaburnoutrecove-mfy28w",
  storageBucket: "copyofniyaburnoutrecove-mfy28w.appspot.com",
  messagingSenderId: "455215608733",
  appId: "1:455215608733:web:XXXXXXXXXXXXXXXXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
