let userWallet = null;
const ownerWallet = "0xec54951C7d4619256Ea01C811fFdFa01A9925683"; // کیف پول شما

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      userWallet = accounts[0];
      document.getElementById('wallet-address').innerText = Wallet: ${userWallet};
      alert("Wallet connected: " + userWallet);
    } catch (error) {
      alert("Wallet connection rejected.");
    }
  } else {
    alert("Please install MetaMask!");
  }
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);

// شرط بندی
document.getElementById("placeBet").addEventListener("click", function () {
  if (!userWallet) {
    alert("Connect your wallet first.");
    return;
  }

  const token = document.getElementById("betToken").value;
  const prediction = document.getElementById("betPrediction").value;
  const multiplier = parseInt(document.getElementById("betMultiplier").value);

  if (![1, 2, 3, 4, 5].includes(multiplier)) {
    alert("Invalid multiplier.");
    return;
  }

  const entryAmounts = {
    1: 10000,
    2: 15000,
    3: 20000,
    4: 25000,
    5: 30000
  };

  const entryAmount = entryAmounts[multiplier];
  const fee = Math.floor(entryAmount * 0.01); // 1% کارمزد
  const actualAmount = entryAmount - fee;

  alert(`Bet Placed!
Token: ${token}
Prediction: ${prediction}
Multiplier: ${multiplier}
Fee: ${fee}
You Will Bet: ${actualAmount}`);

  // اینجای کد باید متصل شود به smart contract برای انجام واقعی انتقال‌ها
});

// نمایش لیست برترین‌ها
const leaderboard = [
  { address: "0xUser1", score: 90 },
  { address: "0xUser2", score: 80 },
  { address: "0xUser3", score: 75 }
];

function loadLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  leaderboard.forEach(user => {
    const li = document.createElement("li");
    li.textContent = ${user.address} - ${user.score} points;
    list.appendChild(li);
  });
}

window.onload = loadLeaderboard;
