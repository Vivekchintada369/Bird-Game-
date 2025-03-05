const gameContainer = document.getElementById('game-container');
const bird = document.getElementById('bird');
const optionsPopup = document.getElementById('options-popup');
const shapeOptions = document.getElementById('shape-options');
const startGameButton = document.getElementById('start-game');
const gameOverPopup = document.getElementById('game-over-popup');
const restartGameButton = document.getElementById('restart-game');
const resetOptionsButton = document.getElementById('reset-options');
const finalScoreDisplay = document.getElementById('final-score');
const highScoreDisplay = document.getElementById('high-score-display');
const scoreDisplay = document.getElementById('current-score');
const playerNameDisplay = document.getElementById('player-name-display');
const playerNameInput = document.getElementById('player-name');

// Bird properties
let birdTop = 200;
let gravity = 0.1;
let jumpStrength = -4;
let downStrength = 0.2;
let momentum = 0;
let birdShape = 'circle';

// Pipe properties
let pipeInterval = 1500;
let pipeSpeed = 2;
let pipeWidth = 50;

// Game variables
let score = 0;
let gameRunning = false;
let playerName = 'Player';
let pipeIntervalId;

// High score variables
let highScore = 0;
let highScorePlayer = '';

// Function to update bird position
function updateBird() {
    momentum += gravity;
    birdTop += momentum;
    bird.style.top = birdTop + 'px';
}

// Function to create pipes
function createPipes() {
    if (!gameRunning) return;

    let pipeHeight = Math.floor(Math.random() * 200) + 50;
    let gapHeight = 150;
    let bottomPipeHeight = gameContainer.offsetHeight - pipeHeight - gapHeight;

    let topPipe = document.createElement('div');
    topPipe.classList.add('pipe');
    topPipe.style.height = pipeHeight + 'px';
    topPipe.style.left = gameContainer.offsetWidth + 'px';
    topPipe.style.top = '0';
    topPipe.style.width = pipeWidth + 'px';
    gameContainer.appendChild(topPipe);

    let bottomPipe = document.createElement('div');
    bottomPipe.classList.add('pipe');
    bottomPipe.style.height = bottomPipeHeight + 'px';
    bottomPipe.style.left = gameContainer.offsetWidth + 'px';
    bottomPipe.style.top = pipeHeight + gapHeight + 'px';
    gameContainer.appendChild(bottomPipe);

    let pipeX = gameContainer.offsetWidth;

    function movePipes() {
        if (!gameRunning) return;

        pipeX -= pipeSpeed;
        topPipe.style.left = pipeX + 'px';
        bottomPipe.style.left = pipeX + 'px';

        // Collision detection
        if (pipeX < 70 && pipeX > 10 && (birdTop < pipeHeight || birdTop + bird.offsetHeight > pipeHeight + gapHeight)) {
            gameOver();
        }

        if (pipeX < -pipeWidth) {
            topPipe.remove();
            bottomPipe.remove();
            score++;
            updateScore();
        } else {
            requestAnimationFrame(movePipes);
        }
    }

    movePipes();
}

// Function to handle jump
function jump() {
    momentum = jumpStrength;
    birdTop += momentum;
    bird.style.top = birdTop + 'px';
}

// Function to handle downward movement
function moveDown() {
    momentum = downStrength;
    birdTop += momentum;
    bird.style.top = birdTop + 'px';
}

// Function to handle game over
function gameOver() {
    gameRunning = false;
    clearInterval(pipeIntervalId);
    finalScoreDisplay.textContent = 'Your Score: ' + score;

    // Check for new high score
    if (score > highScore) {
        highScore = score;
        highScorePlayer = playerName;
    }

    highScoreDisplay.textContent = `High Score: ${highScore} by ${highScorePlayer}`;
    gameOverPopup.style.display = 'block';
}

// Function to update score display
function updateScore() {
    scoreDisplay.textContent = score;
}

// Function to update player name display
function updatePlayerNameDisplay() {
    playerNameDisplay.textContent = `Player: ${playerName}`;
}

// Event listener for key presses
document.addEventListener('keydown', function(event) {
    if (gameRunning) {
        if (event.code === 'Space' || event.key === 'ArrowUp' || event.key === 'Tab') {
            event.preventDefault();
            jump();
        } else if (event.key === 'ArrowDown') {
            moveDown();
        }
    }
});

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    updateBird();

    if (birdTop > gameContainer.offsetHeight || birdTop < 0) {
        gameOver();
    }

    requestAnimationFrame(gameLoop);
}

