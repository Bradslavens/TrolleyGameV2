require('dotenv').config();


// Firebase configuration      
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain:  process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// Add Line
document.getElementById('addLineButton').addEventListener('click', () => {
    const lineName = document.getElementById('lineName').value;
    if (lineName) {
        database.ref('lines/' + lineName).set({
            name: lineName,
            signals: []
        }).then(() => {
            alert(`Line ${lineName} added successfully.`);
            document.getElementById('lineName').value = '';
            loadLines();
        }).catch(error => {
            console.error("Error writing to database: ", error);
        });
    }
});

// Load lines into the select dropdown
function loadLines() {
    const lineSelect = document.getElementById('lineSelect');
    lineSelect.innerHTML = ''; // Clear current options
    database.ref('lines').once('value', (snapshot) => {
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

// Add Signal
document.getElementById('addSignalButton').addEventListener('click', () => {
    const lineName = document.getElementById('lineSelect').value;
    const signalName = document.getElementById('signalName').value;
    if (lineName && signalName) {
        const lineRef = database.ref('lines/' + lineName + '/signals');
        lineRef.once('value', (snapshot) => {
            const signals = snapshot.val() || [];
            signals.push(signalName);
            lineRef.set(signals).then(() => {
                alert(`Signal ${signalName} added to ${lineName} successfully.`);
                document.getElementById('signalName').value = '';
            }).catch(error => {
                console.error("Error writing to database: ", error);
            });
        }).catch(error => {
            console.error("Error reading from database: ", error);
        });
    }
});

// Load lines on page load
window.onload = loadLines;