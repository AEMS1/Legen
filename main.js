let canvas, ctx; let player = { x: 150, y: 280, width: 20, height: 20, color: 'lime', lives: 3 }; let bullets = []; let enemy = { x: 150, y: 10, width: 20, height: 20, color: 'red', direction: 2 }; let enemyBullets = []; let gameRunning = false; let walletAddress = null;

window.onload = () => { canvas = document.getElementById('gameCanvas'); ctx = canvas.getContext('2d'); resizeCanvas(); drawStartScreen(); };

function resizeCanvas() { canvas.width = 320; canvas.height = 300; }

function drawStartScreen() { ctx.fillStyle = 'black'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'white'; ctx.font = '18px Arial'; ctx.fillText('Connect Wallet to Start', 50, 150); }

async function connectWallet() { if (window.ethereum) { try { const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); walletAddress = accounts[0]; document.getElementById('walletAddress').textContent = Wallet: ${walletAddress}; startGame(); } catch (error) { alert('Connection failed.'); } } else { alert('MetaMask not found!'); } }

document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);

document.getElementById('leftBtn').onclick = () => movePlayer(-10); document.getElementById('rightBtn').onclick = () => movePlayer(10); document.getElementById('shootBtn').onclick = shoot;

document.addEventListener('keydown', e => { if (!gameRunning) return; if (e.key === 'ArrowLeft') movePlayer(-10); if (e.key === 'ArrowRight') movePlayer(10); if (e.key === ' ') shoot(); });

function startGame() { player.x = 150; player.lives = 3; bullets = []; enemyBullets = []; gameRunning = true; requestAnimationFrame(gameLoop); }

function gameLoop() { update(); draw(); if (gameRunning) requestAnimationFrame(gameLoop); }

function update() { bullets.forEach(b => b.y -= 5); bullets = bullets.filter(b => b.y > 0);

enemy.x += enemy.direction; if (enemy.x < 0 || enemy.x > canvas.width - enemy.width) enemy.direction *= -1;

if (Math.random() < 0.02) { enemyBullets.push({ x: enemy.x + 10, y: enemy.y + 20, width: 4, height: 10 }); }

enemyBullets.forEach(b => b.y += 5);

bullets.forEach(b => { if (b.x < enemy.x + enemy.width && b.x + b.width > enemy.x && b.y < enemy.y + enemy.height && b.y + b.height > enemy.y) { enemy.x = Math.random() * (canvas.width - enemy.width); bullets = bullets.filter(x => x !== b); } });

enemyBullets.forEach(b => { if (b.x < player.x + player.width && b.x + b.width > player.x && b.y < player.y + player.height && b.y + b.height > player.y) { player.lives--; enemyBullets = enemyBullets.filter(x => x !== b); if (player.lives <= 0) gameOver(); } }); }

function draw() { ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = player.color; ctx.fillRect(player.x, player.y, player.width, player.height);

ctx.fillStyle = enemy.color; ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

ctx.fillStyle = 'white'; bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height)); enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

ctx.fillStyle = 'red'; for (let i = 0; i < player.lives; i++) { ctx.fillRect(10 + i * 25, canvas.height - 20, 20, 10); } }

function movePlayer(dir) { player.x += dir; player.x = Math.max(0, Math.min(canvas.width - player.width, player.x)); }

function shoot() { bullets.push({ x: player.x + 8, y: player.y, width: 4, height: 10 }); }

function gameOver() { gameRunning = false; ctx.fillStyle = 'white'; ctx.font = '20px Arial'; ctx.fillText('Game Over', 100, 150); }
