import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Update to use a single collection, 'notes'
const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');
const wall = document.getElementById('wall');

// Reference to the 'notes' collection
const notesRef = collection(db, 'notes'); 

let zIndexCounter = 1;

// 📝 Add new message to Firestore
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    // Adding the message to the 'notes' collection
    await addDoc(notesRef, {
      text: message,
      x: Math.random() * (wall.clientWidth - 180),
      y: Math.random() * (wall.clientHeight - 120)
    });
    input.value = ''; // Clear input after submission
  }
});

// 📡 Real-time listener
onSnapshot(notesRef, snapshot => {
  wall.innerHTML = ''; // Clear the wall before adding new notes
  snapshot.forEach(doc => {
    const data = doc.data();
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = data.text;
    note.style.left = `${data.x}px`;
    note.style.top = `${data.y}px`;
    makeDraggable(note);
    wall.appendChild(note); // Add note to wall
  });
});

// 🎯 Make notes draggable
function makeDraggable(element) {
  let offsetX, offsetY, isDragging = false;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    element.style.zIndex = ++zIndexCounter;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    element.style.left = (e.clientX - offsetX) + 'px';
    element.style.top = (e.clientY - offsetY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // 🖐 Touch support
  element.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - element.offsetLeft;
    offsetY = touch.clientY - element.offsetTop;
    element.style.zIndex = ++zIndexCounter;
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    element.style.left = (touch.clientX - offsetX) + 'px';
    element.style.top = (touch.clientY - offsetY) + 'px';
  }, { passive: false });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });
}
