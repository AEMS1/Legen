// --- Setup Web3Modal for multiple wallets ---
const providerOptions = {
    walletconnect: {
      package: window.WalletConnectProvider.default,
      options: {
        infuraId: "YOUR_INFURA_ID" // جایگزین با Infura ID خودت
      }
    }
  };
  
  const web3Modal = new Web3Modal.default({
    cacheProvider: false,
    providerOptions,
  });
  
  let provider;
  let signer;
  let userAddress;
  let contractAddress = "0x4751C0DE56EFB3770615097347cbF131D302498A"; // آدرس توکن LGD
  let ownerAddress = "0xec54951C7d4619256Ea01C811fFdFa01A9925683"; // کیف پول مالک برای کارمزدها
  
  const connectWalletBtn = document.getElementById("connectWalletBtn");
  const walletAddressSpan = document.getElementById("walletAddress");
  const tokenBalanceSpan = document.getElementById("tokenBalance");
  const enterGameBtn = document.getElementById("enterGameBtn");
  const statusMsg = document.getElementById("statusMsg");
  
  connectWalletBtn.onclick = async () => {
    try {
      const instance = await web3Modal.connect();
      provider = new ethers.providers.Web3Provider(instance);
      signer = provider.getSigner();
      userAddress = await signer.getAddress();
  
      walletAddressSpan.textContent = userAddress;
      document.getElementById("walletInfo").style.display = "block";
      connectWalletBtn.style.display = "none";
  
      await updateTokenBalance();
  
      enterGameBtn.disabled = false;
      statusMsg.textContent = "";
    } catch (e) {
      console.error(e);
      statusMsg.textContent = "Wallet connection failed.";
    }
  };
  
  // --- ABI ساده ERC20 برای خواندن موجودی و انتقال ---
  const tokenABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint amount) returns (bool)",
  ];
  
  // --- نمایش موجودی توکن LGD ---
  async function updateTokenBalance() {
    const tokenContract = new ethers.Contract(contractAddress, tokenABI, provider);
    const balance = await tokenContract.balanceOf(userAddress);
    tokenBalanceSpan.textContent = ethers.utils.formatUnits(balance, 18);
  }
  
  // --- شرط ورود بازی ---
  const entryFee = ethers.utils.parseUnits("10000", 18);
  
  // --- وارد شدن به بازی و پرداخت ورودی ---
  enterGameBtn.onclick = async () => {
    statusMsg.textContent = "Processing entry fee transaction...";
  
    try {
      const tokenContract = new ethers.Contract(contractAddress, tokenABI, signer);
      // بررسی موجودی
      const balance = await tokenContract.balanceOf(userAddress);
      if (balance.lt(entryFee)) {
        statusMsg.textContent = "Insufficient LGD token balance.";
        return;
      }
  
      // انتقال 10000 LGD به کیف پول مالک (ورودی بازی)
      const tx = await tokenContract.transfer(ownerAddress, entryFee);
      statusMsg.textContent = "Waiting for transaction confirmation...";
      await tx.wait();
  
      statusMsg.textContent = "Entry fee paid! Game starting...";
      enterGameBtn.disabled = true;
  
      startGame();
    } catch (err) {
      console.error(err);
      statusMsg.textContent = "Transaction failed or rejected.";
    }
  };
  
  // ----------- بازی ------------
  
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  
  let playerLives = 3;
  let player;
  let bullets = [];
  let enemies = [];
  let keys = {};
  let gameRunning = false;
  
  const GAME_WIDTH = canvas.width;
  const GAME_HEIGHT = canvas.height;
  
  // --- بازیکن ---
  class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 30;
      this.height = 20;
      this.speed = 5;
      this.color = "#00ff00";
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    moveLeft() {
      this.x = Math.max(0, this.x - this.speed);
    }
    moveRight() {
      this.x = Math.min(GAME_WIDTH - this.width, this.x + this.speed);
    }
    shoot() {
      bullets.push(new Bullet(this.x + this.width / 2, this.y));
    }
  }
  
  // --- تیر ---
  class Bullet {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 4;
      this.height = 8;
      this.speed = 7;
      this.color = "#ffff00";
      this.active = true;
    }
    draw() {
      if (!this.active) return;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
      this.y -= this.speed;
      if (this.y < 0) this.active = false;
    }
  }
  
  // --- دشمن (ربات) ---
  class Enemy {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 30;
      this.height = 20;
      this.speed = 2;
      this.color = "#ff0000";
      this.direction = 1; // 1: right, -1: left
      this.active = true;
      this.lives = 3;
    }
    draw() {
      if (!this.active) return;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
      this.x += this.speed * this.direction;
      if (this.x <= 0 || this.x + this.width >= GAME_WIDTH) {
        this.direction *= -1;
        this.y += 20;
      }
    }
    hit() {
      this.lives--;
      if (this.lives <= 0) {
        this.active = false;
      }
    }
  }
  
  // --- مدیریت کلیدها ---
  window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
  });
  
  window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });
  
  // --- شروع بازی ---
  function startGame() {
    gameRunning = true;
    playerLives = 3;
    bullets = [];
    enemies = [];
    player = new Player(GAME_WIDTH / 2 - 15, GAME_HEIGHT - 40);
  
    // ایجاد یک دشمن (ربات) در بالا
    enemies.push(new Enemy(GAME_WIDTH / 2 - 15, 30));
  
    requestAnimationFrame(gameLoop);
  }
  
  // --- حلقه بازی ---
  function gameLoop() {
    if (!gameRunning) return;
  
    // پاک کردن صفحه
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  
    // حرکت بازیکن
    if (keys["ArrowLeft"]) player.moveLeft();
    if (keys["ArrowRight"]) player.moveRight();
    if (keys["Space"]) {
      if (!player.shootCooldown) {
        player.shoot();
        player.shootCooldown = 20; // محدودیت سرعت شلیک
      }
    }
    if (player.shootCooldown > 0) player.shootCooldown--;
  
    player.draw();
  
    // حرکت تیرها
    bullets.forEach((bullet) => {
      bullet.update();
      bullet.draw();
    });
  
    bullets = bullets.filter((b) => b.active);
  
    // حرکت دشمنان
    enemies.forEach((enemy) => {
      enemy.update();
      enemy.draw();
    });
  
    // برخورد تیر با دشمن
    bullets.forEach((bullet) => {
      enemies.forEach((enemy) => {
        if (
          enemy.active &&
          bullet.active &&
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          bullet.active = false;
          enemy.hit();
        }
      });
    });
  
    // بررسی برد و باخت
    if (enemies.every((e) => !e.active)) {
      gameRunning = false;
      statusMsg.textContent = "You won! Calculating reward...";