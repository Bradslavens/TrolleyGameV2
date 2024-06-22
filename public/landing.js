// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-JlStmu9VgdctGenkUypiHgBVgjI9yyg",
  databaseURL: "https://trolleygames-babd1-default-rtdb.firebaseio.com/",
  authDomain: "trolleygames-babd1.firebaseapp.com",
  projectId: "trolleygames-babd1",
  storageBucket: "trolleygames-babd1.appspot.com",
  messagingSenderId: "293035773612",
  appId: "1:293035773612:web:2b21b519a2224a52f01909",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();

// Load lines into the select dropdown
function loadLines() {
    const lineSelect = document.getElementById('lineSelect');
    lineSelect.innerHTML = ''; // Clear current options
    get(child(ref(database), 'lines')).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const line = childSnapshot.val();
            const option = document.createElement('option');
            option.value = line.name;
            option.textContent = line.name;
            lineSelect.appendChild(option);
        });
    }).catch(error => {
        console.error("Error reading from database: ", error);
    });
}

// Event listener for the play button
document.getElementById('playButton').addEventListener('click', () => {
    const selectedLine = document.getElementById('lineSelect').value;
    if (selectedLine) {
        // Save the selected line to local storage or session storage
        localStorage.setItem('selectedLine', selectedLine);
        // Redirect to the game page
        window.location.href = 'play.html';
    } else {
        alert('Please select a line to play.');
    }
});

// Load lines on page load
window.onload = loadLines;
