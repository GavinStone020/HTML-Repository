const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 100;
const ballRadius = 10;

const player = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0,
  speed: 5
};

const ai = {
  x: canvas.width - paddleWidth - 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 3
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: ballRadius,
  speed: 5,
  dx: 5,
  dy: 5
};

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = -ball.dx;
  ball.dy = Math.random() > 0.5 ? 5 : -5;
}

function update() {
  // Move player paddle
  player.y += player.dy;

  // Prevent player paddle from going out of bounds
  player.y = Math.max(Math.min(player.y, canvas.height - paddleHeight), 0);

  // Move AI paddle
  if (ai.y + paddleHeight / 2 < ball.y) {
    ai.y += ai.speed;
  } else {
    ai.y -= ai.speed;
  }

  // Clamp AI paddle
  ai.y = Math.max(Math.min(ai.y, canvas.height - paddleHeight), 0);

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Top and bottom collision
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  // Player paddle collision
  if (
    ball.x - ball.radius < player.x + player.width &&
    ball.y > player.y &&
    ball.y < player.y + player.height
  ) {
    ball.dx = -ball.dx;
  }

  // AI paddle collision
  if (
    ball.x + ball.radius > ai.x &&
    ball.y > ai.y &&
    ball.y < ai.y + ai.height
  ) {
    ball.dx = -ball.dx;
  }

  // Score condition
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    resetBall();
  }
}

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, "#000"); // Clear canvas
  drawRect(player.x, player.y, player.width, player.height, "#fff");
  drawRect(ai.x, ai.y, ai.width, ai.height, "#fff");
  drawCircle(ball.x, ball.y, ball.radius, "#fff");
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    player.dy = -player.speed;
  } else if (e.key === "ArrowDown") {
    player.dy = player.speed;
  }
});

document.addEventListener("keyup", () => {
  player.dy = 0;
});

gameLoop();