
// wall.js
import { db } from './firebase-config.js';
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// For posting a message
export async function postMessage(message) {
  if (!message.trim()) return;
  await addDoc(collection(db, "notes"), {
    message: message,
    created: Date.now()
  });
}

// For fetching all messages
export async function fetchMessages(callback) {
  const querySnapshot = await getDocs(collection(db, "notes"));
  querySnapshot.forEach(doc => {
    callback(doc.data());
  });
}
