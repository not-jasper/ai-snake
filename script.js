const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 20;
const TILE_COUNT = 20;
const GAME_WIDTH = TILE_SIZE * TILE_COUNT;
const GAME_HEIGHT = TILE_SIZE * TILE_COUNT;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const directions = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

let snake = [{ x: 10, y: 10 }];
let direction = directions.RIGHT;
let food = { x: 15, y: 15 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

function draw() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  

  ctx.fillStyle = '#444';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * TILE_SIZE, food.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  

  snake.forEach((segment, index) => {
    if (index === 0) {
  
      ctx.fillStyle = '#006400'; 
    } else {

      ctx.fillStyle = 'green';
    }
    ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  });
}

function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  

  if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
    return true; 
  }
  

  if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
    return true; 
  }
  
 
  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    food = { x: Math.floor(Math.random() * TILE_COUNT), y: Math.floor(Math.random() * TILE_COUNT) };
    score++;
    document.getElementById('score').innerText = `Score: ${score}`;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
      document.getElementById('highScore').innerText = `High Score: ${highScore}`;
    }
  } else {
    snake.unshift(head);
    snake.pop();
  }
  
  return false; 
}

function getDistance(point1, point2) {
  return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

function getBestDirection() {
  const head = snake[0];
  const distance = {
    UP: getDistance({ x: head.x, y: head.y - 1 }, food),
    DOWN: getDistance({ x: head.x, y: head.y + 1 }, food),
    LEFT: getDistance({ x: head.x - 1, y: head.y }, food),
    RIGHT: getDistance({ x: head.x + 1, y: head.y }, food)
  };

  let bestDir = direction;
  let minDistance = Number.MAX_SAFE_INTEGER;
  for (const dir in distance) {
    if (distance[dir] < minDistance) {
      minDistance = distance[dir];
      bestDir = directions[dir];
    }
  }

  return bestDir;
}

function restartGame() {
  snake = [{ x: 10, y: 10 }];
  direction = directions.RIGHT;
  food = { x: 15, y: 15 };
  score = 0;
  document.getElementById('score').innerText = `Score: ${score}`;
}

function gameLoop() {
  if (update()) {
    clearInterval(gameInterval);
    console.log("Game Over!");
    restartGame();
    gameInterval = setInterval(gameLoop, 100);
    return;
  }
  
  draw();
  
  direction = getBestDirection();
}

let gameInterval = setInterval(gameLoop, 100);

document.getElementById('highScore').innerText = `High Score: ${highScore}`;
