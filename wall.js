import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const form = document.getElementById('surveyForm');
const input = document.getElementById('answerInput');
const email = document.getElementById('emailInput');
const wall = document.getElementById('wall');
const sectionButtons = document.querySelectorAll('.sections button');
let selectedSection = null;
let zIndexCounter = 1;

const notesRef = collection(db, 'messages');

if (sectionButtons.length) {
  sectionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedSection = btn.dataset.section;
      form.style.display = 'block';
      btn.parentElement.style.display = 'none';
    });
  });
}

// 🔄 Submit answer
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    const emailValue = email.value.trim();

    if (message && emailValue && selectedSection) {
      await addDoc(notesRef, {
        text: message,
        section: selectedSection,
        email: emailValue,
        x: Math.random() * (wall?.clientWidth || 600),
        y: Math.random() * (wall?.clientHeight || 400)
      });

      input.value = '';
      email.value = '';
      alert('Submitted!');
    }
  });
}

// 🧲 Show results if wall is on page
if (wall) {
  onSnapshot(notesRef, snapshot => {
    wall.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const note = document.createElement('div');
      note.className = `note ${getSectionClass(data.section)}`;
      note.textContent = data.text;
      note.style.left = `${data.x}px`;
      note.style.top = `${data.y}px`;
      makeDraggable(note);
      wall.appendChild(note);
    });
  });
}

function getSectionClass(section) {
  switch (section) {
    case 'Section A': return 'A';
    case 'Section B': return 'B';
    case 'Section C': return 'C';
    case 'Section D': return 'D';
    default: return '';
  }
}

// 🖐 Drag & Drop
function makeDraggable(el) {
  let offsetX, offsetY, isDragging = false;

  el.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.zIndex = ++zIndexCounter;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    el.style.left = `${e.clientX - offsetX}px`;
    el.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => isDragging = false);

  el.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - el.offsetLeft;
    offsetY = touch.clientY - el.offsetTop;
    el.style.zIndex = ++zIndexCounter;
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    el.style.left = `${touch.clientX - offsetX}px`;
    el.style.top = `${touch.clientY - offsetY}px`;
  }, { passive: false });

  document.addEventListener('touchend', () => isDragging = false);
}
