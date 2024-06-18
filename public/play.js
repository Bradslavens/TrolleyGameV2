const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

const trackWidth = 20;
const scrollSpeed = 2;
const trolleyWidth = 40;
const trolleyHeight = 60;
let trackOffset = 0;
const tracks = [canvas.width / 3, canvas.width / 2, 2 * canvas.width / 3];
let currentTrackIndex = 1; // Start at the center track
let score = 0;
let lives = 3;
let correctTrackIndex = Math.floor(Math.random() * 3);
let countdown = 2; // Countdown in seconds

function getTrolleyY() {
    return window.innerHeight - (window.innerHeight * 0.1) - (1 * window.innerHeight / 100);
}

// Adjust canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Recalculate track positions
    tracks[0] = canvas.width / 3;
    tracks[1] = canvas.width / 2;
    tracks[2] = 2 * canvas.width / 3;
    drawScene();
}

// Draw a single track at the specified x position
function drawTrack(x) {
    context.fillStyle = '#6f4e37'; // Brown for railroad tracks
    for (let y = -canvas.height; y < canvas.height * 2; y += 40) {
        context.fillRect(x - trackWidth / 2, y + trackOffset, trackWidth, 10);
    }
}

// Draw the trolley car
function drawTrolley() {
    const trolleyX = tracks[currentTrackIndex];
    const trolleyY = getTrolleyY();
    context.fillStyle = '#d9534f'; // Red for the trolley car
    context.fillRect(trolleyX - trolleyWidth / 2, trolleyY, trolleyWidth, trolleyHeight);
}

// Draw the signs at the top of the viewport
function drawSigns() {
    const signNames = ["A", "B", "C"];
    context.fillStyle = '#ffffff'; // White for signs
    context.font = '24px Arial';
    context.textAlign = 'center';
    for (let i = 0; i < tracks.length; i++) {
        context.fillText(signNames[i], tracks[i], 50);
    }
}

// Draw the entire scene
function drawScene() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Draw three tracks
    drawTrack(tracks[0]); // Left track
    drawTrack(tracks[1]); // Center track
    drawTrack(tracks[2]); // Right track
    // Draw the trolley car
    drawTrolley();
    // Draw the signs
    drawSigns();
    // Draw the score and lives
    context.fillStyle = '#ffffff';
    context.font = '18px Arial';
    context.textAlign = 'left';
    context.fillText(`Score: ${score}`, 10, 20);
    context.textAlign = 'right';
    context.fillText(`Lives: ${lives}`, canvas.width - 10, 20);
}

// Update the scene
function updateScene() {
    trackOffset += scrollSpeed;
    if (trackOffset >= 40) {
        trackOffset = 0;
    }
    drawScene();
    requestAnimationFrame(updateScene);
}

// Check if the player aligns with the correct track
function checkAlignment() {
    if (currentTrackIndex === correctTrackIndex) {
        score++;
    } else {
        lives--;
    }
    correctTrackIndex = Math.floor(Math.random() * 3);
    countdown = 2;
    if (lives <= 0) {
        alert("Game Over!");
        score = 0;
        lives = 3;
    }
}

// Countdown timer
function startCountdown() {
    setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            checkAlignment();
        }
    }, 1000);
}

// Move the trolley car to the left track
function moveLeft() {
    if (currentTrackIndex > 0) {
        currentTrackIndex--;
        drawScene();
    }
}

// Move the trolley car to the right track
function moveRight() {
    if (currentTrackIndex < tracks.length - 1) {
        currentTrackIndex++;
        drawScene();
    }
}

// Initialize the canvas size
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
requestAnimationFrame(updateScene);
startCountdown();

// Event listeners for buttons
leftButton.addEventListener('click', moveLeft);
rightButton.addEventListener('click', moveRight);

// Event listener for arrow keys
window.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        moveLeft();
    } else if (event.key === 'ArrowRight') {
        moveRight();
    }
});
