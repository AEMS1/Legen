let userAddress = "";
const contractAddress = "0x75DaF5e1401a7fE3F1c31a364b62a41Cb9eCf842";
const tokenABI = [  // خلاصه شده فقط برای transfer و transferFrom
  {
    "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "transfer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "transferFrom",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let web3;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];
      document.getElementById("walletAddress").innerText = "Wallet: " + userAddress;

      web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(tokenABI, contractAddress);

      // نمایش پنل ادمین در صورت تطابق آدرس
      if (userAddress.toLowerCase() === "0xYourOwnerAddress".toLowerCase()) {
        document.getElementById("adminPanel").style.display = "block";
      }

    } catch (error) {
      console.error("Connection error:", error);
    }
  } else {
    alert("لطفاً افزونه MetaMask را نصب کنید.");
  }
}

async function placeBet() {
  const betAmount = parseInt(document.getElementById("betAmount").value);
  const selectedToken = document.getElementById("selectedToken").value;
  const direction = document.querySelector('input[name="direction"]:checked').value;

  if (isNaN(betAmount) || betAmount < 10000) {
    alert("مقدار ورودی شرط باید حداقل 10000 توکن باشد.");
    return;
  }

  const fee = betAmount * 0.01;
  const amountAfterFee = betAmount - fee;

  try {
    await contract.methods.transferFrom(userAddress, "0xYourOwnerAddress", betAmount).send({ from: userAddress });

    // شبیه‌سازی نتیجه شرط‌بندی بعد 1 دقیقه
    setTimeout(() => {
      const won = Math.random() > 0.5;
      if (won) {
        contract.methods.transfer(userAddress, amountAfterFee).send({ from: "0xYourOwnerAddress" });
        alert("شما برنده شدید! توکن شما بازگشت داده شد.");
      } else {
        alert("متأسفیم، شما باختید. توکن شما به مالک انتقال یافت.");
      }
    }, 60000);

  } catch (err) {
    console.error("Bet failed:", err);
  }
}

// برای نمایش نرخ زنده (نمونه ساده با قیمت جعلی)
async function updatePrices() {
  document.getElementById("btcPrice").innerText = ;
  document.getElementById("ethPrice").innerText = ;
  document.getElementById("bnbPrice").innerText = ;
  document.getElementById("legendPrice").innerText = "LGD: $0.02 ;
}

setInterval(updatePrices, 5000); // بروزرسانی هر 5 ثانیه

window.addEventListener('load', () => {
  updatePrices();
});

let scores = {};  // مثال: {'0xabc...': 5}

function updateLeaderboard() {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const tbody = document.getElementById("leaderboardBody");
  tbody.innerHTML = "";

  sorted.forEach(([address, score], index) => {
    const row = `<tr>
      <td>${index + 1}</td>
      <td>${address}</td>
      <td>${score}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// بعد از برنده شدن در شرط، امتیاز اضافه کن:
function addScore(address, multiplier) {
  if (!scores[address]) scores[address] = 0;
  scores[address] += multiplier;  // مضرب وارد شده شرط
  updateLeaderboard();
}

// بروزرسانی کد شرط بندی:
if (won) {
  addScore(userAddress, betAmount / 10000);  // فرض مضرب به نسبت 10000
}
