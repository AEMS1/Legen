// منطق بازی، کنترل پلیر، جنگ با بازیکن یا ربات، جایزه

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnShoot = document.getElementById("btnShoot");

let gameStarted = false;

const playerWidth = 50;
const playerHeight = 30;
const playerSpeed = 7;
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 10;

let playerLives = 3;

const bulletWidth = 5;
const bulletHeight = 10;
const bulletSpeed = 10;

let bullets = [];

function resetGame() {
  playerX = canvas.width / 2 - playerWidth / 2;
  playerLives = 3;
  bullets = [];
  gameStarted = true;
  document.getElementById("statusMsg").textContent = "Game started! Good luck!";
}

function drawPlayer() {
  ctx.fillStyle = "lime";
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
  });
}

function movePlayerLeft() {
  if (playerX > 0) playerX -= playerSpeed;
}

function movePlayerRight() {
  if (playerX < canvas.width - playerWidth) playerX += playerSpeed;
}

function playerShoot() {
  bullets.push({ x: playerX + playerWidth / 2 - bulletWidth / 2, y: playerY });
}

function updateBullets() {
  bullets.forEach((bullet, i) => {
    bullet.y -= bulletSpeed;
    if (bullet.y < 0) bullets.splice(i, 1);
  });
}

function drawLives() {
  ctx.fillStyle = "red";
  for (let i = 0; i < playerLives; i++) {
    ctx.fillRect(10 + i * 25, 10, 20, 20);
  }
}

// ساده‌ترین ربات با هوش 90% که تیر را جاخالی می‌دهد (نمونه اولیه)

let botX = canvas.width / 2 - playerWidth / 2;
let botY = 30;
let botLives = 3;
let botDirection = 1; // 1: راست، -1: چپ
let botSpeed = 5;
let botBullets = [];
let botShootChance = 0.9; // 90% احتمال تیر زدن

function drawBot() {
  ctx.fillStyle = "red";
  ctx.fillRect(botX, botY, playerWidth, playerHeight);
}

function botShoot() {
  if (Math.random() < botShootChance) {
    botBullets.push({ x: botX + playerWidth / 2 - bulletWidth / 2, y: botY + playerHeight });
  }
}

function updateBotBullets() {
  botBullets.forEach((bullet, i) => {
    bullet.y += bulletSpeed;
    if (bullet.y > canvas.height) botBullets.splice(i, 1);
  });
}

function updateBotPosition() {
  botX += botSpeed * botDirection;
  if (botX <= 0) botDirection = 1;
  else if (botX >= canvas.width - playerWidth) botDirection = -1;
}

function botAvoidBullets() {
  // ربات سعی می‌کند تیرهای بازیکن را جاخالی دهد با احتمال 90%
  bullets.forEach(bullet => {
    if (
      bullet.y < botY + playerHeight + 40 && // تیر نزدیک به ربات
      bullet.x > botX - 20 &&
      bullet.x < botX + playerWidth + 20
    ) {
      // جاخالی با احتمال 90%
      if (Math.random() < 0.9) {
        botDirection = bullet.x > botX ? -1 : 1; // به