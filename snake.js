
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startSnake');
const scoreDisplay = document.getElementById('scoreDisplay');
const showHighscoresButton = document.getElementById('showHighscores');
const closeHighscoresButton = document.getElementById('closeHighscores');
const highscoreModal = document.getElementById('highscoreModal');
const saveScoreModal = document.getElementById('saveScoreModal');
const finalScoreDisplay = document.getElementById('finalScoreDisplay');
const playerNameInput = document.getElementById('playerName');
const saveScoreButton = document.getElementById('saveScore');
const cancelSaveButton = document.getElementById('cancelSave');

const box = 20;
const canvasSize = 15;
let snake = [];
let direction = null;
let food = {};
let gameInterval = null;
let score = 0;
let gameActive = false;

function resetGame() {
    snake = [{ x: 7, y: 7 }];
    direction = null;
    score = 0;
    updateScoreDisplay();
    placeFood();
    clearInterval(gameInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    gameActive = false;
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Punkty: ${score}`;
}

function placeFood() {
    const possiblePositions = [];
    for (let x = 0; x < canvasSize; x++) {
        for (let y = 0; y < canvasSize; y++) {
            if (!snake.some(segment => segment.x === x && segment.y === y)) {
                possiblePositions.push({ x, y });
            }
        }
    }
    if (possiblePositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * possiblePositions.length);
        food = possiblePositions[randomIndex];
    }
}

function draw() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#2dd4bf' : '#a5f3fc';
        ctx.fillRect(snake[i].x * box, snake[i].y * box, box - 1, box - 1);
    }

    ctx.fillStyle = '#f87171';
    ctx.fillRect(food.x * box, food.y * box, box - 1, box - 1);
}

function update() {
    if (!direction || !gameActive) return;

    let head = { ...snake[0] };

    if (direction === 'LEFT') head.x--;
    if (direction === 'RIGHT') head.x++;
    if (direction === 'UP') head.y--;
    if (direction === 'DOWN') head.y++;

    if (
        head.x < 0 ||
        head.x >= canvasSize ||
        head.y < 0 ||
        head.y >= canvasSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameActive = false;
        clearInterval(gameInterval);
        checkHighScore(score);
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScoreDisplay();
        placeFood();
    } else {
        snake.pop();
    }

    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }

    draw();
}

function checkHighScore(score) {
    scoresRef
        .orderByChild('score')
        .limitToLast(10)
        .once('value', snapshot => {
            const highscores = [];
            snapshot.forEach(childSnapshot => {
                highscores.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });

            highscores.sort((a, b) => b.score - a.score);

            if (highscores.length < 10 || score > highscores[highscores.length - 1].score) {
                showSaveScoreModal(score);
            } else {
                alert(`Koniec gry! Twój wynik: ${score}`);
            }
        });
}

function showSaveScoreModal(score) {
    finalScoreDisplay.textContent = `Twój wynik: ${score}`;
    saveScoreModal.classList.remove('hidden');
    playerNameInput.focus();
}

function saveHighScore() {
	const playerName = playerNameInput.value.trim().slice(0, 20) || 'Anonim';

	const newScore = {
		name: playerName,
		score: Math.min(score, 9999),
		date: Date.now()
	};

	scoresRef.push(newScore)
		.then(() => {
			saveScoreModal.classList.add('hidden');
			loadHighScores();
			highscoreModal.classList.remove('hidden');
		})
		.catch(error => {
			console.error('Błąd zapisu wyniku:', error);
			alert('Wystąpił błąd przy zapisie wyniku.');
		});
}

function loadHighScores() {
    scoresRef
        .orderByChild('score')
        .limitToLast(10)
        .once('value', snapshot => {
            const highscores = [];
            snapshot.forEach(childSnapshot => {
                highscores.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });

            highscores.sort((a, b) => b.score - a.score);

            const highscoresTable = document.getElementById('highscoresTable');
            highscoresTable.innerHTML = '';

            highscores.forEach((score, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td class="p-2 border-b border-gray-200">${index + 1}</td>
                <td class="p-2 border-b border-gray-200">${score.name}</td>
                <td class="p-2 border-b border-gray-200 text-right">${score.score}</td>
            `;
                highscoresTable.appendChild(row);
            });
        });
}

document.addEventListener('keydown', event => {
    if (!gameActive) return;

    const key = event.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        event.preventDefault();
    }

    if (key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

function addControl(buttonId, newDirection, oppositeDirection) {
    const button = document.getElementById(buttonId);
    const handler = () => {
        if (direction !== oppositeDirection) {
            direction = newDirection;
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }
    };
    button.addEventListener('click', handler);
    button.addEventListener('touchstart', handler);
}

addControl('upButton', 'UP', 'DOWN');
addControl('downButton', 'DOWN', 'UP');
addControl('leftButton', 'LEFT', 'RIGHT');
addControl('rightButton', 'RIGHT', 'LEFT');

startButton.addEventListener('click', () => {
    resetGame();
    gameActive = true;
    direction = 'RIGHT';
    gameInterval = setInterval(update, 150);
});

showHighscoresButton.addEventListener('click', () => {
    loadHighScores();
    highscoreModal.classList.remove('hidden');
});

closeHighscoresButton.addEventListener('click', () => {
    highscoreModal.classList.add('hidden');
});

saveScoreButton.addEventListener('click', saveHighScore);

cancelSaveButton.addEventListener('click', () => {
    saveScoreModal.classList.add('hidden');
});

resetGame();
