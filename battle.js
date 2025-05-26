const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 180, y: 550, bullets: [] };
let enemy = { x: 180, y: 50, bullets: [], isBot: true, dir: 2 };

function initGame() {
  document.addEventListener("keydown", handleKeyDown);
  setInterval(gameLoop, 30);
  if (enemy.isBot) setInterval(botShoot, 1000);
}

function handleKeyDown(e) {
  if (e.key === "a" || e.key === "ArrowLeft") player.x -= 10;
  if (e.key === "d" || e.key === "ArrowRight") player.x += 10;
  if (e.key === " " || e.key === "Spacebar") shoot(player.bullets, player.x + 10, player.y);
}

function shoot(bullets, x, y, speed = -5) {
  bullets.push({ x: x, y: y, speed: speed });
}

function botShoot() {
  shoot(enemy.bullets, enemy.x + 10, enemy.y + 20, 5);
}

function drawShip(x, y, color = "lime") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 20, 20);
}

function drawBullet(b) {
  ctx.fillStyle = "red";
  ctx.fillRect(b.x, b.y, 4, 10);
}

function checkCollision(bullets, target) {
  return bullets.some(b => b.x >= target.x && b.x <= target.x + 20 && b.y >= target.y && b.y <= target.y + 20);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // حرکت دشمن
  if (enemy.isBot) {
    enemy.x += enemy.dir;
    if (enemy.x < 0 || enemy.x > canvas.width - 20) enemy.dir *= -1;
  }

  // کشیدن سفینه‌ها
  drawShip(player.x, player.y, "lime");
  drawShip(enemy.x, enemy.y, "orange");

  // کشیدن گلوله‌ها
  player.bullets.forEach((b, i) => {
    b.y += b.speed;
    drawBullet(b);
    if (b.y < 0) player.bullets.splice(i, 1);
  });

  enemy.bullets.forEach((b, i) => {
    b.y += b.speed;
    drawBullet(b);
    if (b.y > canvas.height) enemy.bullets.splice(i, 1);
  });

  // برخورد
  if (checkCollision(player.bullets, enemy)) {
    document.getElementById("status").innerText = "You Win!";
    stopGame();
  }

  if (checkCollision(enemy.bullets, player)) {
    document.getElementById("status").innerText = "You Lose!";
    stopGame();
  }
}

function stopGame() {
  document.removeEventListener("keydown", handleKeyDown);
  player.bullets = [];
  enemy.bullets = [];
}