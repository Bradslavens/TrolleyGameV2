require('dotenv').config();

// In-memory storage for lines and signals
const lines = {};

// Function to add a line
function addLine(lineName, callback) {
    if (!lines[lineName]) {
        lines[lineName] = [];
        callback(null, `Line ${lineName} added successfully.`);
    } else {
        callback(new Error(`Line ${lineName} already exists.`));
    }
}

// Function to get all lines
function getLines(callback) {
    const lineNames = Object.keys(lines);
    callback(null, lineNames);
}

// Function to add a signal
function addSignal(lineName, signalName, callback) {
    if (lines[lineName]) {
        lines[lineName].push(signalName);
        callback(null, `Signal ${signalName} added to ${lineName} successfully.`);
    } else {
        callback(new Error(`Line ${lineName} not found.`));
    }
}

// Function to get signals for a line
function getSignals(lineName, callback) {
    if (lines[lineName]) {
        callback(null, lines[lineName]);
    } else {
        callback(new Error(`Line ${lineName} not found.`));
    }
}

// Express Server to Handle Requests

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Add Line Endpoint
app.post('/add-line', (req, res) => {
    const lineName = req.body.lineName;
    addLine(lineName, (err, message) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json({ message });
    });
});

// Get Lines Endpoint
app.get('/get-lines', (req, res) => {
    getLines((err, lines) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(lines);
    });
});

// Add Signal Endpoint
app.post('/add-signal', (req, res) => {
    const { lineName, signalName } = req.body;
    addSignal(lineName, signalName, (err, message) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json({ message });
    });
});

// Get Signals Endpoint
app.get('/get-signals', (req, res) => {
    const lineName = req.query.lineName;
    getSignals(lineName, (err, signals) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(signals);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
