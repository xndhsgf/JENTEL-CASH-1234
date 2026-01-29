
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPC3fnsh9b62yt5EDDiG9e8ABIBKNqocU",
  authDomain: "jentelcash.firebaseapp.com",
  projectId: "jentelcash",
  storageBucket: "jentelcash.firebasestorage.app",
  messagingSenderId: "564126947759",
  appId: "1:564126947759:web:ae64ed7a3beb82339d375a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
