document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const gapSize = 2;
    let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    let direction = { x: 0, y: 0 };
    let food = getRandomFoodPosition();
    let score = 0;
    let gameOver = false;
    let speed = localStorage.getItem('snakeSpeed') || 100;

    document.addEventListener('keydown', changeDirection);
    document.getElementById('restartButton').addEventListener('click', restartGame);

    let touchStartX = 0;
    let touchStartY = 0;
    canvas.addEventListener('touchstart', handleTouchStart, false);
    canvas.addEventListener('touchmove', handleTouchMove, false);

    function handleTouchStart(evt) {
        const firstTouch = evt.touches[0];
        touchStartX = firstTouch.clientX;
        touchStartY = firstTouch.clientY;
    }

    function handleTouchMove(evt) {
        if (!touchStartX || !touchStartY) {
            return;
        }

        let touchEndX = evt.touches[0].clientX;
        let touchEndY = evt.touches[0].clientY;

        let xDiff = touchStartX - touchEndX;
        let yDiff = touchStartY - touchEndY;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0 && direction.x !== 1) {
                direction = { x: -1, y: 0 };
            } else if (xDiff < 0 && direction.x !== -1) {
                direction = { x: 1, y: 0 };
            }
        } else {
            if (yDiff > 0 && direction.y !== 1) {
                direction = { x: 0, y: -1 };
            } else if (yDiff < 0 && direction.y !== -1) {
                direction = { x: 0, y: 1 };
            }
        }

        touchStartX = 0;
        touchStartY = 0;
    }

    function changeDirection(event) {
        const keyPressed = event.keyCode;
        const UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39;
        if (keyPressed === UP && direction.y !== 1) {
            direction = { x: 0, y: -1 };
        } else if (keyPressed === DOWN && direction.y !== -1) {
            direction = { x: 0, y: 1 };
        } else if (keyPressed === LEFT && direction.x !== 1) {
            direction = { x: -1, y: 0 };
        } else if (keyPressed === RIGHT && direction.x !== -1) {
            direction = { x: 1, y: 0 };
        }
    }

    function drawGame() {
        if (gameOver) return;
        moveSnake();
        if (isGameOver()) {
            gameOver = true;
            showModal();
            return;
        }
        clearCanvas();
        drawFood();
        drawSnake();
        checkFoodCollision();
        document.getElementById('score').textContent = score;
        setTimeout(drawGame, speed);
    }

    function clearCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        ctx.fillStyle = 'green';
        snake.forEach(segment => {
            ctx.fillRect(segment.x + gapSize / 2, segment.y + gapSize / 2, gridSize - gapSize, gridSize - gapSize);
        });
    }

    function moveSnake() {
        const head = { x: snake[0].x + direction.x * gridSize, y: snake[0].y + direction.y * gridSize };
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            food = getRandomFoodPosition();
        } else {
            snake.pop();
        }
    }

    function isGameOver() {
        const head = snake[0];
        return (
            head.x < 0 ||
            head.x >= canvas.width ||
            head.y < 0 ||
            head.y >= canvas.height ||
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x + gapSize / 2, food.y + gapSize / 2, gridSize - gapSize, gridSize - gapSize);
    }

    function checkFoodCollision() {
        const head = snake[0];
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            food = getRandomFoodPosition();
        }
    }

    function getRandomFoodPosition() {
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize,
                y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize,
            };
        } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
        return position;
    }

    function restartGame() {
        snake = [{ x: gridSize * 5, y: gridSize * 5 }];
        direction = { x: 0, y: 0 };
        food = getRandomFoodPosition();
        score = 0;
        gameOver = false;
        hideModal();
        drawGame();
    }

    function showModal() {
        document.getElementById('gameOverModal').classList.remove('hidden');
        document.getElementById('gameOverModal').style.display = 'flex';
    }

    function hideModal() {
        document.getElementById('gameOverModal').classList.add('hidden');
        document.getElementById('gameOverModal').style.display = 'none';
    }

    drawGame();
});