// Start the game
startGameButton.addEventListener('click', function() {
    optionsPopup.style.display = 'none';
    playerName = playerNameInput.value || 'Player';
    updatePlayerNameDisplay();
    startGame();
});

// Restart the game
restartGameButton.addEventListener('click', function() {
    gameOverPopup.style.display = 'none';
    startGame();
});

// Reset options
resetOptionsButton.addEventListener('click', function() {
    gameOverPopup.style.display = 'none';
    optionsPopup.style.display = 'block';
});

// Shape selection
shapeOptions.addEventListener('click', function(event) {
    if (event.target.classList.contains('shape-option')) {
        // Remove 'selected' class from all shape options
        document.querySelectorAll('.shape-option').forEach(option => option.classList.remove('selected'));

        // Add 'selected' class to the clicked option
        event.target.classList.add('selected');

        birdShape = event.target.dataset.shape;
        updateBirdShape();
    }
});

function updateBirdShape() {
    bird.style.borderRadius = '0';
    bird.style.width = '34px';
    bird.style.height = '24px';
    bird.style.borderStyle = 'none';
    bird.style.borderWidth = '0';
    bird.style.borderColor = 'black';
    bird.style.backgroundColor = 'black';
    bird.textContent = ''; // Clear any text content

    if (birdShape === 'circle') {
        bird.style.borderRadius = '50%';
    } else if (birdShape === 'triangle') {
        bird.style.width = '0';
        bird.style.height = '0';
        bird.style.borderStyle = 'solid';
        bird.style.borderWidth = '17px 20px 0 20px';
        bird.style.borderColor = `black transparent transparent transparent`;
        bird.style.backgroundColor = 'transparent';
    } else if (birdShape === 'rectangle') {
        bird.style.width = '40px';
        bird.style.height = '20px';
    } else if (birdShape === 'oval') {
        bird.style.borderRadius = '50%';
        bird.style.width = '40px';
        bird.style.height = '20px';
    } else if (birdShape === 'square') {
        bird.style.width = '30px';
        bird.style.height = '30px';
        bird.style.borderRadius = '0';
    } else if (birdShape === 'car') {
        bird.textContent = '🚗';
        bird.style.width = 'auto';
        bird.style.height = 'auto';
        bird.style.fontSize = '30px';
        bird.style.backgroundColor = 'transparent';
    } else if (birdShape === 'bike') {
        bird.textContent = '🚲';
        bird.style.width = 'auto';
        bird.style.height = 'auto';
        bird.style.fontSize = '30px';
        bird.style.backgroundColor = 'transparent';
    } else if (birdShape === 'plane') {
        bird.textContent = '✈️';
        bird.style.width = 'auto';
        bird.style.height = 'auto';
        bird.style.fontSize = '30px';
        bird.style.backgroundColor = 'transparent';
    } else if (birdShape === 'train') {
        bird.textContent = '🚂';
        bird.style.width = 'auto';
        bird.style.height = 'auto';
        bird.style.fontSize = '30px';
        bird.style.backgroundColor = 'transparent';
    } else if (birdShape === 'star') {
        bird.textContent = '⭐';
        bird.style.width = 'auto';
        bird.style.height = 'auto';
        bird.style.fontSize = '30px';
        bird.style.backgroundColor = 'transparent';
    } else if (birdShape === 'tree') {
        bird.textContent = '🌲';
        bird.style.width = 'auto';
        bird.style.height = 'auto';
        bird.style.fontSize = '30px';
        bird.style.backgroundColor = 'transparent';
    } else if (birdShape === 'helicopter') {
        bird.textContent = '🚁';
        bird.style.width = 'auto';
        bird.style.height = 'auto';
        bird.style.fontSize = '30px';
        bird.style.backgroundColor = 'transparent';
    }
}

function startGame() {
    // Reset game variables
    score = 0;
    birdTop = 200;
    bird.style.top = birdTop + 'px';
    momentum = 0;
    updateScore();
    updatePlayerNameDisplay();

    // Remove existing pipes
    const pipes = document.querySelectorAll('.pipe');
    pipes.forEach(pipe => pipe.remove());

    // Start the game loop and pipe creation
    gameRunning = true;
    pipeIntervalId = setInterval(createPipes, pipeInterval);
    gameLoop();
}
