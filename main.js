let provider; let signer; let playerAddress; const LGD_TOKEN = "0x4751C0DE56EFB3770615097347cbF131D302498A"; const GAME_ENTRY = ethers.utils.parseUnits("10000", 18); const GAME_WALLET = "0xeD2952010b50480F4Cc5829d8e29A1E499f30c74"; // site wallet const ABI = [ "function balanceOf(address) view returns (uint256)", "function transfer(address to, uint256 amount) returns (bool)" ];

const connectBtn = document.getElementById("connectBtn"); const walletInfo = document.getElementById("walletInfo"); const walletAddressEl = document.getElementById("walletAddress"); const lgdBalanceEl = document.getElementById("lgdBalance"); const enterGameBtn = document.getElementById("enterGame");

connectBtn.onclick = async () => { if (!window.ethereum) return alert("Install MetaMask or Wallet Extension."); provider = new ethers.providers.Web3Provider(window.ethereum); await provider.send("eth_requestAccounts", []); signer = provider.getSigner(); playerAddress = await signer.getAddress(); walletInfo.style.display = "block"; walletAddressEl.textContent = playerAddress;

const lgd = new ethers.Contract(LGD_TOKEN, ABI, provider); const balance = await lgd.balanceOf(playerAddress); lgdBalanceEl.textContent = ethers.utils.formatUnits(balance, 18); };

enterGameBtn.onclick = async () => { const lgd = new ethers.Contract(LGD_TOKEN, ABI, signer); const tx = await lgd.transfer(GAME_WALLET, GAME_ENTRY); await tx.wait(); alert("Entry paid. Game starting..."); startGame(); };

// Game logic: const canvas = document.getElementById("gameCanvas"); const ctx = canvas.getContext("2d");

let player = { x: 175, y: 280, lives: 3, bullets: [] }; let enemy = { x: 175, y: 20, bullets: [], isBot: true }; let keys = {};

function startGame() { document.addEventListener("keydown", e => keys[e.key] = true); document.addEventListener("keyup", e => keys[e.key] = false);

document.getElementById("leftBtn").onclick = () => keys["ArrowLeft"] = true; document.getElementById("rightBtn").onclick = () => keys["ArrowRight"] = true; document.getElementById("shootBtn").onclick = shoot;

setInterval(updateGame, 50); setInterval(enemyAI, 500); }

function shoot() { player.bullets.push({ x: player.x + 10, y: player.y }); }

function enemyAI() { if (Math.random() < 0.7) { if (enemy.x < player.x) enemy.x += 10; else if (enemy.x > player.x) enemy.x -= 10; } if (Math.random() < 0.3) enemy.bullets.push({ x: enemy.x + 10, y: enemy.y + 10 }); }

function updateGame() { ctx.clearRect(0, 0, canvas.width, canvas.height);

// Move player if (keys["ArrowLeft"]) player.x -= 5; if (keys["ArrowRight"]) player.x += 5;

// Draw player & enemy ctx.fillStyle = "lime"; ctx.fillRect(player.x, player.y, 20, 20); ctx.fillStyle = "red"; ctx.fillRect(enemy.x, enemy.y, 20, 20);

// Player bullets player.bullets.forEach((b, i) => { b.y -= 5; ctx.fillRect(b.x, b.y, 5, 10); if (b.y < 0) player.bullets.splice(i, 1); if (b.x > enemy.x && b.x < enemy.x + 20 && b.y < enemy.y + 20) { alert("You win! Reward sent after fee."); location.reload(); } });

// Enemy bullets enemy.bullets.forEach((b, i) => { b.y += 5; ctx.fillRect(b.x, b.y, 5, 10); if (b.y > canvas.height) enemy.bullets.splice(i, 1); if (b.x > player.x && b.x < player.x + 20 && b.y > player.y) { player.lives--; enemy.bullets.splice(i, 1); if (player.lives <= 0) { alert("Game Over!"); location.reload(); } } });

keys["ArrowLeft"] = false; keys["ArrowRight"] = false; }
