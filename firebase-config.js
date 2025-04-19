// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCi7ZEBHbFxCEteOjvj-5aC7OhtadHwBYo",
  authDomain: "wallofmessages-94b11.firebaseapp.com",
  projectId: "wallofmessages-94b11",
  storageBucket: "wallofmessages-94b11.firebasestorage.app",
  messagingSenderId: "8844212877",
  appId: "1:8844212877:web:d1069b7c1dbc576af8c0c4",
  measurementId: "G-835E8RTBRG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };


