const walletAddressDisplay = document.getElementById("wallet-address");
const leaderboard = document.getElementById("leaderboard");
const countdownDisplay = document.getElementById("countdown");

let userAddress = null;
let leaderboardData = [];
let endTime = new Date();
endTime.setDate(endTime.getDate() + 5);

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      userAddress = accounts[0];
      walletAddressDisplay.innerText = "Wallet Connected: " + userAddress;
      checkAdmin();
    } catch (err) {
      alert("Wallet connection failed!");
    }
  } else {
    alert("MetaMask not found. Please install it.");
  }
}

function updateCountdown() {
  const now = new Date();
  const distance = endTime - now;
  if (distance <= 0) {
    countdownDisplay.innerText = "Event ended!";
    return;
  }
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  countdownDisplay.innerText = ${days} days remaining;
}

function getLivePrices() {
  const prices = {
    BTC: (Math.random() * 1000 + 60000).toFixed(2),
    ETH: (Math.random() * 100 + 3000).toFixed(2),
    BNB: (Math.random() * 20 + 500).toFixed(2),
    LGD: (Math.random() * 0.1 + 0.01).toFixed(5),
  };

  document.getElementById("live-prices").innerHTML = `
    <ul>
      <li>Bitcoin: $${prices.BTC}</li>
      <li>Ethereum: $${prices.ETH}</li>
      <li>Binance: $${prices.BNB}</li>
      <li>Legend (LGD): $${prices.LGD}</li>
    </ul>
  `;
}

function submitPrediction() {
  const selectedToken = document.getElementById("select-token").value;
  const selectedMultiplier = parseInt(document.getElementById("select-multiplier").value);

  const minEntry = {
    1: 10000,
    2: 15000,
    3: 20000,
    4: 25000,
    5: 30000,
  }[selectedMultiplier];

  const entryAmount = minEntry;
  const win = Math.random() > 0.5;

  const earnedScore = selectedMultiplier;
  const netTokens = win ? entryAmount * 0.99 : 0;
  const msg = win ? 
    You won! Refunded: ${netTokens}, Score: ${earnedScore} :
    You lost. Tokens sent to admin.;

  alert(msg);

  if (win) {
    updateLeaderboard(userAddress, earnedScore);
  }

  // Simulated contract interaction:
  console.log({
    address: userAddress,
    token: selectedToken,
    multiplier: selectedMultiplier,
    entryAmount,
    result: win ? "win" : "lose",
  });
}

function updateLeaderboard(address, score) {
  const user = leaderboardData.find(u => u.address === address);
  if (user) {
    user.score += score;
  } else {
    leaderboardData.push({ address, score });
  }

  leaderboardData.sort((a, b) => b.score - a.score);
  leaderboard.innerHTML = leaderboardData.slice(0, 10).map((u, i) => 
    <div>#${i+1} ${u.address.slice(0,6)}... - ${u.score} pts</div>
  ).join("");
}

function checkAdmin() {
  const admin = "0xec54951C7d4619256Ea01C811fFdFa01A9925683".toLowerCase();
  if (userAddress && userAddress.toLowerCase() === admin) {
    document.getElementById("admin-panel").style.display = "block";
  }
}

setInterval(() => {
  updateCountdown();
  getLivePrices();
}, 5000);

connectWallet();
