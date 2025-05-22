let userAddress = null;
const tokenAddress = "0x75DaF5e1401a7fE3F1c31a364b62a41Cb9eCf842";
const tokenABI = [ /* ABI که قبلاً فرستادید */ ];
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(tokenAddress, tokenABI, signer);
const ownerWallet = "0xYourWalletAddress"; // آدرس کیف پول مالک

// اتصال به کیف پول
async function connectWallet() {
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    userAddress = accounts[0];
    document.getElementById("wallet-address").innerText = userAddress;
  } catch (err) {
    alert("Connection failed: " + err.message);
  }
}

// دریافت قیمت زنده
async function getPrice(symbol) {
  const url = https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd;
  const res = await fetch(url);
  const data = await res.json();
  return data[symbol].usd;
}

// نمایش نرخ زنده
async function updatePrices() {
  const symbols = ["bitcoin", "ethereum", "binancecoin"];
  for (const symbol of symbols) {
    const price = await getPrice(symbol);
    document.getElementById(price-${symbol}).innerText = $${price};
  }
}
setInterval(updatePrices, 10000);
updatePrices();

// خرید توکن
async function buyToken(amount) {
  const weiAmount = ethers.utils.parseUnits(amount.toString(), 18);
  const fee = weiAmount.div(100); // 1%
  const net = weiAmount.sub(fee);
  await contract.transferFrom(userAddress, ownerWallet, fee);
  await contract.transferFrom(userAddress, tokenAddress, net);
  alert("Purchase completed!");
}

// شرط بندی
async function placeBet(symbol, direction, betAmount) {
  if (!userAddress) return alert("Connect wallet first!");
  if (parseFloat(betAmount) < 10) return alert("Minimum bet is 10 tokens");

  const startPrice = await getPrice(symbol);
  const bet = {
    symbol,
    direction,
    amount: betAmount,
    startPrice,
    timestamp: Date.now()
  };

  localStorage.setItem("currentBet", JSON.stringify(bet));
  alert("Bet placed! Result in 60 seconds...");
  
  setTimeout(async () => {
    const latestPrice = await getPrice(symbol);
    const win = (bet.direction === "up" && latestPrice > bet.startPrice) || 
                (bet.direction === "down" && latestPrice < bet.startPrice);
    const tokens = ethers.utils.parseUnits(bet.amount.toString(), 18);

    if (win) {
      await contract.transferFrom(ownerWallet, userAddress, tokens);
      alert("You won! Tokens returned.");
    } else {
      await contract.transferFrom(userAddress, ownerWallet, tokens);
      alert("You lost. Tokens sent to owner.");
    }

    // ذخیره امتیاز
    let score = parseInt(localStorage.getItem("score") || 0);
    score += win ? 1 : 0;
    localStorage.setItem("score", score);
    updateLeaderboard();
  }, 60000);
}

// نمایش رتبه‌بندی
function updateLeaderboard() {
  const score = parseInt(localStorage.getItem("score") || 0);
  document.getElementById("rank").innerText = Your Points: ${score};
}
